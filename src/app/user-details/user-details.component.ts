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

  constructor(private router: Router, private userdetailsservice: UserServiceService,
              private fb: FormBuilder, private toasterservice: ToastrService)
  {
    this.addNewForm = this.fb.group({
      username: [null, Validators.required],
      mobileNo: [null, Validators.required],
      natureOfBusiness: [null, Validators.required],
      aadhar: [null, Validators.required],
      pan: [null],
      email_id: [null],
      gstIn: [null],
    });
    this.editForm = this.fb.group({
      editUsername: [null, Validators.required],
      editMobile: [null, Validators.required],
      editBusiness: [null, Validators.required],
      editAadhar: [null, Validators.required],
      editPan: [null],
      editEmail: [null],
      editGstin: [null],
      editRevenue: [null, Validators.required]
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

  addNewUser() {
    this.addNewForm.markAllAsTouched(); // checking all form fields are touched or not
    if (this.addNewForm.valid) {
      const payload = {
        username: this.addNewForm.value.username,
        mobileNo: this.addNewForm.value.mobileNo,
        aadharNo: this.addNewForm.value.aadhar,
        email_id: this.addNewForm.value.email_id,
        revenueDivision: null,
        natureOfBusiness: this.addNewForm.value.natureOfBusiness,
        pan: this.addNewForm.value.pan,
        gstIn: this.addNewForm.value.gstIn
      }
      this.userdetailsservice.createUser(payload).subscribe({
        next: (response: any) => {
          this.toasterservice.success('User created successfully');
          // Optionally reset the form or show a success message
          this.addNewForm.reset();
          this.visible = false;
          this.editForm.reset();
        },
        error: (err) => {
          console.error('Error creating user:', err);
          // Optionally show an error message
        }
      });
    }
  }

  // closeEditForm (){
  //   this.editVisible = false;
  //   this.editForm.reset();
  // }

  openEditDialog(user: userdetails) {
    this.selectedUser = user;
    this.editForm.patchValue({
      editUsername: user.USER_NAME,
      editMobile: user.MOBILE_NUM,
      editBusiness: user.NATURE_OF_BUSINESS,
      editAadhar: user.Aadhaar_No,
      editPan: user.PAN,
      editEmail: user.EMAIL_ID,
      editGstin: user.GST_IN,
      editRevenue: user.REVENUE_DIVISION
      // Update this field name as per your data
    });
    this.editVisible = true;
  }

  updateUser() {
    if (this.editForm.invalid) {
      // Mark all controls as touched to trigger validation messages
      this.editForm.markAllAsTouched();
      return; // Stop execution as the form is invalid
    }
  
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
    };
  
    this.userdetailsservice.editUserDetails(payload).subscribe({
      next: (response: any) => {
        this.toasterservice.success("Updated successfully");
        this.editForm.reset();
        this.editVisible = false; // Close the edit dialog
      },
      error: (err) => {
        console.error('Error updating user:', err);
        this.toasterservice.error("Error updating user");
      },
    });
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

  toUpperCase(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
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

}
