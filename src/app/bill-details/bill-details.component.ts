import { Component, OnInit } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { HeaderComponent } from '../header/header.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FooterComponent } from '../footer/footer.component';
import { BillDetailsService } from '../services/billDetails/bill-details.service';
import { billDetails } from '../interfaces/billDetails/billDetailsInterfaces';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas'; 


@Component({
  selector: 'app-bill-details',
  standalone: true,
  imports: [PrimeNgModule, HeaderComponent, DashboardComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './bill-details.component.html',
  styleUrls: ['./bill-details.component.scss'],
  providers: [DatePipe]
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

  constructor(private billDetailService: BillDetailsService, private datepipe: DatePipe) {}

  ngOnInit(): void {
    this.getbilldetails();
    this.form = new FormGroup({
      s_no: new FormControl({ value: '', disabled: true }),
      bill_no: new FormControl({ value: '', disabled: true }),
      user_id: new FormControl({ value: '', disabled: true }),
      property_code: new FormControl({ value: '', disabled: true }),
      lease_period: new FormControl({ value: '', disabled: true }),
      lease_Amount: new FormControl({ value: '', disabled: true }),
      gst: new FormControl({ value: '', disabled: true }),
      power_bill_amount: new FormControl(''),
      water_bill_amount: new FormControl(''),
      maintenance_amount: new FormControl(''),
      lease_interests: new FormControl({ value: '', disabled: true }),
      total: new FormControl('')
    });
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
        // Update your form or dataSource as needed
        if (res.length > 0) {
          const billDetail = res[0]; // Assuming you get an array and want the first result
          this.form.patchValue({
            s_no: billDetail.S_No,
            bill_no: billDetail.Bill_No,
            user_id: billDetail.User_ID,
            property_code: billDetail.Property_Code,
            lease_period: billDetail.Lease_Period,
            lease_Amount: billDetail.Lease_Amount,
            gst: billDetail.GST,
            // power_bill_amount: billDetail.Power_Bill_Amount,
            // water_bill_amount: billDetail.Water_Bill_Amount,
            // maintenance_amount: billDetail.Power_Bill_Amount,
            lease_interests: billDetail.Lease_Interest,
            total: billDetail.total
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
    this.billDetailService.getBillDetails().subscribe({
      next: (res: any) => {
        this.dataSource = Object.keys(res).map(key => ({ ...res[key] }));
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

  formatDate(dateString: string): string {
    return this.datepipe.transform(dateString, 'yyyy-MM-dd') || '';
  }

  onSubmit() {
    if (this.form.valid) {
      // Get the form values including disabled fields
      const formData = this.form.getRawValue(); 
  
      // Prepare the payload for the backend
      const updateData = {
        bill_no: formData.bill_no, // Ensure correct parameter name
        power_bill_amount: formData.power_bill_amount,
        water_bill_amount: formData.water_bill_amount,
        maintenance_amount: formData.maintenance_amount,
        lease_interests: formData.lease_interests,
        total: formData.total
      };
  
      // Call the service to update bill details
      this.billDetailService.updateBillDetails(updateData).subscribe({
        next: (response) => {
          console.log('Form submitted successfully:', response);
          this.visible = false; // Hide the dialog on success
          //this.sendEmail();   // after api call successful send mail
        },
        error: (error) => {
          console.error('Error submitting form:', error);
          // Handle error, e.g., show a notification to the user
        }
      });
    } else {
      console.error('Form is invalid');
      // Optionally handle form validation errors
    }
  }

   // Method to generate the PDF
   generatePDF(bill: billDetails) {
    const doc = new jsPDF('p', 'pt', 'a4'); // Create a new jsPDF instance

    // Set up the document title
    doc.setFontSize(18);
    doc.text('Bill Details', 20, 30);

    // Add Bill Data (for example)
    doc.setFontSize(12);
    doc.text(`Bill No: ${bill.Bill_No}`, 20, 60);
    doc.text(`User ID: ${bill.User_ID}`, 20, 80);
    doc.text(`Lease Amount: ${bill.Lease_Amount}`, 20, 100);
    doc.text(`GST: ${bill.GST}`, 20, 120);
    doc.text(`Power Bill: ${bill.Power_Bill_Amount}`, 20, 140);
    doc.text(`Total Amount: ${bill.Total_Amount}`, 20, 160);

    // Save the PDF with a dynamic name
    doc.save(`Bill-${bill.Bill_No}.pdf`);
  }

  
  
}
