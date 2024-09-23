import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthGuardsService } from '../services/authGuards/auth-guards.service';
import { ProfileSettingsService } from '../services/profileSettings/profile-settings.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [PrimeNgModule, FormsModule,ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userType: any;
  dropdownDiv: boolean = false;
  items: any | undefined;
  userdetails: any;
  viewProfileDialog: boolean = false; // For viewing profile dialog
  changePasswordDialog: boolean = false; // For changing password dialog
  profileForm: FormGroup;
  passwordform: FormGroup;

  // formData: any = {
  //   USER_ID: "",
  //   USER_NAME: "",
  //   MOBILE_NUM: "",
  //   EMAIL_ID: "",
  //   user_type: "",
  //   Revenue_Division:"",
  //   gst_in:"",
  //   aadhar_no:"",
  //   pan_no:"",
  //   nature_of_bussiness:"",
  // };


  constructor(private router: Router, private authService: AuthGuardsService,private fb: FormBuilder,private profileService:ProfileSettingsService) {
    this.profileForm = this.fb.group({
      USER_ID: [{ value: '' }, Validators.required],
      USER_NAME: [{ value: '' }, Validators.required],
      USER_TYPE: [{ value: '', disabled: true }, Validators.required],
      REVENUE_DIVISION: [{ value: '', disabled: true }, Validators.required],
      EMAIL_ID: [{ value: '' }, [Validators.required, Validators.email]],
      MOBILE_NUM: [{ value: '' }, Validators.required],
      AADHARNO: [{ value: '', disabled: true }, Validators.required],
      GST_IN: [{ value: '', disabled: true }, Validators.required],
      PAN: [{ value: '', disabled: true }, Validators.required],
      NATURE_OF_BUSINESS: [{ value: '', disabled: true }, Validators.required],
      // password: [{ value: '' }, Validators.required],
      // confirmPassword: [{ value: '' }, Validators.required],
      // Add more fields as necessary
    });
    this.passwordform = this.fb.group({
      Password: [{ value: '' }, Validators.required],
      ChangePassword: [{ value: '' }, Validators.required],
      // password: [{ value: '' }, Validators.required],
      // confirmPassword: [{ value: '' }, Validators.required],
      // Add more fields as necessary
    });
  }

  ngOnInit(): void {
    this.items = [
      {
        items: [
          {
            label: 'View Profile',
            icon: 'pi pi-eye',
            command: () => this.showViewProfileDialog(),
          },
          {
            label: 'Change Password',
            icon: 'pi pi-key',
            command: () => this.showChangePasswordDialog(),
          },
          {
            label: 'Log Out',
            icon: 'pi pi-sign-out',
            command: () => this.logOut(),
          }
        ]
      }
    ];
    this.passwordform = this.fb.group({
      Password: [{ value: '' }, Validators.required],
      ChangePassword: [{ value: '' }, Validators.required],
      // password: [{ value: '' }, Validators.required],
      // confirmPassword: [{ value: '' }, Validators.required],
      // Add more fields as necessary
    });
    
    this.userType = localStorage.getItem("userId");
    this.userdetails=localStorage.getItem("userInfo")

    // Load user profile data from localStorage
    const userInfo = localStorage.getItem("userInfo");
    console.log(userInfo,"userinfo...");
    if (userInfo) {
      const userDetails = JSON.parse(userInfo);
      this.profileForm.patchValue({
        USER_NAME: userDetails.USER_NAME ,
        USER_ID: userDetails.USER_ID ,
        USER_TYPE: userDetails.user_type ,
        REVENUE_DIVISION: userDetails.REVENUE_DIVISION ,
        EMAIL_ID: userDetails.EMAIL_ID ,
        MOBILE_NUM: userDetails.MOBILE_NUM ,
        AADHARNO: userDetails.AADHARNO ,
        GST_IN: userDetails.GST_IN ,
        PAN: userDetails.PAN ,
        NATURE_OF_BUSINESS: userDetails.NATURE_OF_BUSINESS ,
        // password: userDetails.Password ,
      });
    }
  }

  showViewProfileDialog() {
    this.viewProfileDialog = true; // Show profile dialog
  }

  showChangePasswordDialog() {
    this.changePasswordDialog = true; // Show change password dialog
  }

  logOut() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

  // saveData(){
  //     const formData = this.profileForm.value; // Get form data
  //     console.log(formData,"form data check...");
  //     console.log(formData,"save data check");
  //   this.viewProfileDialog = false; // Show profile dialog
  // }

  saveData() {
    if (this.profileForm.valid) {
      const formData = this.profileForm.value; // Get form data
      console.log(formData, "form data check...");
      this.profileService.updateProfile(formData).subscribe(
        response => {
          console.log('Profile updated successfully:', response);
          this.viewProfileDialog = false; // Close the dialog
        },
        error => {
          console.error('Error updating profile:', error);
        }
      );
    } else {
      console.log('Form is not valid');
    }
  }
}
