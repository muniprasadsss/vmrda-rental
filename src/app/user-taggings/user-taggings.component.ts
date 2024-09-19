import { Component, OnInit } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { HeaderComponent } from '../header/header.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FooterComponent } from '../footer/footer.component';
import { ToastrService } from 'ngx-toastr';
import { UserTaggingService } from '../services/userTagging/user-tagging.service';
import { usertagging } from '../interfaces/userTagging/usertagginginterface';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

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


  constructor(
    private toasterservice: ToastrService,
    private usertaggingservice: UserTaggingService,
    private datepipe: DatePipe,
    private fb: FormBuilder
  ) {
    this.addNewForm = this.fb.group({
      username: [''],
      userId: [''],
      property: [''],
      startdate: [''],
      enddate: ['']
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

  addNewUser() {
    if (this.addNewForm.valid) {
      // Print form data to console
      console.log("Form Data:", this.addNewForm.value);
      
      // Here you can implement further logic (e.g., call a service to save the data)

      // Optionally, close the dialog
      this.visible = false;
    } else {
      console.log("Form is invalid");
    }
  }
  
  editUser(lease: usertagging) {
    // Populate the form with the selected user's data
    this.addNewForm.patchValue({
      username: lease.User_Name,
      userId: lease.User_ID,
      property: lease.Property,
      startdate: lease.Start_Date,
      enddate: lease.End_Date
    });
    this.editVisible = true; // Show the edit dialog
  }

  updateUser() {
    if (this.addNewForm.valid) {
      // Print the form values to the console
      console.log("Updated Form Data:", this.addNewForm.value);
      
      // Here you can implement further logic (e.g., call a service to update the data)
      
      // Optionally, close the dialog
      this.editVisible = false; 
    } else {
      console.log("Form is invalid");
    }
  }
  
  
}
