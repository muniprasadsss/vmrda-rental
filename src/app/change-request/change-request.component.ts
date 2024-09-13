import { Component } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { FooterComponent } from "../footer/footer.component";
import { ChangeRequestService } from '../services/changeRequest/change-request.service';
import { ChangedFields, Payload } from '../interfaces/changeRequest/changeRequest';
import { ToastrService } from 'ngx-toastr';
import { DummyUserService } from '../services/dummyUser/dummy-user.service';

@Component({
  selector: 'app-change-request',
  standalone: true,
  imports: [PrimeNgModule, FormsModule, HeaderComponent, DashboardComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './change-request.component.html',
  styleUrl: './change-request.component.scss'
})
export class ChangeRequestComponent {

  visible: boolean = false;
  isDialogVisible: boolean = false;
  isApprovedClicked: boolean = true;
  isRejectClicked: boolean = false;
  isPendingClicked: boolean = false;
  activeButton: string = 'approved'; // Track active button
  crData!: ChangedFields[];
  remarks!: string;
  user: any;
  data: any[] = [];
  userType: string | null = null; // Role of the user fetched from localStorage
  action:string = ''
  payload!: Payload| Object;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private crHttp: ChangeRequestService,
    private toasterservice: ToastrService,
    private dummyUserService: DummyUserService
  ) {}

  ngOnInit() {
    this.getcrInfo();
    this.getUserData();
    this.userType = localStorage.getItem("userType"); // Fetching userType from localStorage
    console.log(this.userType, "usertype check...");
  }

  getcrInfo() {
    this.crHttp.getChangeRequestData().subscribe({
      next: (res: any) => {
        this.crData = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  

  changeStatus( crno: any, request_type: any, status: any, stage:any ,action:any) {
    
    this.showModalDiv();
    // Assuming this.payload is a single Payload object
this.payload = {
  crno: crno,  // Corrected to use colon
  request_type: request_type,
  status: status,
  stage: stage,
  role: localStorage.getItem('userType'),
  action: action,
  };

       
  }

  submitChangeAction() {
    if (this.remarks.length > 0) {
      this.payload = {...this.payload,remarks:this.remarks};
     
      this.crHttp.setCRequest(this.payload).subscribe({
        next: (res: any) => {},
        error: (err: any) => {
          console.log(err);
        }
      });
      this.onHide();
      this.toasterservice.success("Saved Successfully");
    } else {
      this.toasterservice.warning("Please Enter Remarks");
    }
  }

  navigateTo(status: string) {
    this.activeButton = status;
    this.getcrInfo();
    switch (status) {
      case 'approved':
        this.isApprovedClicked = true;
        this.isPendingClicked = false;
        this.isRejectClicked = false;
        break;
      case 'pending':
        this.isApprovedClicked = false;
        this.isPendingClicked = true;
        this.isRejectClicked = false;
        break;
      case 'rejected':
        this.isApprovedClicked = false;
        this.isPendingClicked = false;
        this.isRejectClicked = true;
        break;
    }
  }

  showModalDiv() {
    this.isDialogVisible = true;
  }

  onHide() {
    this.isDialogVisible = false;
  }

  

  DeleteToasterMessage() {
    if (this.remarks.length > 0) {
      this.toasterservice.error("Deleted Successfully");
      this.onHide();
    } else {
      this.toasterservice.warning("Please Enter Remarks");
    }
  }

  // Fetch user data from API
  getUserData() {
    this.dummyUserService.getCR().subscribe(
      (response) => {
        console.log('User data fetched successfully:', response);
        this.data = response; // Populate the user object with fetched data
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  // Function to determine if the button should be shown based on the userType
  shouldShowButton(buttonType: string): boolean {
    switch (this.userType) {
      case 'RI':
        return buttonType === 'Recommend' || buttonType === 'Close';
      case 'AO':
        return true; // AO can see all buttons
      case 'SECRETARY':
        return buttonType === 'Recommend' || buttonType === 'Approval';
      case 'COMISSIONER':
        return buttonType === 'Approval';
      default:
        return false;
    }
  }

}
