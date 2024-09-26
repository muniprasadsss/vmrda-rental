import { Component } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthGuardsService } from '../services/authGuards/auth-guards.service';
import { LoginService } from '../services/login/login.service';
import { errorContext } from 'rxjs/internal/util/errorContext';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,PrimeNgModule,RouterOutlet],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  AuthGuardsService: any;
  constructor(private router:Router,private toasterservice:ToastrService,private LoginService:LoginService,
    private authService: AuthGuardsService){}
  userID: string = '';
  password: string = '';
  verifyUserID: string = '';
  otp: number | undefined
  forgotOtp: number | undefined
  formError: string = '';
  otpDiv:boolean=false;
  forgotPasswordDiv:boolean=false;
  showForgotOtpDiv: boolean = false; // New property for OTP display
Login(form: any) {
    if( this.userID.length>0   && this.password.length>0 ){
      
      this.LoginService.userLogin(this.userID,this.password).subscribe({
        next:(res:any)=>{
          this.otpDiv= res.uservalid
        },
        error:(err:any)=>{
          this.toasterservice.warning("Please enter valid userID and password")
        }
      })  
    }
    else{
      this.toasterservice.warning("Please enter valid userID and password")
    }
  }


  submitOtp() {
    if (this.otp) {
      this.LoginService.verifyOTP(this.userID,this.otp).subscribe({
        next:(res:any)=>{
          localStorage.setItem('userInfo', JSON.stringify(res.user));
      this.authService.login(res.user.user_type,res.user.USER_ID)
      this.toasterservice.success("login successful")

      if(res.user.user_type === 'USER'){
        this.router.navigateByUrl("billDetails")
      }else{
        this.router.navigateByUrl("user")
      }
        },
        error:(err:any)=>{
          this.toasterservice.warning("Please enter valid otp")
        }
      })
      
    }
     else {
      this.toasterservice.warning("Please enter valid otp")
      
    }
  
  }
  
  ForgotPasswordDiv(){
    this.forgotPasswordDiv=true
  }

  // ForgotPassword(form:any){
  //  if(this.verifyUserID.length>0){
  //   console.log(this.verifyUserID,"userid on confirm password");
  //  }
   
  // }

  // ForgotPassword(form: any) {
  //   if (this.verifyUserID.length > 0) {
  //     console.log(this.verifyUserID, "User ID on confirm password");
  //     this.LoginService.OtpForChangePassword(this.verifyUserID).subscribe(
  //       response => {
  //         console.log('Response:', response);
  //         // Handle successful response (e.g., show a success message)
  //       },
  //       error => {
  //         console.error('Error:', error);
  //         // Handle error response (e.g., show an error message)
  //       }
  //     );
  //   } else {
  //     console.log('Please enter a valid User ID.');
  //   }
  // }

  ForgotPassword(form: any) {
    if (this.verifyUserID.length > 0) {
      console.log(this.verifyUserID, "User ID on confirm password");
      this.LoginService.OtpForChangePassword(this.verifyUserID).subscribe(
        response => {
          console.log('Response:', response);
          this.showForgotOtpDiv = true; // Show OTP input
          this.otpDiv = true; // Set to true if you want to manage OTP display globally
        },
        error => {
          console.error('Error:', error);
          this.toasterservice.warning("Failed to send OTP, please try again.");
        }
      );
    } else {
      this.toasterservice.warning('Please enter a valid User ID.');
    }
  }
}
