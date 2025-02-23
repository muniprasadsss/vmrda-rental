import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { ReceptDetailsService } from '../services/receptDetails/recept-details.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators,FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ChangeRequestService } from '../services/changeRequest/change-request.service';
import { BillDetailsService } from '../services/billDetails/bill-details.service';
import { UserServiceService } from '../services/userService/user-service.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-receipt-details',
  standalone: true,
  imports: [PrimeNgModule,ReactiveFormsModule,FormsModule],
  templateUrl: './receipt-details.component.html',
  styleUrl: './receipt-details.component.scss'
})
export class ReceiptDetailsComponent {
  visible: boolean = false;
  userRole:any
  userID:any
  receiptData:any
  addNewRecept: FormGroup;
  hideAddNew:boolean= false;
  bill_status:string = '';
  @ViewChild('dt2') dt2!: any;
  value: any;
  fileToUpload: any;
  attachmentUrl:any = null
  bill:any;
  submitted = false; // track amountpaid input field
  complexList:[] = [];
  locationList:[] = [];
  allAlloteList:[] = [];
  propertyFilter:any[] = [];
  locationFilter:any[] = [];
  alloteFilter:any[]=[];
  userdataforreciept!:any;
  localuserData!:any;
  localuserjsondata!:any;
  
  constructor(private http:ReceptDetailsService,
    private Http: ChangeRequestService,
    private billDetailService: BillDetailsService,
    private userService: UserServiceService,
    private fb: FormBuilder,
    private toasterservice: ToastrService,
    private cd: ChangeDetectorRef){

    this.addNewRecept = this.fb.group({
      billNo: [null, Validators.required],
      User:[{ value: null, disabled: true }],
      Property:[{ value: null, disabled: true }],
      Bill_Period:[{ value: null, disabled: true }],
      Total:[{ value: null, disabled: true }],
      Status:[{ value: null, disabled: true }],
      challanaNumber: {value: null },
      amount_paid: [null, Validators.required],
    });
  }

  ngOnInit(){
    this.userRole = localStorage.getItem('role')
    this.userID = localStorage.getItem('userId')
    this.localuserData=localStorage.getItem("userInfo");
    this.localuserjsondata = JSON.parse(this.localuserData);
    console.log(this.localuserjsondata);
    
    this.getReceptData();
  }
  showDialog() {
    this.visible = true;
}

onFilterGlobal(event: Event): void {
  const target = event.target as HTMLInputElement;
  this.value = target.value;
  this.dt2.filterGlobal(this.value, 'contains');
}

  getReceptData(){
    this.http.getReciptDetails(this.userID,this.userRole).subscribe({
      next:(res:any)=>{
        this.receiptData = res.receiptData;
        this.locationList = res.location;
        this.complexList = res.complex;
        this.allAlloteList = res.allAlloteNames;
      },
      error:(err:any)=>{

      }
    })
    this.cd.detectChanges();
  }

  getuserdataforreciept(reciept : any){
    console.log(reciept.User);
    if(this.userRole === "USER"){
      const username=this.localuserjsondata.USER_NAME;
      console.log(username,'0-0-0-');
      this.generatePDF(reciept,username);
      console.log('user reciept added------------');
    }
    else{
    this.http.getuserdataforreciept(reciept.User).subscribe({
      next:(response)=>{
        console.log(reciept.User,'---');
        this.userdataforreciept=response.data;
        console.log(this.userdataforreciept,"data retrieved successfully");
        console.log("Admin reci=eipt added");
        
        this.generatePDF(reciept,this.userdataforreciept.USER_NAME)
      },
      error:(error)=>{
        console.error(error,"error on retrieving data");
      }
    })
  }

  }

generatePDF(receipt: any,username:any) {
  const doc = new jsPDF();

  // Page margins
  const margins = { top: 15, bottom: 15, left: 20, right: 20 };
  const lineHeight = 8;
  let currentY = margins.top;

  // Optimize logo: Ensure this is a small, compressed image
  const vmrdaLogoBase64 = '../../assets/vmrda_logo_image.png';
  const logoWidth = 20;
  const logoHeight = 20;
  const logoX = (doc.internal.pageSize.width - logoWidth) / 2;
  doc.addImage(vmrdaLogoBase64, 'PNG', logoX, currentY, logoWidth, logoHeight, '', 'FAST');
  currentY += logoHeight + 5;

  // Draw border
  doc.setLineWidth(0.5);
  doc.rect(margins.left - 5, margins.top - 5,
    doc.internal.pageSize.width - (margins.left + margins.right - 10),
    doc.internal.pageSize.height - (margins.top + margins.bottom - 10));

  // Heading
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('VISAKHAPATNAM METROPOLITAN REGION DEVELOPMENT AUTHORITY',
    doc.internal.pageSize.width / 2, currentY, { align: 'center' });
  currentY += lineHeight + 2;

  // Subheading
  doc.setFontSize(12);
  doc.text('Receipt', doc.internal.pageSize.width / 2, currentY, { align: 'center' });
  currentY += lineHeight;

  // Adding date and receipt reference
  const currentDate = new Date().toLocaleDateString();
  doc.setFont('helvetica', 'normal');
  doc.text(`Receipt No: `, margins.left, currentY);
  doc.setFont('helvetica', 'bold');
  doc.text(`${receipt.ReceiptNo}`, margins.left + 30, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: `, doc.internal.pageSize.width - margins.right - 45, currentY);
  doc.setFont('helvetica', 'bold');
  doc.text(`${receipt.paid_date}`, doc.internal.pageSize.width - margins.right - 30, currentY);
  currentY += lineHeight * 2;

  // Dynamic content
  doc.setFont('helvetica', 'bold');
  doc.text(`Property Name: `, margins.left, currentY);
  doc.setFont('helvetica', 'bold');
  doc.text(`${receipt.Property}`, margins.left + 40, currentY);
  currentY += lineHeight;

  // Summary Text
  doc.setFont('helvetica', 'normal');
  doc.text(
    `This receipt acknowledges the payment for property code ${receipt.Property}, for the bill period of:${receipt.Bill_Period} leased to ${username}. ` +
    `Payment includes the lease amount, GST, and other charges. Summary of payment details:`,
    margins.left, currentY, { maxWidth: doc.internal.pageSize.width - margins.left - margins.right }
  );
  currentY += lineHeight * 3;

  // Receipt details in table form
  const tableRows = [
    ["Receipt No", receipt.ReceiptNo],
    ["User Name", username],
    ["Bill No", receipt.BillNo],
    ["Property Code", receipt.Property],
    ["Bill Period", receipt.Bill_Period],
    ["Interest", receipt.Total_rental_interest],
    ["Paid Date", receipt.paid_date],
    ["Water Bill", receipt.Water_bill],
    ["Power Bill", receipt.Power_bill],
    ["Maintenance Bill", receipt.Maintainance_bill],
    ["GST", receipt.GST],
    ["Total Bill Amount", receipt.Total],
    // ["Total Paid", receipt.TotalPaid],
    ["Paid Amount", receipt.Current_Payment],
    // ["Due Amount", receipt.Due],
    ["Payment Status", receipt.Status]
  ];

  const tableStartY = currentY + 7;

  // Using autoTable for structured receipt details
  autoTable(doc, {
    body: tableRows,
    startY: tableStartY,
    margin: { left: margins.left + 10, right: margins.right + 10 },
    tableWidth: doc.internal.pageSize.width - margins.left - margins.right - 20,
    theme: 'grid',
    headStyles: {
      fillColor: [0, 102, 204],
      textColor: [255, 255, 255],
      fontSize: 12 // Smaller font for table header
    },
    styles: {
      fontSize: 12, // Reduce font size in the table
      cellPadding: 1 // Reduce padding to save space
    }
  });

  // Update currentY to the position after the table
  currentY = doc.internal.pageSize.height - margins.bottom - 40;

  // Footer content
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for your payment. Please retain this receipt for your records.', margins.left, currentY);
  currentY += lineHeight;

  doc.text('Regards,', margins.left, currentY);
  currentY += lineHeight;
  doc.text('VISAKHAPATNAM METROPOLITAN REGION DEVELOPMENT AUTHORITY', margins.left, currentY);

  // Save the PDF
  doc.save(`Receipt_${receipt.ReceiptNo}.pdf`);
}

  addNewUser() {
    if (this.addNewRecept.valid) {

      // Close the dialog after logging
      this.visible = false;
      // Optionally, you can reset the form
      this.addNewRecept.reset();
    } else {

    }
  }
     // Handle file input change
     onFileChange(event: any) {
      const files = event.target.files; // Get the list of selected files
      if (files && files.length > 0) { // Check if any file is selected
          const file = files[0]; // Get the first file
          this.fileToUpload = file;
          this.uploadattachment(); // Trigger upload function
      } else {
          console.warn('No file selected');
      }
  }
  

    uploadattachment(){
      let fd = new FormData();
      fd.append('image',  this.fileToUpload);
      this.Http.uploadAttachment(fd).subscribe({
        next:(res:any)=>{
          this.attachmentUrl = res.location;
          this.fileToUpload = null;
        },
        error:(err:any)=>{
        }
      })
    }
  
    downloadFile(url: string) {
      if (url) {
        // Open the S3 URL in a new tab
        window.open(url, '_blank');
      } else {
        console.error('No attachment URL provided');
      }
    }
    
  fetchBillDetails(billNo:any){
    this.http.getBillDetails(billNo).subscribe({
      next:(res:any)=>{
        if(res.Status !== 'Fully Paid'){
          this.bill = res;
          this.bill_status = res.Status;
          this.addNewRecept.patchValue({
            billNo: res.BillNo,
            User: res.ALLOTTEE_NAME,
            Property: res.PROPERTY_NAME,
            Bill_Period:  res.Bill_Period,
            Total: res.Total,
            Status: res.Status,
            challanaNumber:res.challana_number
          })
              this.hideAddNew = true;
        }
        else{
          this.toasterservice.warning('Bill already paid')
          this.bill_status = '';
          this.bill= null;

        }
       
      }
    })
  }

  addReciept() {
    this.submitted=true;
    // Get the form values
    const form = this.addNewRecept.value;
  
    // Check if the required fields are present
    const p_billid = this.bill?.BillNo;
    const p_payment_amount = this.addNewRecept.get('amount_paid')?.value;
    const challana_number = this.addNewRecept.get('challanaNumber')?.value;
  
  
    if (!p_billid || !p_payment_amount) {
      // If either of the required fields is missing, show a toaster warning
      // this.toasterservice.warning('Amount Paid is required');
      return; // Exit the method early if validation fails
    }
  
    // If validation passes, proceed with API call
    if (this.bill_status !== 'Fully Paid') {
      const updateData = {
        p_billid: p_billid,
        p_payment_amount: p_payment_amount,
        challana_number:challana_number,
        attachment_url:this.attachmentUrl
      };
  
      this.billDetailService.updateBillDetailsByBillNo(updateData).subscribe({
        next: (response) => {
          if (response.status === 200) {
            this.toasterservice.success('Receipt Successfully Added');
            this.bill_status = '';
            this.bill = null;
          } else {
            this.bill_status = '';
            this.bill = null;
            console.error('Error updating bill:', response.message);
          }
        },
        error: (err: any) => {
          this.toasterservice.warning(err);
          this.bill_status = '';
          this.bill = null;
          console.error('Error updating bill:', err);
        },
      });
    } else {
      this.bill_status = '';
      this.bill = null;
      this.toasterservice.warning('Bill already paid');
    }
  }
  

createReceipt(receiptData: any) {

  this.billDetailService.updateBillDetailsByBillNo(receiptData).subscribe((response) => {
    if (response.message == "receipt created successfully") {
      // this.createAndSendReceiptPDF(receiptData);
      this.visible = false; // Close the edit dialog
      this.hideAddNew = true;
      this.getReceptData();
    }
     else {
      console.error('Error creating receipt:', response.message);

    }
  });
}

    closeDialog(){
      this.bill_status = '';
      this.visible = false;
      this.hideAddNew = false;
      this.addNewRecept.reset();
      
    }

    handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        // Submit the form on Enter key press
        this.fetchBillDetails(this.addNewRecept.get('billNo')!.value);
      } else if (event.key === 'Escape') {
        // Close the modal on Escape key press
        this.closeDialog(); // Make sure to close the dialog if needed
      }
    }


    applyFilters() {
      const filters = {
        locationCodes: this.locationFilter.map(item => item.LOCATION_CODE),
        propertyCodes: this.propertyFilter.map(item => item.PROPERTY_CODE),
        alloteNames: this.alloteFilter,
        userType: this.userRole,
        revenueDivision: this.userID
      };
      this.http.filterReceiptData(filters).subscribe({
        next:(res)=>{
          this.receiptData = res.receiptData;
          this.locationList = res.locationList;
          this.complexList = res.complexList;
          this.allAlloteList = res.allAlloteNames;
            this.cd.detectChanges();
        }
      })
    }

    downloadExcel(){
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.receiptData); // Convert table to sheet
      const wb: XLSX.WorkBook = XLSX.utils.book_new(); // Create a new workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); // Append the sheet to the workbook
      XLSX.writeFile(wb, 'receipts-data.xlsx'); // Write the file
  
    }
    
}
