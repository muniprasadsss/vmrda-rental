import { Component, OnInit } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { HeaderComponent } from '../header/header.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FooterComponent } from '../footer/footer.component';
import { BillDetailsService } from '../services/billDetails/bill-details.service';
import { billDetails } from '../interfaces/billDetails/billDetailsInterfaces';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';
// import autoTable from 'jspdf-autotable';
import autoTable from 'jspdf-autotable';


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
  constructor(private billDetailService: BillDetailsService) {}

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
    console.log(bill_no);
    this.visible = true;

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
          console.log('Form submitted successfully:', response);
          this.visible = false;
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

  generatePDF(bill: billDetails){
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
    doc.text(`Bill No.. ${bill.Bill_No}`, margins.left, currentY);
    doc.text(`Dt: ${currentDate}`, doc.internal.pageSize.width - margins.right - 45, currentY);
    currentY += lineHeight * 2;

    // Dynamic content based on form data
    doc.setFontSize(12);
    doc.setFont('times', 'bold');
    doc.text(`Property Code: ${bill.Property_Code}`, margins.left, currentY);
    currentY += lineHeight * 1;

    doc.setFont('times', 'normal');
    doc.text(`The property with code ${bill.Property_Code}, leased to ${bill.User_ID}, located in ${bill.Property_Code}, has a monthly lease amount of ${bill.Lease_Amount} with additional charges such as GST and utility bills.`,
      margins.left, currentY,
      { maxWidth: doc.internal.pageSize.width - margins.left - margins.right }
    );
    currentY += lineHeight * 3;

    doc.text(`The lease amount for the period ${bill.Lease_Period} is due. Please remit the amount of ${bill.Total_Amount} by the due date, failing which further action will be taken according to the terms and conditions.`,
      margins.left, currentY,
      { maxWidth: doc.internal.pageSize.width - margins.left - margins.right }
    );
    currentY += lineHeight * 2;

    // Adjusting table margins and reducing its width to fit within the border
    const tableColumn = ["Field", "Value"];
    const tableRows = [
      ["Bill No", bill.Bill_No],
      ["User ID", bill.User_ID],
      ["Property Code", bill.Property_Code],
      ["Lease Period", bill.Lease_Period],
      ["Lease Amount", bill.Lease_Amount],
      ["GST", bill.GST],
      ["Power Bill Amount", bill.Power_Bill_Amount],
      ["Water Bill Amount", bill.Water_Bill_Amount],
      ["Maintenance Amount", bill.Maintainence_Amount],
      ["Lease Interests", bill.Lease_Interest],
      ["Total", bill.Total_Amount],
    ];

    const tableStartY = currentY + 7;

    // Using autoTable with proper margins for table alignment inside the border
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: tableStartY,
      margin: { left: margins.left + 10, right: margins.right + 10 }, // Adjusting left and right margins
      tableWidth: doc.internal.pageSize.width - margins.left - margins.right - 20, // Reduced table width to fit inside
      theme: 'grid', // Adding borders to the table
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
    doc.save(`Bill_Receipt_${bill.Property_Code}.pdf`);
  }

  generateChallanNumber(UserID: string): string {
    const currentMonth = new Date().toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const currentYear = new Date().getFullYear();

    return `rec/vmrda/${currentMonth}/${currentYear}/${UserID}`;
  }

payBill(bill: any) {
  const challanNumber = this.generateChallanNumber(bill.UserID); // Pass user ID to the function

  // Update bill details
  const updateData = {
    BillNo: bill.BillNo,
    Status: 'FP',
    TotalPaid: bill.Total,
    Due: 0,
    Vmrda_Challan_No: challanNumber,
  };

  this.billDetailService.updateBillDetailsByBillNo(updateData).subscribe(response => {
    if (response.status === 200) {
      console.log('Bill updated successfully!');
      // Create receipt
      this.createReceipt({
        BillNo: bill.BillNo,
        ReceiptNo: challanNumber, // Use challan number as receipt number
        User: bill.User,
        Property: bill.Property,
        paid_date: new Date().toISOString(), // or any other date format
        Rental_lease_amount_permonth: bill.Rental_lease_amount_permonth,
        GST: bill.GST,
        Total_rental_interest: bill.Total_rental_interest,
        Total: bill.Total,
        TotalPaid: bill.Total,
        Due: 0,
        Status: 'FP'
      });
      this.getbilldetails();

    } else {
      console.error('Error updating bill:', response.message);
    }
  });
}


  createReceipt(receiptData: any) {
  console.log('Creating receipt with data:', receiptData); // Add logging to check the data
  this.billDetailService.updateReceipt(receiptData).subscribe(response => {
    if (response.status === 201) {
      console.log('Receipt created successfully!');
    } else {
      console.error('Error creating receipt:', response.message);
    }
  });
}
// showModel() {
//   this.showModel = true;
  // }
   showDialog1() {
        this.visible1 = true;
    }

}
