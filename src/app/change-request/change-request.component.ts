import { Component, OnInit, ViewChild } from '@angular/core';
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
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-change-request',
  standalone: true,
  imports: [PrimeNgModule, FormsModule, HeaderComponent, DashboardComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './change-request.component.html',
  styleUrl: './change-request.component.scss'
})
export class ChangeRequestComponent implements OnInit {

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
  userRole: string | null = null; // Role of the user fetched from localStorage
  action:string = ''
  userID:any;
  payload!: Payload| Object;
  approvedRecordes!:ChangedFields[];
  pendingRecordes!:ChangedFields[];
  rejectedRecordes!:ChangedFields[];
  userRecordes!:ChangedFields[];
  value: string | undefined;
  tableData!:ChangedFields[];
  @ViewChild('dt2') dt2!: any;
  selectedValue: string = '';
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private crHttp: ChangeRequestService,
    private toasterservice: ToastrService,
    private dummyUserService: DummyUserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getUserData();
    this.userRole = localStorage.getItem('role')
    this.userID = localStorage.getItem('userId')
    this.getcrInfo();
  }

  getcrInfo() {
    this.crData = [];
    this.crHttp.getChangeRequestData(this.userID,this.userRole).subscribe({
      next: (res: any) => {
        this.crData = res.crInfo;
        this.filterData();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  filterData(){
    this.approvedRecordes = [];
    this.pendingRecordes = [];
    this.rejectedRecordes = [];

    this.approvedRecordes = this.crData.filter(item=> {
      return item.status === 'Approved'
    })
    this.pendingRecordes = this.crData.filter(item=> {
      return item.status === 'Pending'
    })
    this.rejectedRecordes = this.crData.filter(item=> {
      return item.status === 'Closed'
    })
    this.userRecordes = this.crData.filter(item=> {
      return item.status !== 'Closed'
    })
    if(this.isApprovedClicked && this.userRole !== 'USER'){
          this.tableData = this.approvedRecordes;
    }
    if(this.isPendingClicked && this.userRole !== 'USER'){
          this.tableData = this.pendingRecordes;
    }
    if(this.isRejectClicked && this.userRole !== 'USER'){
          this.tableData = this.rejectedRecordes;
    }
    if( this.userRole === 'USER'){
          this.tableData = this.userRecordes;
    }
    
  }

  onFilterGlobal(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.dt2.filterGlobal(this.value, 'contains');
  }


  changeStatus( crno: any, request_type: any, status: any, stage:any ,action:any) {
    
    this.showModalDiv();
    // Assuming this.payload is a single Payload object
this.payload = {
  crno: crno,  // Corrected to use colon
  request_type: request_type,
  status: status,
  stage: stage,
  role: localStorage.getItem('userRole'),
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
      this.getcrInfo();
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

  // Function to determine if the button should be shown based on the userRole
  shouldShowButton(buttonType: string) {
    switch (this.userRole) {
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


  isSelectDisabled(stage: string, status: string): boolean {
    switch (this.userRole) {
      case 'RI':
        return !(stage === 'Pending with RI' && status === 'Pending');
      case 'AO':
        return !((stage === 'recommended for ao' || stage === 'Waiting for AO Approval' ) &&
        status === 'Pending');
      case 'SECRETARY':
        return !(stage === 'Recommended for Secretray' && status === 'Pending');
      case 'COMISSIONER':
        return !(stage === 'Recommended for Comissioner' && status === 'Pending');
      default:
        return true; // Disable by default
    }
  }
  
 onChange(crno: any, request_type: any, status: any, stage:any ,action:any) {
    this.changeStatus(crno,request_type,status,stage, this.selectedValue);
  }


}
