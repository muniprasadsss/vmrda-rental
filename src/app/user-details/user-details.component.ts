import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/userService/user-service.service';
import { userdetails } from '../interfaces/userdetailsInterfaces/userdetailinterfaces';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { HeaderComponent } from "../header/header.component";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { FooterComponent } from "../footer/footer.component";
import { FormBuilder, FormGroup, ReactiveFormsModule ,Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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
  selectedUser: any ; // Store selected user data



  constructor(private router:Router,private userdetailsservice:UserServiceService, private fb: FormBuilder,
    private toasterservice:ToastrService
  ){
    this.addNewForm = this.fb.group({
      username: [''],
      // mobileNo: [''],
       mobileNo: [''],
      natureOfBusiness: [''],
      aadhar: [''],
      pan: [''],
      email_id: [''],
      gstIn: [''],
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



        addNewUser() {
      if (this.addNewForm.valid) {
        this.userdetailsservice.createUser(this.addNewForm.value).subscribe({
          next: (response: any) => {
            this.toasterservice.success('User created successfully');
            // Optionally reset the form or show a success message
            this.addNewForm.reset();
            this.visible=false;
          },
          error: (err) => {
            console.error('Error creating user:', err);
            // Optionally show an error message
          }
        });
      }
        }

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
          const editFormData=this.editForm.value
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

          if (this.editForm.valid) {
            this.userdetailsservice.editUserDetails(payload).subscribe({
              next: (response: any) => {

                this.toasterservice.success("Updated successful")
                // Optionally reset the form or show a success message
                this.editForm.reset();
                this.editVisible = false; // Close the edit dialog
              },
              error: (err) => {
                console.error('Error updating user:', err);
                this.toasterservice.error("Error updating user")
                // Optionally show an error message
              }
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
