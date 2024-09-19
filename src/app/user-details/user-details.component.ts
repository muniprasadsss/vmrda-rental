import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/userService/user-service.service';
import { userdetails } from '../interfaces/userdetailsInterfaces/userdetailinterfaces';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { HeaderComponent } from "../header/header.component";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { FooterComponent } from "../footer/footer.component";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [PrimeNgModule, HeaderComponent, DashboardComponent, FooterComponent,ReactiveFormsModule],
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
  selectedUser: userdetails | null = null; // Store selected user data

  

  constructor(private router:Router,private userdetailsservice:UserServiceService, private fb: FormBuilder){
    this.addNewForm = this.fb.group({
      username: [''],
      mobile: [''],
      business: [''],
      aadhar: [''],
      pan: [''],
      email: [''],
      gstin: [''],
      revenue: ['']
    });
    this.editForm = this.fb.group({
      editUsername: [''],
      editMobile: [''],
      editBusiness: [''],
      editAadhar: [''],
      editPan: [''],
      editEmail: [''],
      editGstin: [''],
      editRevenue: ['']
    });
  }
      ngOnInit(): void {
        this.userRole = localStorage.getItem('role')
        this.userID = localStorage.getItem('userId')
        this.getuserdetails()
      }

        getuserdetails() {
          this.userdetailsservice.getUserDetailsByRole(this.userID,this.userRole).subscribe({
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

    // addNewUser() {
    //   if (this.addNewForm.valid) {
    //     const formData = this.addNewForm.value; // Get the form data
    //     // Call your API to save the data
    //     console.log('Add New User Form Data:', formData);
    //     // Close the dialog
    //     this.visible = false;
    //   }
    // }

    addNewUser() {
      if (this.addNewForm.valid) {
        this.userdetailsservice.createUser(this.addNewForm.value).subscribe({
          next: (response: any) => {
            console.log('User created successfully:', response);
            // Optionally reset the form or show a success message
            this.addNewForm.reset();
          },
          error: (err) => {
            console.error('Error creating user:', err);
            // Optionally show an error message
          }
        });
      }
    }

    openEditDialog(user: userdetails) {
      console.log('Selected User:', user); // Debugging line

      this.selectedUser = user;
      this.editForm.patchValue({
        editUsername: user.USER_NAME,
        editMobile: user.MOBILE_NUM,
        editBusiness: user.NATURE_OF_BUSINESS,
        editAadhar: user.Aadhaar_No,
        editPan: user.PAN,
        editEmail: user.EMAIL_ID,
        editGstin: user.GST_IN,
        editRevenue: user.REVENUE_DIVISION // Update this field name as per your data
      });
      this.editVisible = true;
    }
    updateUser(){
      
    }
  
}
