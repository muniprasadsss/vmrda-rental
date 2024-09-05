import { Component } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,PrimeNgModule,RouterOutlet],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private router:Router,private toasterservice:ToastrService){}
  username: string = '';
  password: string = '';
  otp: string=';'
  formError: string = '';
  otpDiv:boolean=false;
  Login(form: any) {
    this.otpDiv=true;
  }
  submitOtp() {
    console.log(this.otp,"after click")
    if (this.otp.length > 0) {
      this.toasterservice.warning("Please enter valid otp")
    } else {
      this.toasterservice.success("login successful")
      this.router.navigateByUrl("/dashboard");
    }
  
  }
  // submitOtp() {
  //   console.log(this.otp, "after click");
  //   if (!this.otp || this.otp.trim().length === 0) {  // Check if OTP is empty
  //     alert("Please enter a valid OTP.");
  //   } else {
  //     this.toasterservice.success("Login successful");
  //     this.router.navigateByUrl("/dashboard");
  //   }
  // }
  
}
