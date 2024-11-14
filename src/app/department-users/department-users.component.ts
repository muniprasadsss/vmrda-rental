import { Component, ViewChild } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { DepartmentUsersService } from '../services/departmentUsers/department-users.service';
import { departmentusers } from '../interfaces/departmentUserInterfaces/departmentuserinterfaces';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-department-users',
  standalone: true,
  imports: [PrimeNgModule, FormsModule, ReactiveFormsModule],
  templateUrl: './department-users.component.html',
  styleUrls: ['./department-users.component.scss']
})
export class DepartmentUsersComponent {
  @ViewChild('dt2') dt!: any;

  dataSource!: departmentusers[];
  responseMsg: string | undefined;
  visible: boolean = false;
  editVisible: boolean = false;
  form!: FormGroup;
  editForm!: FormGroup;
  selectedUser: departmentusers | null = null;

  constructor(private admindetailsservice: DepartmentUsersService, private fb: FormBuilder) {}

  ngOnInit(): void {

    this.form = this.fb.group({
      user_id: ['',Validators.required],
      username: ['',Validators.required],
      mobileNo: ['',Validators.required],
      email_id: ['',Validators.required,Validators.email],
      userType: ['',Validators.required],
      password: ['',Validators.required],
      revenueDivision: ['',Validators.required],
    });

    this.editForm = this.fb.group({
      USER_ID: [''],
      editUserName: [{ value: '', disabled: true }],
      MOBILE_NUM: [''],
      user_type: [''],
      REVENUE_DIVISION: [''],
    });

    this.getadminInfo();
  }

  getadminInfo() {
    this.admindetailsservice.getAdminDetails().subscribe({
      next: (res: any) => {
        this.dataSource = Object.keys(res).map(key => ({ ...res[key] }));
        this.responseMsg = res.message;
      },
      error: (err: any) => {
        this.responseMsg = err.error?.message || 'Error';
      }
    });
  }

  onFilterGlobal(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.dt.filterGlobal(target.value, 'contains');
  }

  showAddDialog() {
    this.form.reset();
    this.visible = true;
  }

  saveUser() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.admindetailsservice.createAdmin(this.form.value).subscribe({
        next: (res: any) => {
          this.getadminInfo(); // Refresh the table data
          this.visible = false; // Close the dialog
        },
        error: (err: any) => {
          console.error("Error saving user", err);
        }
      });
    }
  }

  showEditDialog(customer: any) {
    this.editVisible = true;
    this.editForm.patchValue({
      USER_ID: customer.USER_ID,
      editUserName: customer.USER_NAME,
      MOBILE_NUM: customer.MOBILE_NUM,
      user_type: customer.USER_TYPE,
      REVENUE_DIVISION: customer.REVENUE_DIVISION,
    })

  }

  updateUser() {
    if (this.editForm.valid) {
      const updatedUser = this.editForm.value;
      // console.log("Updated User Data:", updatedUser);
      this.admindetailsservice.updateAdmin(updatedUser).subscribe({
        next: (res: any) => {
          this.getadminInfo(); // Refresh the table data
          this.editVisible = false; // Close the dialog
        },
        error: (err: any) => {
          console.error("Error updating user", err);
        }
      });
    }
    this.editVisible = false;
  }

  getAdminDetailsbySno(sl_no: number) {
    this.admindetailsservice.getUserBySlNo(sl_no).subscribe({
      next: (res: any) => {
        if (res) {
          this.selectedUser = res;
          this.editForm.patchValue(res); // Update form values with the selected user's data
        }
      },
      error: (err: any) => {
        this.responseMsg = err.error?.message || 'Error fetching user details';
      }
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

  validatePanInput(event: KeyboardEvent) {
  const key = event.key;
  if (!/[A-Z0-9]/.test(key) && key !== 'Backspace' && key !== 'Delete') {
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

}
