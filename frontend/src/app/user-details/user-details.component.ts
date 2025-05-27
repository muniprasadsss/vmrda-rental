import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/userService/user-service.service';
import { userdetails } from '../interfaces/userdetailsInterfaces/userdetailinterfaces';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { HeaderComponent } from "../header/header.component";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { FooterComponent } from "../footer/footer.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { ChangeRequestService } from '../services/changeRequest/change-request.service';
import { RequestsService ,ChangeField } from '../services/dept-request/dept-request.service';


@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [PrimeNgModule, ReactiveFormsModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit {
  @ViewChild('dt2') dt!: any;

  value: string = '';
  visible: boolean = false;
  position: string = 'center';
  dataSource!: userdetails[];
  initialValue!: userdetails[];
  activityValues: number[] = [0, 100];
  responseMsg: string | undefined;
  userID: any;
  userRole: any;
  addNewForm: FormGroup; // Declare the form group
  showEdit: boolean = false; // For Add New dialog visibility
  editVisible: boolean = false; // For Edit dialog visibility
  editForm!: FormGroup; // Form group for Edit dialog
  selectedUser: any; // Store selected user data
  securityAttachment: any;
  securityattachmentUrl:any = null;
  userPhoto:any;
  userphotoUrl:any=null;



  constructor(
    private router: Router,
    private userdetailsservice: UserServiceService,
    private fb: FormBuilder,
     private toasterservice: ToastrService,
     private Http: ChangeRequestService,
     private deptRequest: RequestsService
    )
  {
    this.addNewForm = this.fb.group({
      username: [null, Validators.required],
      mobileNo: [null, Validators.required],
      natureOfBusiness: [null, Validators.required],
      aadhar: [null, Validators.required],
      pan: [null],
      email_id: [null],
      gstIn: [null],
      remarks: [null],
    });
    this.editForm = this.fb.group({
      editUsername: [null, Validators.required],
      editMobile: [null, Validators.required],
      editBusiness: [null, Validators.required],
      editAadhar: [null, Validators.required],
      editPan: [null],
      editEmail: [null],
      editGstin: [null],
      editRevenue: [null, Validators.required],
      editRemarks: [null],
    });
  }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role')
    this.userID = localStorage.getItem('userId')
    this.getuserdetails()
  }

  getuserdetails() {
    this.userdetailsservice.getUserDetailsByRole(this.userID, this.userRole).subscribe({
      next: (res: any) => {
        this.dataSource = res.userinfo;
        console.log(this.dataSource.length,'0909');
        
        this.responseMsg = res.message;
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

  onFilterGlobal(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.dt.filterGlobal(this.value, 'contains');
  }

  showDialog() {
    this.visible = true;
  }

  // addNewUser() {
  //   this.addNewForm.markAllAsTouched(); // checking all form fields are touched or not
  //   if (this.addNewForm.valid) {
  //     const payload = {
  //       username: this.addNewForm.value.username,
  //       mobileNo: this.addNewForm.value.mobileNo,
  //       aadharNo: this.addNewForm.value.aadhar,
  //       email_id: this.addNewForm.value.email_id,
  //       revenueDivision: null,
  //       natureOfBusiness: this.addNewForm.value.natureOfBusiness,
  //       pan: this.addNewForm.value.pan,
  //       gstIn: this.addNewForm.value.gstIn,
  //       user_image:this.userphotoUrl ,
  //       security_url:this.securityattachmentUrl,
  //       remarks: this.addNewForm.value.remarks
  //     }
  //     this.userdetailsservice.createUser(payload).subscribe({
  //       next: (response: any) => {
  //         this.toasterservice.success('User created successfully');
  //         // Optionally reset the form or show a success message
  //         this.addNewForm.reset();
  //         this.visible = false;
  //         this.editForm.reset();
  //       },
  //       error: (err) => {
  //         console.error('Error creating user:', err);
  //         // Optionally show an error message
  //       }
  //     });
  //   }
  // }

  addNewUser() {
  this.addNewForm.markAllAsTouched(); 
  if (!this.addNewForm.valid) return;

  const formValues = this.addNewForm.value;

  if (this.userRole === 'RI') {
    // Construct change request for RI user
    const changes: { field: string, oldValue: any, newValue: any }[] = [];

    const fieldMap: { [key: string]: string } = {
      username: 'USER_NAME',
      mobileNo: 'MOBILE_NUM',
      natureOfBusiness: 'NATURE_OF_BUSINESS',
      aadhar: 'AADHARNO',
      pan: 'PAN',
      email_id: 'EMAIL_ID',
      gstIn: 'GST_IN',
      remarks: 'remarks'
    };

    for (const formKey in fieldMap) {
      const mappedKey = fieldMap[formKey];
      changes.push({
        field: mappedKey,
        oldValue: null,
        newValue: formValues[formKey]
      });
    }

    const changeRequestPayload = {
      entity_type: 'user_login_table',
      entity_id: null, // Because it's a new user
      requested_by: this.userID,
      changes: changes,
      user_image: this.userphotoUrl,
      security_url: this.securityattachmentUrl
    };

    this.deptRequest.addRequest(changeRequestPayload).subscribe({
      next: () => {
        this.toasterservice.success("User addition request submitted for approval");
        this.addNewForm.reset();
        this.visible = false;
      },
      error: (err) => {
        console.error('Error submitting user addition request:', err);
        this.toasterservice.error("Failed to submit user addition request");
      }
    });

  } else {
    // For non-RI users, proceed with actual creation
    const payload = {
      username: formValues.username,
      mobileNo: formValues.mobileNo,
      aadharNo: formValues.aadhar,
      email_id: formValues.email_id,
      revenueDivision: null,
      natureOfBusiness: formValues.natureOfBusiness,
      pan: formValues.pan,
      gstIn: formValues.gstIn,
      user_image: this.userphotoUrl,
      security_url: this.securityattachmentUrl,
      remarks: formValues.remarks
    };

    this.userdetailsservice.createUser(payload).subscribe({
      next: (response: any) => {
        this.toasterservice.success('User created successfully');
        this.addNewForm.reset();
        this.visible = false;
      },
      error: (err) => {
        console.error('Error creating user:', err);
        this.toasterservice.error('Error creating user');
      }
    });
  }
}


  openEditDialog(user: userdetails) {
    this.selectedUser = user;
    this.editForm.patchValue({
      editUsername: this.selectedUser.USER_NAME,
      editMobile: this.selectedUser.MOBILE_NUM,
      editBusiness: this.selectedUser.NATURE_OF_BUSINESS,
      editAadhar: this.selectedUser.Aadhaar_No,
      editPan: this.selectedUser.PAN,
      editEmail: this.selectedUser.EMAIL_ID,
      editGstin: this.selectedUser.GST_IN,
      editRevenue: this.selectedUser.REVENUE_DIVISION,
      editRemarks:this.selectedUser.remarks
      // Update this field name as per your data
    });
    this.editVisible = true;
  }

updateUser() {
  if (this.editForm.invalid) {
    this.editForm.markAllAsTouched();
    return;
  }
  if (this.userRole === 'RI') {
    // Handle as change request (same as previous code)

    const changes: { field: string, oldValue: any, newValue: any, SL_NO: any }[] = [];
    const formValues = this.editForm.value;
    const orig = this.selectedUser;

const fieldMap: { [key: string]: string } = {
  editUsername: 'USER_NAME',
  editMobile: 'MOBILE_NUM',
  editBusiness: 'NATURE_OF_BUSINESS',
  editAadhar: 'AADHARNO',
  editPan: 'PAN',
  editEmail: 'EMAIL_ID',
  editGstin: 'GST_IN',
  editRevenue: 'REVENUE_DIVISION',
  editRemarks: 'remarks'
};


    for (const formKey in fieldMap) {
      const origKey = fieldMap[formKey];
      if (formValues[formKey] != orig[origKey]) {
        changes.push({
          field: origKey,
          oldValue: orig[origKey],
          newValue: formValues[formKey],
          SL_NO: orig['SL_NO']
        });
      }
    }

    if (changes.length === 0) {
      this.toasterservice.info("No changes detected");
      return;
    }

    const changeRequestPayload = {
      entity_type: 'user_login_table',
      entity_id: orig.USER_ID,
      requested_by: this.userID,
      changes: changes,
      user_image: this.userphotoUrl,
      security_url: this.securityattachmentUrl
    };

    this.deptRequest.addRequest(changeRequestPayload).subscribe({
      next: () => {
        this.toasterservice.success("Change request submitted for approval");
        this.editForm.reset();
        this.editVisible = false;
      },
      error: (err) => {
        console.error('Error submitting change request:', err);
        this.toasterservice.error("Failed to submit change request");
      }
    });

  } else {
    // For non-RI users: update directly as before
    const editFormData = this.editForm.value;
    const payload = {
      user_id: this.selectedUser.USER_ID,
      username: editFormData.editUsername,
      mobileNo: editFormData.editMobile,
      natureOfBusiness: editFormData.editBusiness,
      aadharNo: editFormData.editAadhar,
      pan: editFormData.editPan,
      email_id: editFormData.editEmail,
      gstIn: editFormData.editGstin,
      userType: editFormData.user_type,
      revenueDivision: editFormData.editRevenue,
      user_image: this.userphotoUrl,
      security_url: this.securityattachmentUrl,
      remarks: editFormData.editRemarks
    };

    this.userdetailsservice.editUserDetails(payload).subscribe({
      next: (response: any) => {
        this.toasterservice.success("Updated successfully");
        this.editForm.reset();
        this.editVisible = false;
      },
      error: (err) => {
        console.error('Error updating user:', err);
        this.toasterservice.error("Error updating user");
      },
    });
  }
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

  // This method ensures the input value is always uppercase
  convertToUpperCase(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.toUpperCase();
  }

  validatePanInput(event: KeyboardEvent) {
    const key = event.key;
    if (!/[a-zA-Z0-9]/.test(key) && key !== 'Backspace' && key !== 'Delete') {
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

  closeaddDialog(){
    this.visible=false;
    this.addNewForm.reset();
  }

  closeeditDialog(){
    this.editVisible=false;
    this.editForm.reset();
  }

  downloadExcel(){
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource); // Convert table to sheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); // Append the sheet to the workbook
    XLSX.writeFile(wb, 'tenants-data.xlsx'); // Write the file

  }

  onsecurityattachmentChange(event: any) {
    const files = event.target.files; // Get the list of selected files
    if (files && files.length > 0) { // Check if any file is selected
        const file = files[0]; // Get the first file
        this.securityAttachment = file;
        this.uploadsecurityAttachment(); // Trigger upload function
    } else {
        console.warn('No file selected');
    }
  }

  uploadsecurityAttachment(){
    let fd = new FormData();
    fd.append('image',  this.securityAttachment);
    this.Http.uploadAttachment(fd).subscribe({
      next:(res:any)=>{
        this.securityattachmentUrl = res.location;
        console.log(this.securityattachmentUrl,'securityattachmentUrl');
        this.securityAttachment = null;
      },
      error:(err:any)=>{
      }
    })
  }

  onuserphotoChange(event: any) {
    const files = event.target.files; // Get the list of selected files
    if (files && files.length > 0) { // Check if any file is selected
        const file = files[0]; // Get the first file
        this.userPhoto = file;
        this.uploaduserPhoto(); // Trigger upload function
    } else {
        console.warn('No file selected');
    }
  }

  uploaduserPhoto(){
    let fd = new FormData();
    fd.append('image',  this.userPhoto);
    this.Http.uploadAttachment(fd).subscribe({
      next:(res:any)=>{
        this.userphotoUrl = res.location;
        console.log(this.userphotoUrl,'userphotoUrl');
        this.userPhoto = null;
      },
      error:(err:any)=>{
      }
    })
  }

  downloaduserImage(url: string) {
    if (url) {
      // Open the S3 URL in a new tab
      window.open(url, '_blank');
    } else {
      console.error('No attachment URL provided');
    }
  }

  downloadsecurityAttachment(url: string) {
    if (url) {
      // Open the S3 URL in a new tab
      window.open(url, '_blank');
    } else {
      console.error('No attachment URL provided');
    }
  }

}
