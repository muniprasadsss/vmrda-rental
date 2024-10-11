import { ReceptDetailsService } from './../services/receptDetails/recept-details.service';
import { billDetails } from './../interfaces/billDetails/billDetailsInterfaces';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { HeaderComponent } from '../header/header.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FooterComponent } from '../footer/footer.component';
import { BillDetailsService } from '../services/billDetails/bill-details.service';
// import { ReceptDetailsService } from '../services/receptDetails/recept-details.service';
import { ChangeDetectorRef } from '@angular/core';
// import { billDetails } from '../interfaces/billDetails/billDetailsInterfaces';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
// import autoTable from 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { ChangeRequestService } from '../services/changeRequest/change-request.service';
declare var Razorpay: any;

@Component({
  selector: 'app-bill-details',
  standalone: true,
  imports: [PrimeNgModule, HeaderComponent, DashboardComponent, FooterComponent, ReactiveFormsModule],
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
  amount: any;
  receiptData: any;
  notPaidBills!: billDetails[];
  paidBills!: billDetails[];
  propertyCode:any;
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
  
  constructor(private billDetailService: BillDetailsService,
              private Http: ChangeRequestService,
              private cd: ChangeDetectorRef,
              http: ReceptDetailsService,
              private fb: FormBuilder,
              private datePipe: DatePipe) {
    this.PaymentPopupform = this.fb.group({
      billNo: [{ value: '',disabled: true }],
      propertycode: [{ value: '', disabled: true }],
      leaseperiod: [{ value: '', disabled: true }],
      leaseAmount: [{ value: '', disabled: true }],
      gst: [{ value: '', disabled: true }],
      powerBillAmount: [{ value: '', disabled: true }],
      waterBillAmount: [{ value: '', disabled: true }],
      maintenance: [{ value: '', disabled: true }],
      interest: [{ value: '', disabled: true }],
      billGeneratedDate: [{ value: '', disabled: true }],
      total: [{ value: '', disabled: true }],
      paymentAmount: [{ value: '', disabled: true }],
      tds: [{ value: '', disabled: true }],
      due: [{ value: '' }]
    });
   }

  ngOnInit(): void {

    this.form = new FormGroup({
      s_no: new FormControl({ value: '', disabled: true }),
      bill_no: new FormControl({ value: '', disabled: true }),
      user_id: new FormControl({ value: '', disabled: true }),
      property_code: new FormControl({ value: '', disabled: true }),
      lease_period: new FormControl({ value: '', disabled: true }),
      lease_Amount: new FormControl({ value: '', disabled: true }),
      gst: new FormControl({ value: '', disabled: true }),
      power_bill_amount: new FormControl(),
      water_bill_amount: new FormControl(''),
      maintenance_amount: new FormControl(''),
      lease_interests: new FormControl({ value: '', disabled: true }),
      total: new FormControl(''),
      tds: new FormControl(''),
    });

    this.userRole = localStorage.getItem('role')
    this.userID = localStorage.getItem('userId')
    this.userdetails=localStorage.getItem("userInfo");
    const userDetailsObject = JSON.parse(this.userdetails);
    this.username=userDetailsObject.USER_NAME
    this.getbilldetails();
    this.getPropertyCodes();
  }

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
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.dt2.filterGlobal(this.value, 'contains');
  }

  getPropertyCodes(){
    this.billDetailService.getPropertyCodes( this.userID,this.userRole).subscribe({
      next:(res:any)=>{
        this.propertyCode = res;
      },
      error:(err:any)=>{
      }
    })
  }

  calculateTotal(): void {
    const leaseAmount = parseFloat(this.form.get('lease_Amount')?.value) || 0;
    const gst = parseFloat(this.form.get('gst')?.value) || 0;
    const powerBillAmount = parseFloat(this.form.get('power_bill_amount')?.value) || 0;
    const waterBillAmount = parseFloat(this.form.get('water_bill_amount')?.value) || 0;
    const maintenanceAmount = parseFloat(this.form.get('maintenance_amount')?.value) || 0;
    const leaseInterests = parseFloat(this.form.get('lease_interests')?.value) || 0;
    this.tdsvalue = parseFloat(this.form.get('tds')?.value) || 0;
    if(this.tdsvalue > 0){
      this.isTds = false;
    }
    // Calculate the total
    const total = leaseAmount + gst + powerBillAmount + waterBillAmount + maintenanceAmount + leaseInterests + this.tdsvalue;

    // Update the total field in the form
    this.form.get('total')?.setValue(total, { emitEvent: false }); 
  }

  // Updated showDialog method to fetch data based on bill_no

  showDialog(bill_no: string) {
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
            property_code: res.Property,
            lease_period: res.BillNo,
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
    this.paidBills = this.dataSource.filter(item=>{
      return item.Status === 'Fully Paid'
    })
    if (this.userRole !== 'USER') {
      this.notPaidBills = this.dataSource.filter(item => {
        return item.Status === 'Not Paid'
      })
    } else {
      this.notPaidBills = this.dataSource.filter(item => {
        return (item.Status !== 'Fully Paid' && item.BillStatus === 'Active') //PP and NP only visible changed 27-09-24
      })
    }
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
    this.billDetailService.updateBillDetails(updateData).subscribe({
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

        // Adding date and reference (aligned inside border)
        const currentDate = new Date().toLocaleDateString();
        doc.setFontSize(12);
        doc.setFont('times', 'normal');
        doc.text(`Bill No.. ${bill.BillNo}`, margins.left, currentY);
        doc.text(`Dt: ${currentDate}`, doc.internal.pageSize.width - margins.right - 45, currentY);
        currentY += lineHeight * 2;

        // Dynamic content based on form data
        doc.setFontSize(12);
        doc.setFont('times', 'bold');
        doc.text(`Property Name: ${bill.Property}`, margins.left, currentY);
        currentY += lineHeight * 1;

        doc.setFont('times', 'normal');
        doc.text(` The Property with ${bill.Property} for an extent of ${this.propertyDetail.EXTENT} sqft. located in the ${this.propertyDetail.LOCATION} has been alloted to  ${this.propertyDetail.ALLOTTEE_NAME} vide reference cited  leased to ${bill.Rental_lease_amount_permonth}, located in ${bill.Property}, in  has a monthly lease amount of ${bill.Rental_lease_amount_permonth} with additional charges such as GST and utility bills.The license of the shop shall have to pay lease amount on or before 10th of every month. Whereas the license has failed to pay monthly lease as per the stipulated time and an amount ${bill.Total} is overdue against the said shop as detailed below`,


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

  generateChallanNumber(UserID: string): string {
    const currentDate = new Date();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month as a number, padded to 2 digits
    const currentYear = currentDate.getFullYear();
    return `Rec/VMRDA/${currentMonth}/${currentYear}/${UserID}`;
  }

  showDialog1() {
    this.visible1 = true;
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
    const sentDisabledFieldValues={billNo,powerBill,waterBill,maintenanceAmount,tds}

    // Call Razorpay payment

    this.billDetailService.createOrder(this.amount).subscribe(
      (order) => {
        const options = {
          key: 'rzp_test_JKpUkmYnatBjUA',
          amount: order.data.amount, // Amount in paise
          currency: 'INR',
          name: 'VMRDA Rental',
          description: `Payment for ${this.selectedBill.Property}`,
          order_id: order.data.id,
          handler: (response: any) => {
            this.verifyPayment(response, this.selectedBill,this.amount,sentDisabledFieldValues);
          },
          prefill: {
            name: this.selectedBill.User,
            email: 'user@example.com',
            contact: '9999999999',
          },
          theme: {
            color: '#3399cc',
          },
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();
        this.showPayPopup = false; // Close the popup after opening Razorpay
      },
      (error) => {
        // Handle error
      }
    );
  }

  verifyPayment(response: any, bill: any,editedAamount:any, billDetails: any) {
    this.billDetailService.verifyPayment(response).subscribe({
      next:  (data) => {
        if (data.message === "Payment verified successfully") {
          const challanNumber = this.generateChallanNumber(bill.Property);

          const transactionData = {
            "id": data.paymentDetails.id ?? "No Data",
            "invoice_id": bill.BillNo ?? "No Data",
            "order_id": data.paymentDetails.order_id ?? "No Data",
            "method": data.paymentDetails.method ?? "No Data",
            "upi_transaction_id": data.paymentDetails.acquirer_data.upi_transaction_id ?? "No Data",
            "amount": editedAamount ?? "No Data",
            "amount_refunded": data.paymentDetails.amount_refunded ?? "No Data",
            "fee": data.paymentDetails.fee ?? "No Data",
            "bank": data.paymentDetails.bank ?? "No Data",
            "captured": data.paymentDetails.captured ?? "No Data",
            "card_id": data.paymentDetails.card_id ?? "No Data",
            "contact": data.paymentDetails.contact ?? "No Data",
            "currency": data.paymentDetails.currency ?? "No Data",
            "description": data.paymentDetails.description ?? "No Data",
            "email": data.paymentDetails.email ?? "No Data",
            "entity": data.paymentDetails.entity ?? "No Data",
            "error_description": data.paymentDetails.error_description ?? "No Data",
            "error_reason": data.paymentDetails.error_reason ?? "No Data",
            "error_source": data.paymentDetails.error_source ?? "No Data",
            "error_step": data.paymentDetails.error_step ?? "No Data",
            "international": data.paymentDetails.international ?? "No Data",
            "tax": data.paymentDetails.tax ?? "No Data",
            "upi": "razorpay",
            "vpa": "razorpay",
            "rrn": data.paymentDetails.acquirer_data.rrn ?? "No Data",
            "notes": "No Data",
            "refund_status": data.paymentDetails.refund_status ?? "No Data",
            "status": data.paymentDetails.status ?? "No Data",
          };
          console.log(transactionData,"transaction data check...");

        this.billDetailService.saveTransactionDetails(transactionData).subscribe({
          next:  (response) => {
            const updateData={
              p_billid: billDetails.billNo,
              p_payment_amount: transactionData.amount,             
            }
            console.log(updateData,"payload data sent");
          
              this.billDetailService.updateBillDetailsByBillNo(updateData).subscribe({
                next:  (response) => {
                    let payload = {
                        p_billid: billDetails.billNo,
                        Power_bill: billDetails.powerBill,
                        Water_bill: billDetails.waterBill,
                        Maintainance_bill: billDetails.maintenanceAmount,
                        p_payment_amount: transactionData.amount,
                        ReceiptNo: challanNumber,
                        User: bill.User,
                        Property: bill.Property,
                        paid_date: new Date().toISOString(),
                        Rental_lease_amount_permonth: bill.Rental_lease_amount_permonth,
                        GST: bill.GST,
                        Total_rental_interest: bill.Total_rental_interest,
                        Total: bill.Total,
                        TotalPaid: bill.Total,
                        
                        Due: 0,
                        Status: 'Fully Paid'
                       }
                    this.createAndSendReceiptPDF(payload,response.data);

                     this.getbilldetails();
                    //  this.cd.markForCheck(); // Changed to markForCheck
                    this.cd.detectChanges();
                },
                error: (err) => {
                  console.error('Error updating bill:', err);
                },
              });
            },
            error: (error) => {
              console.error('Error saving transaction:', error);
            },
          });
        }
      },
      error: (error) => {
        console.error('Payment Verification Failed', error);
      },
    });
  }

  // to send bill paid receipt pdf to user 

  createAndSendReceiptPDF(payload: any,responseData: any) {
    
    const doc = new jsPDF();
    // Page margins and initial Y position
    const margins = { top: 15, bottom: 15, left: 20, right: 20 };
    const lineHeight = 8;
    let currentY = margins.top;

    // Add logo
    const vmrdaLogoBase64 = '../../assets/vmrda_logo_image.png';
    const logoWidth = 20;
    const logoHeight = 20;
    const logoX = (doc.internal.pageSize.width - logoWidth) / 2;
    doc.addImage(vmrdaLogoBase64, 'PNG', logoX, currentY, logoWidth, logoHeight, '', 'FAST');
    currentY += logoHeight + 5;

    // Add border
    doc.setLineWidth(0.5);
    doc.rect(
      margins.left - 5, margins.top - 5,
      doc.internal.pageSize.width - (margins.left + margins.right - 10),
      doc.internal.pageSize.height - (margins.top + margins.bottom - 10)
    );

    // Add headings
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(
      'VISAKHAPATNAM METROPOLITAN REGION DEVELOPMENT AUTHORITY',
      doc.internal.pageSize.width / 2, currentY, { align: 'center' }
    );
    currentY += lineHeight + 2;

    doc.text('Receipt', doc.internal.pageSize.width / 2, currentY, { align: 'center' });
    currentY += lineHeight;

    // Add date and receipt reference
    const currentDate = new Date().toLocaleDateString();
    doc.setFont('helvetica', 'normal');
    doc.text(`Receipt No:`, margins.left, currentY);
    doc.setFont('helvetica', 'bold');
    doc.text(payload.ReceiptNo, margins.left + 30, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text('Date:', doc.internal.pageSize.width - margins.right - 45, currentY);
    doc.setFont('helvetica', 'bold');
    doc.text(currentDate, doc.internal.pageSize.width - margins.right - 30, currentY);
    currentY += lineHeight * 2;

    // Add property details
    doc.setFont('helvetica', 'bold');
    doc.text(`Property Name: `, margins.left, currentY);
    doc.text(payload.Property, margins.left + 40, currentY);
    currentY += lineHeight;

    // Add summary text
    doc.setFont('helvetica', 'normal');
    doc.text(
      `This receipt acknowledges the payment for property code ${payload.Property}, leased to ${this.username}. ` +
      `Payment includes the lease amount, GST, and other charges. Summary of payment details:`,
      margins.left, currentY, { maxWidth: doc.internal.pageSize.width - margins.left - margins.right }
    );
    currentY += lineHeight * 3;

    // Add receipt details in a table format
    const tableRows = [
      ['Receipt No', responseData.receipt_no],
      ['User ID', responseData.user],
      ['Bill No', payload.p_billid],
      ['Property Code', responseData.property],
      ['Paid Date', new Date(payload.paid_date).toLocaleDateString()],
      ['Lease Amount', responseData.rental_lease_amount_permonth],
      ['Power Bill', responseData.power_bill],
      ['Maintaiance Bill', responseData.maintainance_bill],
      ['Water Bill', responseData.water_bill],
      ['GST', responseData.gst],
      ['Total Amount', responseData.total],
      ['Total Paid', responseData.total_paid],
      ['Due Amount', responseData.due],
      ['Payment Status', responseData.status]
    ];

    autoTable(doc, {
      body: tableRows,
      startY: currentY,
      margin: { left: margins.left + 10, right: margins.right + 10 },
      tableWidth: doc.internal.pageSize.width - margins.left - margins.right - 20,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 102, 204],
        textColor: [255, 255, 255],
        fontSize: 12
      },
      styles: {
        fontSize: 12,
        cellPadding: 1
      }
    });

    // Move to position for the footer
    currentY = doc.internal.pageSize.height - margins.bottom - 40;

    // Add footer text
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for your payment. Please retain this receipt for your records.', margins.left, currentY);
    currentY += lineHeight;
    doc.text('Regards,', margins.left, currentY);
    currentY += lineHeight;
    doc.text('VISAKHAPATNAM METROPOLITAN REGION DEVELOPMENT AUTHORITY', margins.left, currentY);

    // Generate the PDF as a Blob
    const pdfBlob = doc.output('blob');

    // Prepare FormData to send the PDF to the backend
    const formData = new FormData();
    formData.append('pdf', pdfBlob, `Receipt_${payload.receipt_no}.pdf`);
    // formData.append('userId', payload.User);
    formData.append('userId',responseData.user); // Check if 'User' is U00006
console.log('User ID sent in formData:', formData.get('userId'));

    // Send the PDF to the backend for emailing
    this.billDetailService.sendEmailWithAttachment(formData).subscribe({
      next: (response) => {
        console.log('Email sent successfully!', response);
      },
      error: (error) => {
        console.error('Error sending email:', error);
      }
    });
  }

  showPaymentPopup(){
    this.showPayPopup=true;
  }
}
