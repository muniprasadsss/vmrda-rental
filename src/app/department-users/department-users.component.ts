import { Component, ViewChild } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { DepartmentUsersService } from '../services/departmentUsers/department-users.service';
import { departmentusers } from '../interfaces/departmentUserInterfaces/departmentuserinterfaces';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

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
  selectedUser: departmentusers | null = null;

  constructor(private admindetailsservice: DepartmentUsersService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      user_id: [''],
      username: [''],
      mobileNo: [''],
      email_id: [''],
      userType: [''],
      password: [''],
      revenueDivision: [''],
      natureOfBusiness: [''],
      idNo: [''],
      pan: [''],
      gstIn: ['']
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

  showEditDialog(sl_no: any) {
    this.editVisible = true;
    this.getAdminDetailsbySno(sl_no);
  }

  updateUser() {
    if (this.selectedUser) {
      // Logic for updating user details
    }
    this.editVisible = false;
  }

  getAdminDetailsbySno(sl_no: number) {
    this.admindetailsservice.getUserBySlNo(sl_no).subscribe({
      next: (res: any) => {
        if (res) {
          this.selectedUser = res;
          this.form.patchValue(res); // Update form values with the selected user's data
        }
      },
      error: (err: any) => {
        this.responseMsg = err.error?.message || 'Error fetching user details';
      }
    });
  }
}
