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
  otp: number | undefined
  formError: string = '';
  otpDiv:boolean=false;
  // Login(form: any) {
  //   if((this.userID==="COMISSIONER" && this.userID.length>0 || 
  //     this.userID==="SECRETARY" && this.userID.length>0||
  //     this.userID==="AO" && this.userID.length>0||
  //     this.userID==="RI" && this.userID.length>0||
  //      this.userID==="USER" && this.userID.length>0)  && this.password==="password"){
  //     this.otpDiv=true;  
  //   }
  //   else{
  //     this.toasterservice.warning("Please enter valid userID and password")
  //   }
  // }
  // submitOtp() {
  //   console.log(this.otp,"after click")
  //   if (this.otp.length < 0 || this.otp.length===0) {
  //     this.toasterservice.warning("Please enter valid otp")
  //   } else {
  //     this.authService.login(this.userID)
  //     this.toasterservice.success("login successful")
  //     if(this.userID === 'USER'){
  //       this.router.navigateByUrl("billDetails")
  //     }else{
  //       this.router.navigateByUrl("user")
  //     }

  //   }
  
  // }
Login(form: any) {
    if((this.userID.startsWith("U") && this.userID.length>0  )  && this.password.length>0 ){
      
      this.LoginService.userLogin(this.userID,this.password).subscribe({
        next:(res:any)=>{
          this.otpDiv= res.uservalid
        },
        error:(err:any)=>{
          this.toasterservice.warning("Please enter valid userID and password")
        }
      })  
    }
    else if(this.userID.length>0 && this.password.length>0){
      this.LoginService.adminLogin(this.userID,this.password).subscribe({
        next:(res:any)=>{
          this.otpDiv= res.userValid;
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
      this.authService.login(res.user.user_type)
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
  
}
