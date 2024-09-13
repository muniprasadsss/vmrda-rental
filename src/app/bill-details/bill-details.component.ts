import { Component, OnInit } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { HeaderComponent } from '../header/header.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FooterComponent } from '../footer/footer.component';
import { BillDetailsService } from '../services/billDetails/bill-details.service';
import { billDetails } from '../interfaces/billDetails/billDetailsInterfaces';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-bill-details',
  standalone: true,
  imports: [PrimeNgModule,HeaderComponent,DashboardComponent,FooterComponent,ReactiveFormsModule],
  templateUrl: './bill-details.component.html',
  styleUrl: './bill-details.component.scss',
  providers: [DatePipe] // Add DatePipe here
})
export class BillDetailsComponent  {

  emailData = {
    to: 'srivatsavatsa25@gmail.com', 
    subject: 'Test Email from Angular',
    text: 'Hello! This is a test email sent from the Angular frontend using Nodemailer backend.',
  };
  constructor(private billDetailService:BillDetailsService,private datepipe:DatePipe){}
  visible: boolean = false;
  responseMsg: string | undefined;
  dataSource!: billDetails[];
  form!: FormGroup;


ngOnInit(): void {
  this.getbilldetails()
  this.form = new FormGroup({
    s_no: new FormControl({ value: '188', disabled: true }) ,  
    bill_no: new FormControl('VMRDAB01'),  
    user_id: new FormControl('9999999999MANA'), 
    property_code: new FormControl('RN-D1-CS1-GS01') ,
    lease_Amount: new FormControl('') ,
    gst: new FormControl('') ,
    power_bill_amount: new FormControl('') ,
    water_bill_amount: new FormControl('') ,
    maintenance_amount: new FormControl('') ,
    interests: new FormControl('') ,
    total: new FormControl('') 
  });
}

  showDialog() {
    this.visible = true;
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

}
