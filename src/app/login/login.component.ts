import { Component } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,PrimeNgModule,RouterOutlet],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private router:Router){}
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
      alert("Please enter a valid OTP.");
    } else {
      this.router.navigateByUrl("/dashboard");
    }
  
  }
}
