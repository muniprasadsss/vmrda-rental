import { ReceptDetailsService } from './../services/receptDetails/recept-details.service';
import { billDetails } from './../interfaces/billDetails/billDetailsInterfaces';
import { Component, OnInit } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { HeaderComponent } from '../header/header.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FooterComponent } from '../footer/footer.component';
import { BillDetailsService } from '../services/billDetails/bill-details.service';
// import { ReceptDetailsService } from '../services/receptDetails/recept-details.service';
import { ChangeDetectorRef } from '@angular/core';
// import { billDetails } from '../interfaces/billDetails/billDetailsInterfaces';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
// import autoTable from 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
declare var Razorpay: any;

@Component({
  selector: 'app-bill-details',
  standalone: true,
  imports: [PrimeNgModule, HeaderComponent, DashboardComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './bill-details.component.html',
  styleUrls: ['./bill-details.component.scss'],
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
  constructor(private billDetailService: BillDetailsService, private cd: ChangeDetectorRef, http: ReceptDetailsService) { }

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
      total: new FormControl('')
    });

    this.userRole = localStorage.getItem('role')
    this.userID = localStorage.getItem('userId')
    this.getbilldetails();
  }

  calculateTotal(): void {
    const leaseAmount = parseFloat(this.form.get('lease_Amount')?.value) || 0;
    const gst = parseFloat(this.form.get('gst')?.value) || 0;
    const powerBillAmount = parseFloat(this.form.get('power_bill_amount')?.value) || 0;
    const waterBillAmount = parseFloat(this.form.get('water_bill_amount')?.value) || 0;
    const maintenanceAmount = parseFloat(this.form.get('maintenance_amount')?.value) || 0;
    const leaseInterests = parseFloat(this.form.get('lease_interests')?.value) || 0;

    // Calculate the total
    const total = leaseAmount + gst + powerBillAmount + waterBillAmount + maintenanceAmount + leaseInterests;

    // Update the total field in the form
    this.form.get('total')?.setValue(total, { emitEvent: false }); // { emitEvent: false } to avoid circular triggers
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

  filterBillData() {
    this.paidBills = this.dataSource.filter(item => {
      return item.Status === 'FP'
    })
    if (this.userRole !== 'USER') {
      this.notPaidBills = this.dataSource.filter(item => {
        return item.Status === 'NP'
      })
    } else {
      this.notPaidBills = this.dataSource.filter(item => {
        return (item.Status === 'NP' && item.BillStatus === 'Active')
      })
    }

  }

  sendEmail() {
    this.billDetailService.sendEmail(this.emailData).subscribe(
      (response) => {

      },
      (error) => {

      }
    );

  }


  onSubmit() {
    this.showModel = true
    if (this.form.valid) {
      const formData = this.form.getRawValue();

      const updateData = {
        BillNo: formData.bill_no, // Ensure correct parameter name
        Power_bill: formData.power_bill_amount,
        Water_bill: formData.water_bill_amount,
        Maintainance_bill: formData.maintenance_amount,
        Total: formData.total
      };

      this.billDetailService.updateBillDetails(updateData).subscribe({
        next: (response) => {
          this.getbilldetails();

          this.showModel = false;
          // Optionally send an email
          // this.sendEmail();
        },
        error: (error) => {
          console.error('Error submitting form:', error);
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }

  generatePDF(bill: any) {


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
          // ["User ID", bill.User],
          ["Property Code", bill.Property],
          ["Lease Period", bill.Bill_Period], // Since no lease period is provided in the bill object, you can add static data or calculate it
          ["Lease Amount", bill.Rental_lease_amount_permonth],
          ["GST", bill.GST],
          ["Power Bill Amount", bill.Power_bill],
          ["Water Bill Amount", bill.Water_bill],
          ["Maintenance Amount", bill.Maintainance_bill],
          ["Lease Interests", bill.Total_rental_interest],
          ["Total", bill.Total],
          // [".hhh",this.propertyDetail.ALLOTTEE_NAME]
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
        doc.save(`Bill_Receipt_${bill.Property}.pdf`);
      }
    }
    )
  }

  generateChallanNumber(UserID: string): string {
    const currentDate = new Date();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month as a number, padded to 2 digits
    const currentYear = currentDate.getFullYear();


    return `rec/vmrda/${currentMonth}/${currentYear}/${UserID}`;
  }

  showDialog1() {
    this.visible1 = true;
  }


  payBill(bill: any) {
    // Set the amount you want to charge
    this.amount = bill.Total; // Razorpay expects the amount in paise

    // Call Razorpay payment
    this.billDetailService.createOrder(this.amount).subscribe(
      (order) => {

        const options = {
          key: 'rzp_test_JKpUkmYnatBjUA', // Replace with your Razorpay key ID
          amount: order.data.amount, // Amount in paise
          currency: 'INR',
          name: 'Your Company Name',
          description: `Payment for ${bill.Property}`,
          order_id: order.data.id, // Razorpay order ID
          handler: (response: any) => {
            // On payment success, update bill and create receipt
            this.verifyPayment(response, bill);
          },
          prefill: {
            name: bill.User, // Prefill with user info from the bill
            email: 'user@example.com', // Modify if you have user emails
            contact: '9999999999', // Modify if you have user phone numbers
          },
          theme: {
            color: '#3399cc',
          },
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();
      },
      (error) => {

      }
    );
  }


  async verifyPayment(response: any, bill: any) {
    this.billDetailService.verifyPayment(response).subscribe({
      next: async (data) => {
        if (data.message === "Payment verified successfully") {
          const challanNumber = this.generateChallanNumber(bill.User);

          const transactionData = {
            "id": data.paymentDetails.id ?? "No Data",
            "invoice_id": data.paymentDetails.invoice_id ?? "No Data",
            "order_id": data.paymentDetails.order_id ?? "No Data",
            "method": data.paymentDetails.method ?? "No Data",
            "upi_transaction_id": data.paymentDetails.acquirer_data.upi_transaction_id ?? "No Data",
            "amount": data.paymentDetails.amount ?? "No Data",
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

          this.billDetailService.saveTransactionDetails(transactionData).subscribe({
            next: async (response) => {


              const updateData = {
                BillNo: bill.BillNo,
                Status: 'FP',
                TotalPaid: bill.Total,
                Due: 0,
                Vmrda_Challan_No: challanNumber,
              };

              this.billDetailService.updateBillDetailsByBillNo(updateData).subscribe({
                next: async (response) => {
                  if (response.status === 200) {


                    await this.createReceipt({
                      BillNo: bill.BillNo,
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
                      Status: 'FP'
                    });


                    await this.getbilldetails();
                    //  this.cd.markForCheck(); // Changed to markForCheck
                    this.cd.detectChanges();


                  } else {
                    console.error('Error updating bill:', response.message);
                  }
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




  createAndSendReceiptPDF(receiptData: any) {
    const doc = new jsPDF();
    const margins = { top: 15, bottom: 15, left: 20, right: 20 };
    const lineHeight = 8;
    let currentY = margins.top;

    // Add logo and receipt content
    const vmrdaLogoBase64 = '../../assets/vmrda_logo_image.png';
    const logoWidth = 20;
    const logoHeight = 20;
    const logoX = (doc.internal.pageSize.width - logoWidth) / 2;
    doc.addImage(vmrdaLogoBase64, 'PNG', logoX, currentY, logoWidth, logoHeight, '', 'FAST');
    currentY += logoHeight + 5;

    // Add borders, headings, receipt content (refer to your existing content generation logic)

    // Receipt details in table form
    const tableRows = [
      ["Receipt No", receiptData.ReceiptNo],
      ["User ID", receiptData.User],
      ["Bill No", receiptData.BillNo],
      ["Property Code", receiptData.Property],
      ["Paid Date", receiptData.paid_date],
      ["Lease Amount", receiptData.Rental_lease_amount_permonth],
      ["GST", receiptData.GST],
      ["Total Paid", receiptData.TotalPaid],
      ["Due Amount", receiptData.Due],
      ["Payment Status", receiptData.Status]
    ];

    const tableStartY = currentY + 7;

    autoTable(doc, {
      body: tableRows,
      startY: tableStartY,
      margin: { left: margins.left + 10, right: margins.right + 10 },
      tableWidth: doc.internal.pageSize.width - margins.left - margins.right - 20,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 102, 204],
        textColor: [255, 255, 255],
        fontSize: 12 // Adjusted font size
      },
      styles: {
        fontSize: 12,
        cellPadding: 1
      }
    });

    // Footer (as per your logic)

    // Generate PDF Blob
    const pdfBlob = doc.output('blob');

    // Prepare FormData to send the PDF to the backend
    const formData = new FormData();
    formData.append('pdf', pdfBlob, `Receipt_${receiptData.ReceiptNo}.pdf`);

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


  //Function to create a receipt after successful payme
  createReceipt(receiptData: any) {

    this.billDetailService.updateReceipt(receiptData).subscribe((response) => {
      if (response.status === 200) {

        console.log('Receipt created successfully!');

      } else {
        console.error('Error creating receipt:', response.message);
        this.createAndSendReceiptPDF(receiptData);
      }
    });
  }








  generatePDF1(bill: any) {
    this.billDetailService.getPropertyInfo(bill.BillNo).subscribe({
      next: (res: any) => {
        this.propertyData = res;
        this.propertyDetail = this.propertyData.propertyInfo;

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

        doc.setFontSize(12).setFont('helvetica', 'bold');
        doc.text('Payment Receipt', doc.internal.pageSize.width / 2, currentY, { align: 'center' });
        currentY += lineHeight;

        // Date and Bill No
        const currentDate = new Date().toLocaleDateString();
        doc.setFontSize(12).setFont('helvetica', 'normal');
        doc.text(`Bill No: `, margins.left, currentY);
        doc.setFont('helvetica', 'bold');
        doc.text(`${bill.BillNo}`, margins.left + 20, currentY); // Adjusted position for bold text
        doc.setFont('helvetica', 'normal');
        doc.text(`Dt: `, doc.internal.pageSize.width - margins.right - 45, currentY);
        doc.setFont('helvetica', 'bold');
        doc.text(`${currentDate}`, doc.internal.pageSize.width - margins.right - 30, currentY); // Adjusted position for bold text
        currentY += lineHeight * 2;

        // Dynamic content
        doc.setFontSize(12).setFont('helvetica', 'bold');
        doc.text(`Property Name: `, margins.left, currentY);
        doc.setFont('helvetica', 'bold');
        doc.text(`${bill.Property}`, margins.left + 40, currentY); // Adjusted position for bold text
        currentY += lineHeight;

        doc.setFont('helvetica', 'normal');
        doc.text(
          `The property with code ${bill.Property} for an extent of ${this.propertyDetail.EXTENT} sqft., located in ${this.propertyDetail.LOCATION}, has been successfully paid by ${this.propertyDetail.ALLOTTEE_NAME}. The payment of Rs. ${bill.Total}, including lease and other charges (GST, utility bills), has been completed for the period ${bill.Rental_lease_amount_permonth}. Thank you for your timely payment.`,
          margins.left, currentY,
          { maxWidth: doc.internal.pageSize.width - margins.left - margins.right }
        );
        currentY += lineHeight * 4;

        doc.text(
          `No further action is required at this time. Please keep this receipt for your records. We appreciate your prompt payment and cooperation.`,
          margins.left, currentY,
          { maxWidth: doc.internal.pageSize.width - margins.left - margins.right }
        );
        currentY += lineHeight * 2;

        // Table
        const tableRows = [
          ["Bill No", bill.BillNo],
          ["Property Code", bill.Property],
          ["Lease Period", bill.Bill_Period],
          ["Lease Amount", bill.Rental_lease_amount_permonth],
          ["GST", bill.GST],
          ["Power Bill Amount", bill.Power_bill],
          ["Water Bill Amount", bill.Water_bill],
          ["Maintenance Amount", bill.Maintainance_bill],
          ["Total Paid", bill.Total]
        ];

        const tableStartY = currentY + 7;

        autoTable(doc, {
          body: tableRows.map(row => [row[0], row[1]]), // Adjust to make labels and values bold in the table
          startY: tableStartY,
          margin: { left: margins.left + 10, right: margins.right + 10 },
          tableWidth: doc.internal.pageSize.width - margins.left - margins.right - 20,
          theme: 'grid',
          headStyles: {
            fillColor: [0, 102, 204],
            textColor: [255, 255, 255]
          },
        });

        // Footer
        currentY = doc.internal.pageSize.height - margins.bottom - 20;
        doc.setFontSize(12).setFont('helvetica', 'normal');
        doc.text('Thank you for your payment. Please retain this receipt for your records.', margins.left, currentY);
        currentY += lineHeight;
        doc.text('Regards,', margins.left, currentY);
        currentY += lineHeight;
        doc.text('VISAKHAPATNAM METROPOLITAN REGION DEVELOPMENT AUTHORITY', margins.left, currentY);

        // Save the PDF
        doc.save(`Payment_Receipt_${bill.Property}.pdf`);
      }
    });
  }





}
