import { ReceptDetailsService } from './../services/receptDetails/recept-details.service';
import { billDetails } from './../interfaces/billDetails/billDetailsInterfaces';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { BillDetailsService } from '../services/billDetails/bill-details.service';
import { ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { ChangeRequestService } from '../services/changeRequest/change-request.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx';
import { RazorpayComponent } from '../razorpay/razorpay.component';
declare var Razorpay: any;

@Component({
  selector: 'app-bill-details',
  standalone: true,
  imports: [PrimeNgModule, ReactiveFormsModule,FormsModule,RazorpayComponent],
  templateUrl: './bill-details.component.html',
  styleUrls: ['./bill-details.component.scss'],
  providers: [DatePipe], // Add DatePipe here
})
export class BillDetailsComponent implements OnInit {
  emailData = {
    to: 'tranga@sssbitech.com',
    subject: 'Test Email from Angular',
    text: 'Hello! This is a test email sent from the Angular frontend using Nodemailer backend.',
  };
  razorpay_key_id:string = 'rzp_live_SoaxyQXKUe6WFi';
  visible: boolean = false;
  responseMsg: string | undefined;
  dataSource!: billDetails[];
  form!: FormGroup;
  userRole: any
  userID: any
  showModel: boolean = false;
  visible1: boolean = false;
  propertyData: any;
  propertyDetail: any;
  amount: number = 0;
  receiptData: any;
  notPaidBills!: billDetails[];
  paidBills!: billDetails[];
  showPayPopup:boolean=false;
  PaymentPopupform!: FormGroup;
  selectedBill: any;
  PartialPaidAmount!: number;
  @ViewChild('dt2') dt2!: any;
  value: any;
  fileToUpload: any;
  attachmentUrl: any;
  isTds:boolean = true;
  tdsvalue:number = 0
  userdetails: any;          // initilaise for getting userdata as object from local storage
  username:any;              // initialise username 
  userDetailsObject: any;
  orderID:any
  orderResponce:any;
  sentDisabledFieldValues:any
  isDialogVisible: boolean = false;
  paymentMessage: string = '';
  complexList:[] = [];
  locationList:[] = [];
  billPeriod:[] = [];
  allAlloteList:[] = [];
  propertyFilter:any[] = [];
  locationFilter:any[] = [];
  alloteFilter:any[]=[];
  billPeriodFilter:any[] = [];
  billGenetaredCount: number = 0;
  billnotpaidCount: number = 0;
  totalDue: any;
  billStatus: any[] = [];
  constructor(private billDetailService: BillDetailsService,
              private Http: ChangeRequestService,
              private cd: ChangeDetectorRef,
              http: ReceptDetailsService,
              private fb: FormBuilder,
              private toastrService : ToastrService,
              private datePipe: DatePipe,
              private route: ActivatedRoute,
            ) {
    this.PaymentPopupform = this.fb.group({
      billNo: [{ value: null,disabled: true }],
      propertycode: [{ value: null, disabled: true }],
      leaseperiod: [{ value: null, disabled: true }],
      leaseAmount: [{ value: null, disabled: true }],
      gst: [{ value: null, disabled: true }],
      powerBillAmount: [{ value: null, disabled: true }],
      waterBillAmount: [{ value: null, disabled: true }],
      maintenance: [{ value: null, disabled: true }],
      interest: [{ value: null, disabled: true }],
      billGeneratedDate: [{ value: null, disabled: true }],
      total: [{ value: null, disabled: true }],
      paymentAmount: [{ value: null, disabled: true }],
      tds: [{ value: null, disabled: true }],
      due: [{ value: null }]
    });
   }

   billStatusFilter = [ 'Partially Paid','Not Paid' ];

  ngOnInit(): void {
      
    this.form = new FormGroup({
      s_no: new FormControl({ value: null, disabled: true }, Validators.required),
      bill_no: new FormControl({ value: null, disabled: true }, Validators.required),
      user_id: new FormControl({ value: null, disabled: true }, Validators.required),
      property_code: new FormControl({ value: null, disabled: true }, Validators.required),
      lease_period: new FormControl({ value: null, disabled: true }, Validators.required),
      lease_Amount: new FormControl({ value: null, disabled: true }, Validators.required),
      gst: new FormControl({ value: null, disabled: true }, Validators.required),
      power_bill_amount: new FormControl(null, Validators.required),
      water_bill_amount: new FormControl(null, Validators.required),
      maintenance_amount: new FormControl(null, Validators.required),
      lease_interests: new FormControl({ value: null, disabled: true }, Validators.required),
      total: new FormControl(null, Validators.required),
      // Arrears: new FormControl(null, Validators.required),
      tds: new FormControl(null),
    });
    

    this.userRole = localStorage.getItem('role')
    this.userID = localStorage.getItem('userId')
    this.userdetails=localStorage.getItem("userInfo");
    this.userDetailsObject = JSON.parse(this.userdetails);
    this.username=this.userDetailsObject.USER_NAME
    this.getbilldetails();
  }

  getTotalDueAmount() {
    this.totalDue = 0; // Initialize totalDue
this.notPaidBills.forEach((bill) => {
  this.totalDue += Number(bill.Due); // Add Due values as numbers
});

// Format totalDue to two decimal places
this.totalDue = parseFloat(this.totalDue.toFixed(2));

    
};


  closeDialog(){
    this.showModel = false
    this.form.reset();
    this.tdsvalue = 0;
    this.isTds = true;
  }

  onSelectGlobal(value:any): void {
    this.dt2.filterGlobal(value, 'contains');
  }

  onFilterGlobal(event: Event): void {

    this.dt2.filterGlobal(event, 'contains');
  }

  calculateTotal(): void {
    const leaseAmount = parseFloat(this.form.get('lease_Amount')?.value) || 0;
    const gst = parseFloat(this.form.get('gst')?.value) || 0;
    // const Arrears = parseFloat(this.form.get('Arrears')?.value) || 0;
    const powerBillAmount = parseFloat(this.form.get('power_bill_amount')?.value) || 0;
    const waterBillAmount = parseFloat(this.form.get('water_bill_amount')?.value) || 0;
    const maintenanceAmount = parseFloat(this.form.get('maintenance_amount')?.value) || 0;
    const leaseInterests = parseFloat(this.form.get('lease_interests')?.value) || 0;
    this.tdsvalue = parseFloat(this.form.get('tds')?.value) || 0;
    if(this.tdsvalue > 0){
      this.isTds = false;
    }
    // Calculate the total
    const total = leaseAmount +  gst + powerBillAmount + waterBillAmount + maintenanceAmount + leaseInterests + this.tdsvalue;

    // Update the total field in the form
    this.form.get('total')?.setValue(total, { emitEvent: false }); 
  }

  // Updated showDialog method to fetch data based on bill_no

  showDialog(bill_no: any) {
    this.visible = true;
    this.showModel = true;
    // Fetch details based on bill_no
    this.billDetailService.getBillDetailsByBillNo(bill_no).subscribe({
      next: (res: any) => {

        if (res) {
          this.form.patchValue({
            s_no: res.ID,
            bill_no: res.BillNo,
            user_id: res.User,
            property_code: res.property_name,
            lease_period: res.Bill_Period,
            lease_Amount: res.Rental_lease_amount_permonth,
            gst: res.GST,
            power_bill_amount: res.Power_bill,
            water_bill_amount: res.Water_bill,
            maintenance_amount: res.Maintainance_bill,
            lease_interests: res.Total_rental_interest,
            total: res.Total
          });
        }
      },
      error: (err: any) => {
        console.error('Error fetching bill details by bill_no:', err);
        this.responseMsg = "Error fetching details";
      }
    });
  }
  
  getbilldetails() {
    this.dataSource = []
    this.billDetailService.getBillDetailsByUserId(this.userID, this.userRole).subscribe({
      next: (res: any) => {
        this.dataSource = res.billingData;
        this.locationList = res.location;
        this.complexList = res.complex;
        this.billPeriod = res.billPeriod;
        this.allAlloteList = res.allAlloteNamesResult;
        this.responseMsg = res.message;
        if (this.dataSource.length > 0) {
          this.filterBillData();
        }
      },
      error: (err: any) => {
        if (err.error?.message) {
          this.responseMsg = err.error?.message;
        } else {
          this.responseMsg = "error";
        }
      }
    });
  }

  filterBillData(){
    this.paidBills = [];
    this.notPaidBills = [];
    this.paidBills = this.dataSource.filter(item=>{return item.Status === 'Fully Paid'})
    if (this.userRole === 'USER') {
      this.notPaidBills = this.dataSource.filter(item => {
        return (item.Status !== 'Fully Paid' && item.BillStatus === 'Active')
      })
    } else {
      this.notPaidBills = this.dataSource.filter(item => {return (item.Status !== 'Fully Paid' ) })
    }
    this.getTotalDueAmount();
    this.cd.detectChanges();
  }

  sendEmail() {
    this.billDetailService.sendEmail(this.emailData).subscribe(
      (response) => {
      },
      (error) => {
      }
    );

  }

  saveBill() {
  this.showModel = true; // Show the modal (if you're using one)
  if (this.form.valid) {
    const formData = this.form.getRawValue();
    // Get the user ID from the form data
    const userId = formData.user_id; // Ensure this matches your form field name
    const Property=formData.property_code;
    const lease_Amount=formData.lease_Amount;
    // Create the updateData object, including userId
    const updateData = {
      BillNo: formData.bill_no, // Ensure correct parameter name
      Power_bill: formData.power_bill_amount,
      Water_bill: formData.water_bill_amount,
      Maintainance_bill: formData.maintenance_amount,
      Total: formData.total,
      Due: formData.total,
      UserId: userId ,// Include userId here for sending with email
      Property:Property,
      lease_Amount:lease_Amount,
      tds:formData.tds,
      attachmentUlr:this.attachmentUrl
    };
    console.log(updateData, "....updatedata");
    this.billDetailService.saveBill(updateData).subscribe({
      next: (response) => {
        // Generate and send PDF immediately after updating
        this.showModel = false; // Close the modal after successful update
        this.getbilldetails();
        this.BillGeneratePdf(response.data); // Call the method to create and send PDF
      },
      error: (error) => {
        console.error('Error submitting form:', error);
      }
    });
  } 
  else {
    console.error('Form is invalid');
  }
  }
  generateBill() {
  this.showModel = true; // Show the modal (if you're using one)
  if (this.form.valid) {
    const formData = this.form.getRawValue();
    // Get the user ID from the form data
    const userId = formData.user_id; // Ensure this matches your form field name
    const Property=formData.property_code;
    const lease_Amount=formData.lease_Amount;
    // Create the updateData object, including userId
    const updateData = {
      BillNo: formData.bill_no, // Ensure correct parameter name
      Power_bill: formData.power_bill_amount,
      Water_bill: formData.water_bill_amount,
      Maintainance_bill: formData.maintenance_amount,
      Total: formData.total,
      Due: formData.total,
      UserId: userId ,// Include userId here for sending with email
      Property:Property,
      lease_Amount:lease_Amount,
      tds:formData.tds,
      attachmentUlr:this.attachmentUrl
    };
    console.log(updateData, "....updatedata");
    this.billDetailService.generateBill(updateData).subscribe({
      next: (response) => {
        // Generate and send PDF immediately after updating
        this.showModel = false; // Close the modal after successful update
        this.applyFilters();
        this.BillGeneratePdf(response.data); // Call the method to create and send PDF
      },
      error: (error) => {
        console.error('Error submitting form:', error);
      }
    });
  } 
  else {
    console.error('Form is invalid');
  }
  }

  onFileChange(event: any) {
  const files = event.target.files;
  if (files.length > 0) { // Check if any file is selected
    const file = files[0];
    this.fileToUpload = file;
    this.uploadAttachment(); // Trigger upload function if file exists
  } else {
    console.warn('No file selected');
  }
  }

  uploadAttachment(){
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

  BillGeneratePdf(updateData: any) {
  this.billDetailService.getPropertyInfo(updateData.BillNo).subscribe({
    next: (res: any) => {
      this.propertyData = res;
      this.propertyDetail = this.propertyData.propertyInfo
  const doc = new jsPDF();
  const margins = { top: 15, bottom: 15, left: 20, right: 20 };
  const lineHeight = 10; // Consistent line height
  let currentY = margins.top;

  // Add logo
  const vmrdaLogoBase64 = '../../assets/vmrda_logo_image.png';
  const logoWidth = 30; // Adjusted for consistency
  const logoHeight = 30; // Adjusted for consistency
  const logoX = (doc.internal.pageSize.width - logoWidth) / 2;
  doc.addImage(vmrdaLogoBase64, 'PNG', logoX, currentY, logoWidth, logoHeight, '', 'FAST');
  currentY += logoHeight + 5;

  // Border
  doc.setLineWidth(0.5);
  doc.rect(
    margins.left - 5,
    margins.top - 5,
    doc.internal.pageSize.width - (margins.left + margins.right - 10),
    doc.internal.pageSize.height - (margins.top + margins.bottom - 10)
  );

  // Heading
  doc.setFontSize(12).setFont('helvetica', 'bold');
  doc.text('VISAKHAPATNAM METROPOLITAN REGION DEVELOPMENT AUTHORITY', doc.internal.pageSize.width / 2, currentY, { align: 'center' });
  currentY += lineHeight + 2;

  // Title
  doc.setFontSize(12);
  doc.text('Payment Reminder Bill', doc.internal.pageSize.width / 2, currentY, { align: 'center' });
  currentY += lineHeight * 1;

  // Adding bill number and date
  const currentDate = new Date().toLocaleDateString();
  doc.setFontSize(12);
  doc.setFont('times', 'normal');
  doc.text(`Bill No: ${updateData.BillNo}`, margins.left, currentY);
  doc.text(`Dt: ${currentDate}`, doc.internal.pageSize.width - margins.right - 45, currentY);
  currentY += lineHeight * 2;

  // Dynamic content
  doc.setFontSize(12);
  doc.setFont('times', 'bold');
  doc.text(`Property Name: ${updateData.Property}`, margins.left, currentY);
  currentY += lineHeight;

  doc.setFont('times', 'normal');
  // doc.text(`The bill no ${updateData.BillNo} is due for payment of ${updateData.Total} by the due date.`, margins.left, currentY, {
  //   maxWidth: doc.internal.pageSize.width - margins.left - margins.right
  // });
  doc.text(` The Property with ${updateData.Property} for an extent of ${this.propertyDetail.EXTENT} sqft. located in the ${this.propertyDetail.LOCATION} has been alloted to  ${this.propertyDetail.ALLOTTEE_NAME} vide reference cited  leased to ${updateData.lease_Amount}, located in ${updateData.Property}, in  has a monthly lease amount of ${updateData.lease_Amount} with additional charges such as GST and utility bills.The license of the shop shall have to pay lease amount on or before 10th of every month. Whereas the license has failed to pay monthly lease as per the stipulated time and an amount ${updateData.Total} is overdue against the said shop as detailed below`,


    margins.left, currentY,
    { maxWidth: doc.internal.pageSize.width - margins.left - margins.right }
  );

  currentY += lineHeight * 4;

  // Adding billing details in a table

  const billingDetails = [
    ["Bill No", updateData.BillNo],
    ["Power Bill", updateData.Power_bill],
    ["Water Bill", updateData.Water_bill],
    ["Maintenance Bill", updateData.Maintainance_bill],
    ["Total Amount Due", updateData.Total],
  ];

  const tableStartY = currentY + 7;

  autoTable(doc, {
    // head: [['Description', 'Amount']],
    body: billingDetails.map(detail => [detail[0], detail[1]]),
    startY: tableStartY,
    margin: { left: margins.left + 10, right: margins.right + 10 },
    theme: 'grid',
    // headStyles: {
    //   fillColor: [0, 102, 204],
    //   textColor: [255, 255, 255],
    // },
  });

  // Footer content

  currentY = doc.internal.pageSize.height - margins.bottom - 20; // Position for footer
  doc.setFontSize(12);
  doc.setFont('times', 'normal');
  doc.text('Thank you for your attention. Please contact us for any queries.', margins.left, currentY);
  currentY += lineHeight;
  doc.text('Regards,', margins.left, currentY);
  currentY += lineHeight;
  doc.text('VISAKHAPATNAM METROPOLITAN REGION DEVELOPMENT AUTHORITY', margins.left, currentY);

  // Generate the PDF as a Blob
  const pdfBlob = doc.output('blob');

  // Prepare FormData to send the PDF to the backend
  const formData = new FormData();
  formData.append('pdf', pdfBlob, `Bill_${updateData.BillNo}.pdf`);
  formData.append('userId', updateData.UserId);

  // Send the PDF to the backend for emailing

  this.billDetailService.sendEmailWithAttachmentBill(formData).subscribe({
    next: (response) => {
      console.log('Email with bill sent successfully!', response);
    },
    error: (error) => {
      console.error('Error sending email:', error);
    }
  });
}
  }
  )}

  downloadPDF(bill: any) {
    this.billDetailService.getPropertyInfo(bill.BillNo).subscribe({

      next: (res: any) => {
        this.propertyData = res;
        this.propertyDetail = this.propertyData.propertyInfo
        const doc = new jsPDF();
        const margins = { top: 15, bottom: 15, left: 20, right: 20 };
        const lineHeight = 10;
        let currentY = margins.top;
        const vmrdaLogoBase64 = '../../assets/vmrda_logo_image.png';
        const logoWidth = 30;
        const logoHeight = 30;
        const logoX = (doc.internal.pageSize.width - logoWidth) / 2;

        // Logo
        doc.addImage(vmrdaLogoBase64, 'PNG', logoX, currentY, logoWidth, logoHeight, '', 'FAST');
        currentY += logoHeight + 5;

        // Border
        doc.setLineWidth(0.5);
        doc.rect(
          margins.left - 5,
          margins.top - 5,
          doc.internal.pageSize.width - (margins.left + margins.right - 10),
          doc.internal.pageSize.height - (margins.top + margins.bottom - 10)
        );

        // Heading
        doc.setFontSize(12).setFont('helvetica', 'bold');
        doc.text('VISAKHAPATNAM METROPOLITAN REGION DEVELOPMENT AUTHORITY', doc.internal.pageSize.width / 2, currentY, { align: 'center' });
        currentY += lineHeight + 2;

        doc.setFontSize(12); // Reduced font size for subheading
        doc.text('Bill', doc.internal.pageSize.width / 2, currentY, { align: 'center' });
        currentY += lineHeight * 1;

        const currentDate = new Date();
        const formattedDate = 
    String(currentDate.getDate()).padStart(2, '0') + '-' + 
    String(currentDate.getMonth() + 1).padStart(2, '0') + '-' + 
    currentDate.getFullYear();

doc.setFontSize(12);
doc.setFont('times', 'normal');
doc.text(`Bill No: ${bill.BillNo}`, margins.left, currentY);
doc.text(`Date: ${formattedDate}`, doc.internal.pageSize.width - margins.right - 45, currentY);
currentY += lineHeight * 2;


        // Dynamic content based on form data
        doc.setFontSize(12);
        doc.setFont('times', 'bold');
        doc.text(`Property Name: ${bill.property_name}`, margins.left, currentY);
        currentY += lineHeight * 1;

        doc.setFont('times', 'normal');
        doc.text(` The Property with ${bill.property_name} for an extent of ${this.propertyDetail.EXTENT} sqft. located in the ${this.propertyDetail.LOCATION} has been alloted to  ${this.propertyDetail.ALLOTTEE_NAME} vide reference cited  leased to Rs. ${bill.Rental_lease_amount_permonth}/-, located in ${bill.Property},
           in  has a monthly lease amount of Rs. ${bill.Rental_lease_amount_permonth}/- with additional charges such as GST and utility bills.The license of the shop shall have to pay lease amount on or before 10th of every month. Whereas the license has failed to pay monthly lease as per the stipulated time and an amount Rs. ${bill.Total}/- is overdue against the said shop as detailed below`,


          margins.left, currentY,
          { maxWidth: doc.internal.pageSize.width - margins.left - margins.right }
        );
        currentY += lineHeight * 4;

        doc.text(`The lease amount for the period ${bill.Rental_lease_amount_permonth} is due. Please remit the amount of ${bill.Total} by the due date, failing which further action will be taken according to the terms and conditions.`,
          margins.left, currentY,
          { maxWidth: doc.internal.pageSize.width - margins.left - margins.right }
        );
        currentY += lineHeight * 2;

        // Adjusting table margins and reducing its width to fit within the border
        const tableColumn = ["Field", "Value"];
        const tableRows = [
          ["Bill No", bill.BillNo],
          ["Property Code", bill.Property],
          ["Lease Amount", bill.Rental_lease_amount_permonth],
          ["GST", bill.GST],
          ["Power Bill Amount", bill.Power_bill],
          ["Water Bill Amount", bill.Water_bill],
          ["Maintenance Amount", bill.Maintainance_bill],
          ["Lease Interests", bill.Total_rental_interest],
          ["Total", bill.Total],
        ];

        const tableStartY = currentY + 7;

        // Using autoTable with proper margins for table alignment inside the border
        autoTable(doc, {
          // head: [tableColumn],
          body: tableRows,
          startY: tableStartY,
          margin: { left: margins.left + 10, right: margins.right + 10 }, // Adjusting left and right margins
          tableWidth: doc.internal.pageSize.width - margins.left - margins.right - 20, // Reduced table width to fit inside
          theme: 'grid', // Adding borders to the table

          headStyles: {
            fillColor: [0, 102, 204], // RGB color value for header background
            textColor: [255, 255, 255], // White text color for the header text
          },
        });

        // Update currentY to the position after the table
        currentY = doc.internal.pageSize.height - margins.bottom - 20; // Position for footer with some space

        // Footer content
        doc.setFontSize(12);
        doc.setFont('times', 'normal');
        doc.text('Please pay on time without fail. Thank you for your cooperation.', margins.left, currentY);
        currentY += lineHeight * 1;

        doc.text('Regards,', margins.left, currentY);
        currentY += lineHeight;
        doc.text('VISAKHAPATNAM METROPOLITAN REGION DEVELOPMENT AUTHORITY', margins.left, currentY);

        // Save the PDF
        doc.save(`Bill_${bill.BillNo}.pdf`);
      }
    }
    )
  }


  showDialog1() {
    this.getbilldetails();
    this.resetFilters();
    this.visible1 = true;
  }

  generateAllBills() {
    this.billDetailService.generateAllBills(this.userID).subscribe({
      next:(res:any)=>{
        this.toastrService.success('Bills Generated Successfully')
      },
      error:(err:any)=>{
        this.toastrService.warning(err.error.message)
      }
    })
  }

  selectBillToPay(bill:any){
    this.selectedBill = bill;
  }

  // Popup opening for Partial Payment 

  payBill(bill: any) {
    this.selectedBill = bill;  // Store the selected bill data
    this.PaymentPopupform.patchValue({
      billNo: bill.BillNo,
      propertycode: bill.Property,
      leaseperiod: bill.Bill_Period,
      leaseAmount: bill.Rental_lease_amount_permonth,
      gst: bill.GST,
      powerBillAmount: bill.Power_bill,
      waterBillAmount: bill.Water_bill,
      maintenance: bill.Maintainance_bill,
      interest: bill.Total_rental_interest,
      billGeneratedDate: this.datePipe.transform(bill.Bill_generated_date, 'yyyy-MM-dd'), // Format the date using data pipe
      total: bill.Total,
      paymentAmount: bill.TotalPaid,
      due: bill.Due ,
      tds:bill.TDS
    });
     this.showPayPopup = true; // Show the payment popup
  }

  // Sent Edited Partial Payment amount to Payment Page 

  PaymnetPage() {
    const editedAmount = this.PaymentPopupform.value.due; // Get the edited amount
    this.amount = editedAmount                            // Initialise edited amount
    console.log(this.amount,"edited form amount...");
    const billNo = this.PaymentPopupform.get('billNo')?.value; // Access the disabled control
    const powerBill = this.PaymentPopupform.get('powerBillAmount')?.value; // Access the disabled control
    const waterBill = this.PaymentPopupform.get('waterBillAmount')?.value; // Access the disabled control
    const maintenanceAmount = this.PaymentPopupform.get('maintenance')?.value; // Access the disabled control
    const tds = this.PaymentPopupform.get('tds')?.value; // Access the disabled control
    this.sentDisabledFieldValues={billNo,powerBill,waterBill,maintenanceAmount,tds}

    // Call Razorpay payment

    this.billDetailService.createOrder({
      amount: this.amount,
      invoice_id: this.sentDisabledFieldValues.billNo,
      powerBill: this.sentDisabledFieldValues.powerBill,
      waterBill: this.sentDisabledFieldValues.waterBill,
      maintenanceAmount: this.sentDisabledFieldValues.maintenanceAmount,
      tds: this.sentDisabledFieldValues.tds,
      description: `Payment for ${this.selectedBill.Property}`,
      email: this.userDetailsObject.EMAIL_ID,
      phone: this.userDetailsObject.MOBILE_NUM
    }).subscribe({
      next:(res:any)=>{
        this.orderID = res.data.id;
        this.amount = res.data.amount;
        this.isDialogVisible = true;
      }
    }
      
    );
    
    // this.billDetailService.createOrder({
    //     amount: this.amount,
    //     invoice_id: this.sentDisabledFieldValues.billNo,
    //     powerBill: this.sentDisabledFieldValues.powerBill,
    //     waterBill: this.sentDisabledFieldValues.waterBill,
    //     maintenanceAmount: this.sentDisabledFieldValues.maintenanceAmount,
    //     tds: this.sentDisabledFieldValues.tds,
    //     description: `Payment for ${this.selectedBill.Property}`,
    //     email: this.userDetailsObject.EMAIL_ID,
    //     phone: this.userDetailsObject.MOBILE_NUM
    //   }).subscribe({
    //    next: (order) => {
    //       console.log(order,"....")
    //       const options = {
    //         key: this.razorpay_key_id, // Replace with your Razorpay key ID
    //         amount: this.amount, // Amount in paise
    //         currency: 'INR',
    //         name: 'VMRDA Rental',
    //         description: `Payment for ${this.selectedBill.Property}`,
    //         order_id: order.data.id, // Razorpay order ID
    //         handler: (response: any) => {
    //           // On payment success, update bill and create receipt
    //           this.verifypayment(response);
    //         },
    //         prefill: {
    //           name: this.userDetailsObject.USER_NAME, 
    //           email: this.userDetailsObject.EMAIL_ID, 
    //           contact: this.userDetailsObject.MOBILE_NUM, 
    //         },
    //         theme: {
    //           color: '#3399cc',
    //         },
    //       };
    //       const rzp1 = new Razorpay(options);
    //       rzp1.open();
    //     }
    //   });
  
  }


// dummy(){
//   let count = 0;
//   count++;
//   console.log("count pay btn click: " + count)
// }

  handleFailure(message: string) {
    this.paymentMessage = message;
    this.isDialogVisible = true;
  }

  onDialogClose() {
    this.isDialogVisible = false;
  }

  showPaymentPopup(){
    this.showPayPopup=true;
  }

  downloadGSTBill(billNo: string) {
    this.billDetailService.getGst(billNo).subscribe(
      (response: Blob) => {
        console.log('GST Bill downloaded successfully', response);
  
        // Create a blob object from the response
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
  
        // Create a temporary anchor element to trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = `GST_Bill_${billNo}.pdf`; // File name
        a.click(); // Trigger download
  
        // Clean up the URL object
        window.URL.revokeObjectURL(url);
      },
      (error: any) => {
        console.error('Error while downloading GST Bill', error);
      }
    );
  }

  downloadExcel(){
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.notPaidBills); // Convert table to sheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); // Append the sheet to the workbook
    XLSX.writeFile(wb, 'bills-data.xlsx'); // Write the file

  }

  applyFilters() {
    const filters = {
      locationCodes: this.locationFilter.map(item => item.LOCATION_CODE),
      propertyCodes: this.propertyFilter.map(item => item.PROPERTY_CODE),
      alloteNames: this.alloteFilter,
      billPeriods: this.billPeriodFilter.map(item => item),
      userType: this.userRole,
      revenueDivision: this.userID
    };
    this.billDetailService.filterBillingData(filters).subscribe({
      next:(res)=>{
        this.dataSource = res.billingData;
        this.locationList = res.locationList;
        this.complexList = res.complexList;
        this.billPeriod = res.billPeriod;
        this.allAlloteList = res.allAlloteNames;
        if (this.dataSource.length > 0) {
          this.filterBillData();
        }
        else{
          this.billnotpaidCount = 0
          this.billnotpaidCount = 0
          this.dataSource = [];
          this.paidBills = [];
          this.notPaidBills = [];
          this.cd.detectChanges();
        }

      }

    })
  }

  openRazorpayCheckout() {
    const options = {
      key: this.razorpay_key_id,
      amount: this.amount,
      currency: 'INR',
      name: 'VMRDA Rental Service',
      description: 'Rental Service',
      image: 'https://vmrda-prod-assests.s3.ap-south-1.amazonaws.com/vmrda_logo_image.png',
      order_id: this.orderID,
      prefill: {
        name: this.userDetailsObject.USER_NAME,
        contact: this.userDetailsObject.MOBILE_NUM,
        email: this.userDetailsObject.EMAIL_ID,
      },
      handler: (response: any) => {
        // The arrow function ensures that `this` refers to the class instance
        console.log(response);
        this.verifypayment(response); // Call your class method
      },
      theme: {
        color: '#F37254',
      },
    };
  
    const razorpay = new Razorpay(options);
    razorpay.open();
  }

  
  

  verifypayment(response:any){
    if(response.razorpay_signature){
      this.isDialogVisible = false;
      this.showPayPopup = false;
      this.toastrService.success('payment made successfully')
    }
    else {
      this.isDialogVisible = false;
      this.showPayPopup = false;
      this.toastrService.warning('payment made successfully')
    }
  }

  resetFilters(){
    this.billPeriodFilter = [];
    this.locationFilter = [];
    this.propertyFilter = [];
    this.alloteFilter = []; 
    this.billStatus=[];   
    this.getbilldetails();
  }

  
}
