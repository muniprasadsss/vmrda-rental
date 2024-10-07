import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { HeaderComponent } from '../header/header.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FooterComponent } from '../footer/footer.component';
import { ReceptDetailsService } from '../services/receptDetails/recept-details.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ChangeRequestService } from '../services/changeRequest/change-request.service';
import { BillDetailsService } from '../services/billDetails/bill-details.service';
@Component({
  selector: 'app-receipt-details',
  standalone: true,
  imports: [PrimeNgModule,HeaderComponent,DashboardComponent,FooterComponent,ReactiveFormsModule],
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
  @ViewChild('dt2') dt!: any;
  value: any;
  fileToUpload: any;
  attachmentUrl:any = null
  bill:any;
  constructor(private http:ReceptDetailsService,
    private Http: ChangeRequestService,
    private billDetailService: BillDetailsService,
    private fb: FormBuilder,
    private toasterservice: ToastrService,
    private cd: ChangeDetectorRef){

    this.addNewRecept = this.fb.group({
      billNo: ['', Validators.required],
      User:[{ value: '', disabled: true }],
      Property:[{ value: '', disabled: true }],
      Bill_Period:[{ value: '', disabled: true }],
      Total:[{ value: '', disabled: true }],
      Status:[{ value: '', disabled: true }],
      amount_paid: ['', Validators.required],
    });
  }

  ngOnInit(){
    this.userRole = localStorage.getItem('role')
    this.userID = localStorage.getItem('userId')
    this.getReceptData();
  }
  showDialog() {
    this.visible = true;
}

onFilterGlobal(event: Event): void {
  const target = event.target as HTMLInputElement;
  this.value = target.value;
  this.dt.filterGlobal(this.value, 'contains');
}


  getReceptData(){
    this.http.getReciptDetails(this.userID,this.userRole).subscribe({
      next:(res:any)=>{
        this.receiptData = res.receiptData;
      },
      error:(err:any)=>{

      }
    })
  }

generatePDF(receipt: any) {
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
  doc.text(`${currentDate}`, doc.internal.pageSize.width - margins.right - 30, currentY);
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
    `This receipt acknowledges the payment for property code ${receipt.Property}, leased to ${receipt.User}. ` +
    `Payment includes the lease amount, GST, and other charges. Summary of payment details:`,
    margins.left, currentY, { maxWidth: doc.internal.pageSize.width - margins.left - margins.right }
  );
  currentY += lineHeight * 3;

  // Receipt details in table form
  const tableRows = [
    ["Receipt No", receipt.ReceiptNo],
    ["User ID", receipt.User],
    ["Bill No", receipt.BillNo],
    ["Property Code", receipt.Property],
    ["Paid Date", receipt.paid_date],
    // ["Lease Amount", receipt.Rental_lease_amount_permonth],
    // ["GST", receipt.GST],
    ["Total Bill Amount", receipt.Total],
    ["Total Paid", receipt.TotalPaid],
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
      const file = event.target.files[0];
      if (file.length > 0) { // Check if any file is selected
        const files = file[0];
        this.fileToUpload = files;
        this.uploadattachment(); // Trigger upload function if file exists
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
  

  fetchBillDetails(billNo:any){
    this.http.getBillDetails(billNo).subscribe({
      next:(res:any)=>{
        if(res.Status !== 'FP'){
          this.bill = res;
          this.bill_status = res.Status;
          this.addNewRecept.patchValue({
            billNo: res.BillNo,
            User: res.User,
            Property: res.Property,
            Bill_Period:  res.Bill_Period,
            Total: res.Total,
            Status: res.Status,
          })
              this.hideAddNew = true;
        }
        else{
          this.toasterservice.warning('Bill already paid')
        }
       
      }
    })
  }
  generateChallanNumber(UserID: string): string {
    const currentDate = new Date();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month as a number, padded to 2 digits
    const currentYear = currentDate.getFullYear();


    return `REC/VMRDA/${currentMonth}/${currentYear}/${UserID}`;
  }
  addReciept(){
    if (true) {
      // Print the form values to the console
      if(this.bill_status !== 'FP' ){
        this.bill_status = 'FP';
        const form = this.addNewRecept.value
        const updateData = {
            p_billid: this.bill.billNo,
            p_payment_amount: this.addNewRecept.get('amount_paid')?.value,               
          }


      this.billDetailService.updateBillDetailsByBillNo(updateData).subscribe({
        next:  (response) => {
          if (response.status === 200) {
             this.createReceipt({
              BillNo: this.bill.BillNo,
              ReceiptNo: this.generateChallanNumber(this.bill.Property),
              User: form.User,
              Property: this.bill.Property,
              paid_date: new Date().toISOString(),
              Rental_lease_amount_permonth: this.bill.Rental_lease_amount_permonth,
              GST: this.bill.GST,
              Total_rental_interest: this.bill.Total_rental_interest,
              Total: this.bill.Total,
              TotalPaid: this.bill.Total,
              Due: 0,
              Status: 'FP'
            });


          } else {
            console.error('Error updating bill:', response.message);
          }
        },
        error: (err:any) => {
          console.error('Error updating bill:', err);
        },
      });

    } 
    else{
      this.toasterservice.warning('Bill already paid')
    }
  }

}

createReceipt(receiptData: any) {

  this.billDetailService.updateReceipt(receiptData).subscribe((response) => {
    if (response.message == "receipt created successfully") {
      console.log('Receipt created successfully!');
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
        console.log("Enter clicked...");
        this.fetchBillDetails(this.addNewRecept.get('billNo')!.value);
      } else if (event.key === 'Escape') {
        // Close the modal on Escape key press
        console.log("Esc clicked...");
        this.closeDialog(); // Make sure to close the dialog if needed
      }
    }
    
}
