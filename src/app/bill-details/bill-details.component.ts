import { billDetails } from './../interfaces/billDetails/billDetailsInterfaces';
import { Component, OnInit } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { HeaderComponent } from '../header/header.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FooterComponent } from '../footer/footer.component';
import { BillDetailsService } from '../services/billDetails/bill-details.service';
import { ChangeDetectorRef } from '@angular/core';
// import { billDetails } from '../interfaces/billDetails/billDetailsInterfaces';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {jsPDF} from 'jspdf';
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
  userRole:any
  userID: any
  showModel: boolean = false;
    visible1: boolean = false;
  propertyData: any;
  propertyDetail: any;
  amount: any;

  constructor(private billDetailService: BillDetailsService,private cd: ChangeDetectorRef) {}

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
    console.log(total,"total amount check...");
    

    // Update the total field in the form
    this.form.get('total')?.setValue(total, { emitEvent: false }); // { emitEvent: false } to avoid circular triggers
  }
  // Updated showDialog method to fetch data based on bill_no
  showDialog(bill_no: string) {
    console.log(bill_no);
    this.visible = true;
    this.showModel = true;
    // Fetch details based on bill_no
    this.billDetailService.getBillDetailsByBillNo(bill_no).subscribe({
      next: (res: any) => {
        console.log('Fetched bill details:', res);
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
    this.billDetailService.getBillDetailsByUserId(this.userID,this.userRole).subscribe({
      next: (res: any) => {
        this.dataSource = res.billingData; // Direct assignment if it's an array
        this.responseMsg = res.message;
        console.log(this.dataSource, "userservice data...");
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

    //   getProperty(){


    // }

  sendEmail() {
    this.billDetailService.sendEmail(this.emailData).subscribe(
      (response) => {
        console.log('Email sent successfully', response);
      },
      (error) => {
        console.error('Error sending email', error);
      }
    );
    console.log("Button clicked...");
  }


  onSubmit() {
    this.showModel=true
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
          console.log('Form submitted successfully:', response);
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
     this.propertyDetail=  this.propertyData.propertyInfo
        console.log(this.propertyDetail.PROPERTY_CODE,"propertydata....")

    const doc = new jsPDF();

    // Reduced page margins
    const margins = { top: 15, bottom: 15, left: 20, right: 20 };
    const lineHeight = 10;
    let currentY = margins.top;
    const vmrdaLogoBase64 = '../../assets/vmrda_logo_image.png'; // Replace with your logo's Base64 string
    const logoWidth = 30; // Width of the logo in mm
    const logoHeight = 30; // Height of the logo in mm

    // Adjust the X position to center the logo
    const logoX = (doc.internal.pageSize.width - logoWidth) / 2;
    doc.addImage(vmrdaLogoBase64, 'PNG', logoX, currentY, logoWidth, logoHeight);
    currentY += logoHeight + 5;

    // Drawing a smaller border
    doc.setLineWidth(0.5); // Reduced border thickness
    doc.rect(
      margins.left - 5,  // Adjusted border to be inside
      margins.top - 5,
      doc.internal.pageSize.width - (margins.left + margins.right - 10),
      doc.internal.pageSize.height - (margins.top + margins.bottom - 10)
    );

    // Heading (with reduced font size)
    doc.setFontSize(12); // Reduced font size for heading
    doc.setFont('times', 'bold');
    doc.text('VISAKHAPATNAM METROPOLITAN REGION DEVELOPMENT AUTHORITY',
      doc.internal.pageSize.width / 2, currentY, { align: 'center' }
    );
    currentY += lineHeight + 2;

    doc.setFontSize(12); // Reduced font size for subheading
    doc.text('Bill Receipt', doc.internal.pageSize.width / 2, currentY, { align: 'center' });
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
    doc.text(`Property Code: ${bill.Property}`, margins.left, currentY);
    currentY += lineHeight * 1;

    doc.setFont('times', 'normal');
        doc.text(` The Property with ${bill.Property} for an extent of ${this.propertyDetail.EXTENT} sqft. located in the ${this.propertyDetail.LOCATION} has been alloted to  ${this.propertyDetail.ALLOTTEE_NAME} vide reference cited  leased to ${bill.Rental_lease_amount_permonth}, located in ${bill.Property}, in  has a monthly lease amount of ${bill.Rental_lease_amount_permonth} with additional charges such as GST and utility bills.The license of the shop shall have to pay lease amount on or before 10th of every month. Whereas the license has failed to pay monthly lease as per the stipulated time and an amount ${bill.Total} is overdue against the said shop as detailed below`,
//           to The property with code ${bill.Property_Code}, leased to ${bill.User_ID}, located in ${bill.Property_Code}, in  has a monthly lease amount of ${bill.Lease_Amount} with additional charges such as GST and utility bills.`,
// //         doc.text(`The Property with ${bill.Property} for an extent of ${ this.propertyDetail.EXTENT} located in the UB Complex (Near Parking
// Area, West Side) has been allotted to Sri V.Santosh Kumar vide reference cited on
// monthly license fee of 22,500/- subject to certain terms and conditions stipulated ₹
// therein. The licensee of the Shop shall have to pay license fee, on or before 10th of
// every month. Whereas the license has failed to pay monthly license fee as per the
// stipulated time and an amount of ₹1,12,893/- is overdue against the said shop as
// detailed below:`

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
  ["Lease Period", "1 month"], // Since no lease period is provided in the bill object, you can add static data or calculate it
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
    const currentMonth = new Date().toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const currentYear = new Date().getFullYear();

    return `rec/vmrda/${currentMonth}/${currentYear}/${UserID}`;
  }

// payBill(bill: any) {
//   const challanNumber = this.generateChallanNumber(bill.UserID); // Pass user ID to the function

//   // Update bill details
//   const updateData = {
//     BillNo: bill.BillNo,
//     Status: 'FP',
//     TotalPaid: bill.Total,
//     Due: 0,
//     Vmrda_Challan_No: challanNumber,
//   };

//   this.billDetailService.updateBillDetailsByBillNo(updateData).subscribe(response => {
//     if (response.status === 200) {
//       console.log('Bill updated successfully!');
//       // Create receipt
//       this.createReceipt({
//         BillNo: bill.BillNo,
//         ReceiptNo: challanNumber, // Use challan number as receipt number
//         User: bill.User,
//         Property: bill.Property,
//         paid_date: new Date().toISOString(), // or any other date format
//         Rental_lease_amount_permonth: bill.Rental_lease_amount_permonth,
//         GST: bill.GST,
//         Total_rental_interest: bill.Total_rental_interest,
//         Total: bill.Total,
//         TotalPaid: bill.Total,
//         Due: 0,
//         Status: 'FP'
//       });
//       this.getbilldetails();

//     } else {
//       console.error('Error updating bill:', response.message);
//     }
//   });
// }


//   createReceipt(receiptData: any) {
//   console.log('Creating receipt with data:', receiptData); // Add logging to check the data
//   this.billDetailService.updateReceipt(receiptData).subscribe(response => {
//     if (response.status === 201) {
//       console.log('Receipt created successfully!');
//     } else {
//       console.error('Error creating receipt:', response.message);
//     }
//   });
// }

   showDialog1() {
        this.visible1 = true;
  }


  payBill(bill: any) {
  // Set the amount you want to charge
  this.amount = bill.Total; // Razorpay expects the amount in paise

  // Call Razorpay payment
  this.billDetailService.createOrder(this.amount).subscribe(
    (order) => {
      console.log(order,"....")
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
      console.log('Error creating Razorpay order:', error);
    }
  );
}

// Verify the payment response and update the bill details
// verifyPayment(response: any, bill: any) {
//   this.billDetailService.verifyPayment(response).subscribe(
//     (data) => {
//       console.log(data,"data00000")

//    //   alert('Payment Verified Successfully');

//       // Generate a new challan number
//       const challanNumber = this.generateChallanNumber(bill.User);

//       // Update the bill details
//       const updateData = {
//         BillNo: bill.BillNo,
//         Status: 'FP', // Full Payment
//         TotalPaid: bill.Total,
//         Due: 0,
//         Vmrda_Challan_No: challanNumber,
//       };

//       this.billDetailService.updateBillDetailsByBillNo(updateData).subscribe((response) => {
//         if (response.status === 200) {
//           console.log('Bill updated successfully!');
//           this.createReceipt({
//             BillNo: bill.BillNo,
//             ReceiptNo: challanNumber, // Use challan number as receipt number
//             User: bill.User,
//             Property: bill.Property,
//             paid_date: new Date().toISOString(), // or any other date format
//             Rental_lease_amount_permonth: bill.Rental_lease_amount_permonth,
//             GST: bill.GST,
//             Total_rental_interest: bill.Total_rental_interest,
//             Total: bill.Total,
//             TotalPaid: bill.Total,
//             Due: 0,
//             Status: 'FP',
//           });
//           this.getbilldetails(); // Refresh the bill details
//         } else {
//           console.error('Error updating bill:', response.message);
//         }
//       });
//       this.getbilldetails();

//     },
//     (error) => {
//       console.error('Payment Verification Failed', error);
//     }
//   );
  // }
  async verifyPayment(response: any, bill: any) {
  this.billDetailService.verifyPayment(response).subscribe({
    next: async (data) => {
      if (data.message === "Payment verified successfully") {
        const challanNumber = this.generateChallanNumber(bill.User);

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
              console.log('Bill updated successfully!');

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

              // Trigger change detection manually
              this.cd.detectChanges();

            } else {
              console.error('Error updating bill:', response.message);
            }
          },
          error: (err) => {
            console.error('Error updating bill:', err);
          },
        });
      }
    },
    error: (error) => {
      console.error('Payment Verification Failed', error);
    },
  });
}

// Function to create a receipt after successful payment
createReceipt(receiptData: any) {
  console.log('Creating receipt with data:', receiptData); // Log receipt data
  this.billDetailService.updateReceipt(receiptData).subscribe((response) => {
    if (response.status === 201) {
      console.log('Receipt created successfully!');
    } else {
      console.error('Error creating receipt:', response.message);
    }
  });
}






 generatePDF1(bill: any) {
  this.billDetailService.getPropertyInfo(bill.BillNo).subscribe({
    next: (res: any) => {
      this.propertyData = res;
      this.propertyDetail = this.propertyData.propertyInfo;
      console.log(this.propertyDetail.PROPERTY_CODE, "propertydata....");

      const doc = new jsPDF();

      // Reduced page margins
      const margins = { top: 15, bottom: 15, left: 20, right: 20 };
      const lineHeight = 10;
      let currentY = margins.top;
      const vmrdaLogoBase64 = '../../assets/vmrda_logo_image.png'; // Logo path
      const logoWidth = 30;
      const logoHeight = 30;
      const logoX = (doc.internal.pageSize.width - logoWidth) / 2;
      doc.addImage(vmrdaLogoBase64, 'PNG', logoX, currentY, logoWidth, logoHeight);
      currentY += logoHeight + 5;

      // Drawing a smaller border
      doc.setLineWidth(0.5);
      doc.rect(
        margins.left - 5,
        margins.top - 5,
        doc.internal.pageSize.width - (margins.left + margins.right - 10),
        doc.internal.pageSize.height - (margins.top + margins.bottom - 10)
      );

      // Heading
      doc.setFontSize(12);
      doc.setFont('times', 'bold');
      doc.text('VISAKHAPATNAM METROPOLITAN REGION DEVELOPMENT AUTHORITY',
        doc.internal.pageSize.width / 2, currentY, { align: 'center' }
      );
      currentY += lineHeight + 2;

      doc.setFontSize(12);
      doc.text('Payment Receipt', doc.internal.pageSize.width / 2, currentY, { align: 'center' });
      currentY += lineHeight * 1;

      // Date and Bill No
      const currentDate = new Date().toLocaleDateString();
      doc.setFontSize(12);
      doc.setFont('times', 'normal');
      doc.text(`Bill No: ${bill.BillNo}`, margins.left, currentY);
      doc.text(`Dt: ${currentDate}`, doc.internal.pageSize.width - margins.right - 45, currentY);
      currentY += lineHeight * 2;

      // Dynamic content based on form data - Payment Success message
      doc.setFontSize(12);
      doc.setFont('times', 'bold');
      doc.text(`Property Code: ${bill.Property}`, margins.left, currentY);
      currentY += lineHeight * 1;

      doc.setFont('times', 'normal');
      doc.text(
        `The property with code ${bill.Property} for an extent of ${this.propertyDetail.EXTENT} sqft.,located in ${this.propertyDetail.LOCATION},has been successfully paid by ${this.propertyDetail.ALLOTTEE_NAME}. The payment of Rs. ${bill.Total},including lease and other charges (GST, utility bills), has been completed for the period ${bill.Rental_lease_amount_permonth}.
        Thank you for your timely payment.`,
        margins.left, currentY,
        { maxWidth: doc.internal.pageSize.width - margins.left - margins.right }
      );
      currentY += lineHeight * 4;

      doc.text(
        `No further action is required at this time. Please keep this receipt for your records.We appreciate your prompt payment and cooperation.`,
        margins.left, currentY,
        { maxWidth: doc.internal.pageSize.width - margins.left - margins.right }
      );
      currentY += lineHeight * 2;

      // Adjusting table margins and reducing its width to fit within the border
      const tableRows = [
        ["Bill No", bill.BillNo],
        ["Property Code", bill.Property],
        ["Lease Period", "1 month"],
        ["Lease Amount", bill.Rental_lease_amount_permonth],
        ["GST", bill.GST],
        ["Power Bill Amount", bill.Power_bill],
        ["Water Bill Amount", bill.Water_bill],
        ["Maintenance Amount", bill.Maintainance_bill],
        ["Total Paid", bill.Total]
      ];

      const tableStartY = currentY + 7;

      // Using autoTable with proper margins
      autoTable(doc, {
        body: tableRows,
        startY: tableStartY,
        margin: { left: margins.left + 10, right: margins.right + 10 },
        tableWidth: doc.internal.pageSize.width - margins.left - margins.right - 20,
        theme: 'grid',
        headStyles: {
          fillColor: [0, 102, 204],
          textColor: [255, 255, 255]
        },
      });

      // Footer content
      currentY = doc.internal.pageSize.height - margins.bottom - 20;
      doc.setFontSize(12);
      doc.setFont('times', 'normal');
      doc.text('Thank you for your payment. Please retain this receipt for your records.', margins.left, currentY);
      currentY += lineHeight * 1;
      doc.text('Regards,', margins.left, currentY);
      currentY += lineHeight;
      doc.text('VISAKHAPATNAM METROPOLITAN REGION DEVELOPMENT AUTHORITY', margins.left, currentY);

      // Save the PDF
      doc.save(`Payment_Receipt_${bill.Property}.pdf`);
    }
  });
}



}
