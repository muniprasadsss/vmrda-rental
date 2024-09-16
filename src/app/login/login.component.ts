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
  
}
