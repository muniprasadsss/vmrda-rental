import { Component, OnInit } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { HeaderComponent } from '../header/header.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FooterComponent } from '../footer/footer.component';
import { ToastrService } from 'ngx-toastr';
import { UserTaggingService } from '../services/userTagging/user-tagging.service';
import { usertagging } from '../interfaces/userTagging/usertagginginterface';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-taggings',
  standalone: true,
  imports: [PrimeNgModule, HeaderComponent, DashboardComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './user-taggings.component.html',
  styleUrls: ['./user-taggings.component.scss'],
  providers: [DatePipe]
})
export class UserTaggingsComponent implements OnInit {
  visible: boolean = false;
  responseMsg: string | undefined;
  dataSource: usertagging[] = [];
  userID: any;
  userRole: any;
  addNewForm!: FormGroup;
  editVisible: boolean = false; // For the edit dialog
  editForm: any;


  constructor(
    private toasterservice: ToastrService,
    private usertaggingservice: UserTaggingService,
    private datepipe: DatePipe,
    private fb: FormBuilder
  ) {
    this.addNewForm = this.fb.group({
      username: [''],
      user_id: [''],
      property: [''],
      start_date: [''],
      end_date: ['']
    });
    this.editForm = this.fb.group({
      username: ['', Validators.required],
      user_id: ['', Validators.required],
      property: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role');
    this.userID = localStorage.getItem('userId');
    this.getUserTaggingDetails();
  }

  getUserTaggingDetails() {
    this.usertaggingservice.getUserTagging(this.userID, this.userRole).subscribe({
      next: (res: any) => {
        this.dataSource = res.userData;
        this.responseMsg = res.message;
        console.log(this.dataSource, "usertagging data...");
      },
      error: (err: any) => {
        this.responseMsg = err.error?.message || "Error";
      }
    });
  }

  showDialog() {
    this.visible = true;
  }

// In user-taggings.component.ts
addNewUser() {
  if (this.addNewForm.valid) {
    // Print form data to console
    console.log("Form Data:", this.addNewForm.value);
    
    this.usertaggingservice.createUserTagging(this.addNewForm.value).subscribe({
      next: (res) => {
        this.toasterservice.success("User added successfully");
        this.visible = false; // Close the dialog
        this.getUserTaggingDetails(); // Refresh data
      },
      error: (err) => {
        this.toasterservice.error(err.error?.message || "Error adding user");
      }
    });
  } else {
    console.log("Add New Form is invalid");
  }
}


  formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  }
  
  editUser(lease: usertagging) {
    const startDate = this.formatDate(lease.START_DATE);
  const endDate = this.formatDate(lease.END_DATE);
    // Populate the form with the selected user's data
    console.log(lease,"check ,.,.");
    console.log(lease.USER_ID,"userid check...");
    
    
    this.editForm.patchValue({
      username: lease.USER_NAME,
      user_id: lease.USER_ID,
      property: lease.PROPERTY,
      start_date: startDate,
      end_date: endDate
    });
    this.editVisible = true; // Show the edit dialog
  }

// In user-taggings.component.ts
updateUser() {
  if (this.editForm.valid) {
    // Print the form values to the console
    console.log("Updated Form Data:", this.editForm.value);
    
    // Call the service to update the user tagging
    this.usertaggingservice.editUserTagging(this.editForm.value).subscribe({
      next: (res) => {
        this.toasterservice.success("User updated successfully");
        this.editVisible = false; // Close the edit dialog
        this.getUserTaggingDetails(); // Refresh data
      },
      error: (err) => {
        this.toasterservice.error(err.error?.message || "Error updating user");
      }
    });
  } else {
    console.log("Edit form is invalid");
  }
}
    
}
