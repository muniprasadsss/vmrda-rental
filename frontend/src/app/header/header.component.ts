import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthGuardsService } from '../services/authGuards/auth-guards.service';
import { ProfileSettingsService } from '../services/profileSettings/profile-settings.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [PrimeNgModule, FormsModule,ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  visible:boolean =false;
  userType: any;
  localStoragePassword: any;
  dropdownDiv: boolean = false;
  items: any | undefined;
  userdetails: any;
  notifications: any;
  viewProfileDialog: boolean = false; // For viewing profile dialog
  changePasswordDialog: boolean = false; // For changing password dialog
  profileForm: FormGroup;
  passwordform: FormGroup;
  responseMsg: string | undefined;
  dataSource:any;
  showPassword: boolean = false;


  constructor(private router: Router,
     private authService: AuthGuardsService,
     private fb: FormBuilder,
     private profileService:ProfileSettingsService,
     private toasterservice:ToastrService) {
    this.profileForm = this.fb.group({
      USER_ID: [{ value: '',disabled : true }],
      USER_NAME: [{ value: '',disabled: true }],
      USER_TYPE: [{ value: '', disabled: true }],
      REVENUE_DIVISION: [{ value: '', disabled: true }],
      EMAIL_ID: [{ value: '' }, [Validators.required, Validators.email]],
      MOBILE_NUM: [{ value: '' }, Validators.required],
      AADHARNO: [{ value: '', disabled: true }],
      GST_IN: [{ value: '', disabled: true }],
      PAN: [{ value: '', disabled: true }],
      NATURE_OF_BUSINESS: [{ value: '', disabled: true }],
    });
    this.passwordform = this.fb.group({
      oldPassword: [null,Validators.required],
      newPassword: [null,Validators.required],
      ConfirmnewPassword: [null,Validators.required],
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
    this.userType = localStorage.getItem("userId");
    this.userdetails=localStorage.getItem("userInfo");
    this.localStoragePassword = JSON.parse(this.userdetails);
    console.log(this.userType);
  
    // Load user profile data from localStorage
 
    if (this.userdetails) {
      const userDetails = JSON.parse(this.userdetails);
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
      this.getNotifications(userDetails);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
  showNotificationDialog() {
    this.visible = true;
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

  // saveData() {
  //   if (this.profileForm.valid) {
  //     const formData = { ...this.profileForm.getRawValue()};
  //     const payload= {
  //       USER_NAME:formData.USER_NAME,
  //       MOBILE_NUM:formData.MOBILE_NUM,
  //       EMAIL_ID:formData.EMAIL_ID,
  //       USER_ID:formData.USER_ID,
  //     }
  //     this.profileService.updateProfile(payload).subscribe(
  //       response => {
  //         this.viewProfileDialog = false; // Close the dialog
  //       },
  //       error => {
  //         console.error('Error updating profile:', error);
  //       }
  //     );
  //   } else {
  //   }
  // }

  saveData() {
    if (this.profileForm.valid) {
      const formData = { ...this.profileForm.getRawValue() };
      const payload = {
        USER_NAME: formData.USER_NAME,
        MOBILE_NUM: formData.MOBILE_NUM,
        EMAIL_ID: formData.EMAIL_ID,
        USER_ID: formData.USER_ID,
        userType:formData.USER_TYPE
      };
      
      this.profileService.updateProfile(payload).subscribe(
        response => {
          // Assuming 'response' contains the updated user data
          localStorage.setItem('userInfo', JSON.stringify(response)); // Update local storage
          
          this.viewProfileDialog = false; // Close the dialog
          this.toasterservice.success('Profile updated successfully!'); // Show success message
        },
        error => {
          console.error('Error updating profile:', error);
          this.toasterservice.error('Error updating profile. Please try again.'); // Show error message
        }
      );
    } else {
      this.toasterservice.warning('Please fill in all required fields');
    }
  }
  

  editPassword() {
    const PasswordinLocal = this.localStoragePassword.Password; // Assume this holds the stored password
    if (this.passwordform.valid) {
      const passwordData = this.passwordform.value; // Get form data
      const old_password = passwordData.oldPassword;
      const new_password = passwordData.newPassword;
      const confirm_new_password = passwordData.ConfirmnewPassword;
  
      if (old_password === PasswordinLocal) {
        if (new_password === confirm_new_password && new_password !== PasswordinLocal) {
          const senddata = {
            old_password,
            new_password,
            USER_ID: this.localStoragePassword.USER_ID,
            UserType: this.localStoragePassword.user_type 
          };
  
          console.log(senddata, "data to send...");
          // API Call
          this.profileService.changePassword(senddata).subscribe(
            response => {
              console.log('Password changed successfully:', response);
              this.toasterservice.success('Password changed successfully!'); 
              // Update the password in local storage
              this.localStoragePassword.Password = new_password;
              // Save updated userInfo back to local storage
              localStorage.setItem('userInfo', JSON.stringify(this.localStoragePassword));
              this.changePasswordDialog = false; 
              this.passwordform.reset(); 
            },
            error => {
              console.error('Error changing password:', error);
              this.toasterservice.error('Error changing password. Please try again.'); // Show error message
            }
          );
        } else {
          this.toasterservice.error("New passwords do not match");
        }
      } else {
        this.toasterservice.error("Old password is incorrect");
      }
    } else {
      this.toasterservice.warning("Please fill in all required fields");
    }
  }

  getNotifications(userdetails :any) {
    const payload={
      user_id: userdetails.USER_ID,
      revenue_division: userdetails.REVENUE_DIVISION,
      user_type: userdetails.user_type
    }
    this.dataSource = [];
    this.profileService.getNotificationsResponse(payload).subscribe({
      next: (res: any) => {
        console.log(res.data,"response check...");
        this.dataSource = res.data;
        this.responseMsg = res.message;
      },
      error: (err: any) => {
        this.responseMsg = err.error?.message || "Error";
      }
    });
  }

  // Clear notifications automatically after viewed

  closeNotificationDialog() {
    this.visible = false;
    
  }

  deleteNotification(id: any) {
    let payload = {
      Id : id
    }
    this.profileService.clearNotification(payload).subscribe({
      next:(res:any)=>{
        this.dataSource = this.dataSource.filter((item: any) => item.ID !== id);
        this.toasterservice.success("Notifications cleared successfully")
      },
      error:(err:any)=>{
        this.toasterservice.error(err.error?.message || "Error clearing notification");
      }
    })

  }

  clearAllNotifications() {
    let payload = {
      UserId : this.userType
    }
    this.profileService.clearAllNotifications(payload).subscribe({
      next:(res:any)=>{
        this.dataSource = [];   // Clear all notifications
        this.toasterservice.success("Notifications cleared successfully")
        this.visible=false;
      },
      error:(err:any)=>{
        this.toasterservice.success(err)
      }
    })

  }

  navigateToUrl() {
    window.open("http://vmrda.gov.in/", "_blank"); // Open in a new tab
  }

  limitInputLength(event: KeyboardEvent, maxLength: number): void {
    const inputElement = event.target as HTMLInputElement;
  
    if (inputElement.value.length >= maxLength && event.key !== 'Backspace' && event.key !== 'Delete') {
      event.preventDefault();
    }
  }
  
  validateNumericInput(event: KeyboardEvent) {
    const key = event.key;
    if (!/[0-9]/.test(key) && key !== 'Backspace' && key !== 'Delete') {
      event.preventDefault();
    }
  }

  validateEmailInput(event: KeyboardEvent): void {
    const key = event.key;
    // Allow letters, numbers, special characters typically used in emails
    const allowedKeys = /[a-zA-Z0-9@._-]/;
  
    // Allow Backspace, Delete, and Tab keys for usability
    if (!allowedKeys.test(key) && key !== 'Backspace' && key !== 'Delete' && key !== 'Tab') {
      event.preventDefault();
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

  closeChangePasswordDialog() {
    this.changePasswordDialog = false;
    this.passwordform.reset();
  }

  closepassworddialog(){
    this.changePasswordDialog=false;
    this.passwordform.reset();
  }
  
}
