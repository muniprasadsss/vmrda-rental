import { Component } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthGuardsService } from '../services/authGuards/auth-guards.service';
import { LoginService } from '../services/login/login.service';
import { errorContext } from 'rxjs/internal/util/errorContext';
import { ProfileSettingsService } from '../services/profileSettings/profile-settings.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,PrimeNgModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  AuthGuardsService: any;
  constructor(private router:Router,private toasterservice:ToastrService,
    private LoginService:LoginService,
    private authService: AuthGuardsService,private profileService:ProfileSettingsService){}
  userID: string = '';
  password: string = '';
  verifyUserID: string = '';
  otp: number | undefined
  formError: string = '';
  newPassword: string = '';
  renterNewPass: string = '';
  otpDiv:boolean=false;
  forgotPasswordDiv:boolean=false;
  showForgotOtpDiv: boolean = false; 
  isNewPassword: boolean = false; 
  timer: number = 60;
  isTimerActive: boolean = true;

  ngOnInit(){
   
  }
  startTimer() {
    this.isTimerActive = true;
    this.timer = 60;
    const interval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        this.isTimerActive = false;
        clearInterval(interval);
      }
    }, 1000); // Countdown every second
  }

  Login(form: any) {
      if( this.userID.length>0   && this.password.length>0 ){
        
        this.LoginService.userLogin(this.userID,this.password).subscribe({
          next:(res:any)=>{
            this.otpDiv= res.uservalid
            this.startTimer();
            localStorage.setItem('token', res.token);
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
      this.LoginService.verifyOTP(this.otp,this.userID).subscribe({
        next:(res:any)=>{
          localStorage.setItem('userInfo', JSON.stringify(res.data));
      this.authService.login(res.data.user_type,res.data.USER_ID)
      this.toasterservice.success("login successful")

      if(res.data.user_type === 'USER'){
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
  forgetPassverifyOtp() {
    if (this.otp) {
      this.LoginService.verifyOTPForgetPass(this.userID,this.otp).subscribe({
        next:(res:any)=>{
          localStorage.setItem('userInfo', JSON.stringify(res.user));
        this.isNewPassword = true;
        this.otpDiv = false;
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
  verifyOtp() {
    if (this.otp) {
      this.LoginService.verifyOTP(this.otp,this.userID).subscribe({
        next:(res:any)=>{
          localStorage.setItem('userInfo', JSON.stringify(res.user));
        this.isNewPassword = true;
        this.otpDiv = false;
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


  submitNewPassword() {
      if(this.newPassword === this.renterNewPass){
        const senddata = {
          old_password:this.newPassword,
          new_password:this.renterNewPass,
          USER_ID: this.userID, 
        };

        this.profileService.changePassword(senddata).subscribe(
          response => {
            console.log('Password changed successfully:', response);
            this.toasterservice.success('Password changed successfully!'); // Show success message
            
            this.forgotPasswordDiv = false;
            this.isNewPassword = false;
          },
          error => {
            console.error('Error changing password:', error);
            this.toasterservice.error('Error changing password. Please try again.'); // Show error message
          }
        );
      }
      else{
        this.toasterservice.error("New passwords do not match");
      }
  }
  
  resendOtp() {
    if( this.userID.length>0   && this.password.length>0 ){
        let payload = {
          USER_ID:this.userID
        }
      this.LoginService.resendOtp(payload).subscribe({
        next:(res:any)=>{
          this.startTimer();
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




  ForgotPassword(form: any) {
    if (this.userID.length > 0) {
      console.log(this.userID, "User ID on confirm password");
      this.LoginService.OtpForChangePassword(this.userID).subscribe(
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

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      // Submit the form on Enter key press
      this.submitOtp();
      console.log("Enter clicked...");
    }
     else if (event.key === 'Escape') {
      console.log("Esc clicked...");
    }
  }

  // Prevent copy paste for password 

  preventPaste(event: ClipboardEvent) {
    event.preventDefault();
  }
  
  preventCopy(event: ClipboardEvent) {
    event.preventDefault();
  }
  
  preventCut(event: ClipboardEvent) {
    event.preventDefault();
  }
  
}
