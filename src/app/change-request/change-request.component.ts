import { Component } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { FooterComponent } from "../footer/footer.component";
import { ChangeRequestService } from '../services/changeRequest/change-request.service';
import { ChangedFields } from '../interfaces/changeRequest/changeRequest';
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
  value!: string;
  user: any;
  data: any[] = [];
  userType: string | null = null; // Role of the user fetched from localStorage

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

  approveCR(value: number) {
    this.showModalDiv();
    this.crHttp.setCRequest(value).subscribe({
      next: (res: any) => {},
      error: (err: any) => {
        console.log(err);
      }
    });
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

  SaveToasterMessage() {
    if (this.value.length > 0) {
      this.toasterservice.success("Saved Successfully");
      this.onHide();
    } else {
      this.toasterservice.warning("Please Enter Remarks");
    }
  }

  DeleteToasterMessage() {
    if (this.value.length > 0) {
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
