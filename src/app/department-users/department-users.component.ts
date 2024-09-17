import { Component, ViewChild } from '@angular/core';
import { departmentusers } from '../interfaces/departmentUserInterfaces/departmentuserinterfaces';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DepartmentUsersService } from '../services/departmentUsers/department-users.service';

@Component({
  selector: 'app-department-users',
  standalone: true,
  imports: [PrimeNgModule, FormsModule, ReactiveFormsModule],
  templateUrl: './department-users.component.html',
  styleUrls: ['./department-users.component.scss']
})
export class DepartmentUsersComponent {
  @ViewChild('dt2') dt!: any;
  value: string = '';
  formData = {
    username: '',
    mobile: '',
    business: '',
    aadhar: '',
    pan: '',
    email: '',
    gstin: '',
    revenue: ''
  };
  selectedUser: departmentusers | null = null;
  dataSource!: departmentusers[];
  responseMsg: string | undefined;
  visible: boolean = false;
  editVisible: boolean = false;

  constructor(private admindetailsservice: DepartmentUsersService) {}

  ngOnInit(): void {
    this.getadminInfo();
  }

  getadminInfo() {
    this.admindetailsservice.getAdminDetails().subscribe({
      next: (res: any) => {
        this.dataSource = Object.keys(res).map(key => ({ ...res[key] }));
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

  showAddDialog() {
    this.visible = true;
  }

  saveUser() {
    // Logic for saving a new user
    this.visible = false;
  }

  showEditDialog(user: departmentusers) {
    this.selectedUser = { ...user };
    this.editVisible = true;
  }

  updateUser() {
   
  }
}
