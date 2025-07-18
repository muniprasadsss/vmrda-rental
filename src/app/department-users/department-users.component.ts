import { Component, ViewChild } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { DepartmentUsersService } from '../services/departmentUsers/department-users.service';
import { departmentusers } from '../interfaces/departmentUserInterfaces/departmentuserinterfaces';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { AuthGuardsService } from '../services/authGuards/auth-guards.service';


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
  userRole: string| null = '';
  userTypes: [] = [];

  constructor(
    private admindetailsservice: DepartmentUsersService,
     private fb: FormBuilder,
     private toastrService : ToastrService,
      private authService: AuthGuardsService
    ) {}

  ngOnInit(): void {
    this.userRole = this.authService.user_Role
    this.form = this.fb.group({
      user_id: [null,Validators.required],
      username: [null,Validators.required],
      mobileNo: [null,Validators.required],
      email_id: [null,Validators.email],
      userType: [null,Validators.required],
      password: [null,Validators.required],
      revenueDivision: [null,Validators.required],
    });

    this.editForm = this.fb.group({
      USER_ID: [{ value: null, disabled: true }],
      editUserName: [{ value: null, disabled: true }],
      MOBILE_NUM: [null],
      user_type: [null],
      REVENUE_DIVISION: [null],
    });

    this.getadminInfo();
  }

  getadminInfo() {
    this.admindetailsservice.getAdminDetails().subscribe({
      next: (res: any) => {
        this.dataSource = res.deptUserList;
        this.userTypes = res.userTypesResult;
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
      const encryptedPassword = this.authService.encryptPassword(this.form.value.password);
      this.form.patchValue({ password: encryptedPassword }); // Encrypt password before sending
      this.admindetailsservice.createAdmin(this.form.value).subscribe({
        next: (res: any) => {
          this.getadminInfo(); // Refresh the table data
          this.visible = false; // Close the dialog
          this.toastrService.success(res.message)
        },
        error: (err: any) => {
          this.toastrService.error(err.message)
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
      user_type: customer.user_type,
      REVENUE_DIVISION: customer.REVENUE_DIVISION,
    })

    this.getAdminDetailsbySno(customer.SL_NO);
    // this.form = this.fb.group({
    //   user_id: [''],
    //   username: [''],
    //   mobileNo: [''],
    //   userType: [''],
    // });
  }

  updateUser() {
    if (this.editForm.valid) {
      const updatedUser = this.editForm.value;
      const payload={
         MOBILE_NUM :this.editForm.value.MOBILE_NUM,
         user_type :this.editForm.value.user_type,
         REVENUE_DIVISION :this.editForm.value.REVENUE_DIVISION,
         USER_ID :this.editForm.get('USER_ID')?.value
      }
      this.admindetailsservice.updateAdmin(payload).subscribe({
        next: (res: any) => {
          this.getadminInfo(); // Refresh the table data
          this.editVisible = false; // Close the dialog
          this.toastrService.success(res.message)
        },
        error: (err: any) => {
          this.toastrService.error(err.message)
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

  closeaddDialog(){
    this.visible=false;
    this.form.reset();
  }

  closeeditDialog(){
    this.editVisible=false;
    this.editForm.reset();
  }

  downloadExcel(){
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource); // Convert table to sheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); // Append the sheet to the workbook
    XLSX.writeFile(wb, 'departmentusers-data.xlsx'); // Write the file

  }

}
