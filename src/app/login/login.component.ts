import { Component } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthGuardsService } from '../services/authGuards/auth-guards.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,PrimeNgModule,RouterOutlet],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  AuthGuardsService: any;
  constructor(private router:Router,private toasterservice:ToastrService,
    private authService: AuthGuardsService){}
  username: string = '';
  password: string = '';
  otp: string=''
  formError: string = '';
  otpDiv:boolean=false;
  Login(form: any) {
    if((this.username==="COMISSIONER" && this.username.length>0 || 
      this.username==="SECRETARY" && this.username.length>0||
      this.username==="AO" && this.username.length>0||
      this.username==="RI" && this.username.length>0||
       this.username==="USER" && this.username.length>0)  && this.password==="password"){
      this.otpDiv=true;  
    }
    else{
      this.toasterservice.warning("Please enter valid username and password")
    }
  }
  submitOtp() {
    console.log(this.otp,"after click")
    if (this.otp.length < 0 || this.otp.length===0) {
      this.toasterservice.warning("Please enter valid otp")
    } else {
      this.authService.login(this.username)
      this.toasterservice.success("login successful")
      if(this.username === 'USER'){
        this.router.navigateByUrl("billDetails")
      }else{
        this.router.navigateByUrl("user")
      }

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
