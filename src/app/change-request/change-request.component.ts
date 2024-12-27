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
import { UserServiceService } from '../services/userService/user-service.service';

@Component({
  selector: 'app-change-request',
  standalone: true,
  imports: [PrimeNgModule, FormsModule, ReactiveFormsModule],
  templateUrl: './change-request.component.html',
  styleUrl: './change-request.component.scss'
})
export class ChangeRequestComponent implements OnInit {

  visible: boolean = false;
  isDialogVisible: boolean = false;
  showrejecteddata:boolean=false;
  addrequestdata:boolean=false;
  isApprovedClicked: boolean = true;
  isRejectClicked: boolean = false;
  isPendingClicked: boolean = false;
  activeButton: string = 'approved'; // Track active button
  crData!: ChangedFields[];
  remarks!: string;
  user: any;
  data: any[] = [];
  userRole: string | null = null; // Role of the user fetched from localStorage
  action:string = 'Select'
  userID:any;
  payload!: Payload;
  pendingRecordes!:ChangedFields[];
  rejectedRecordes!:ChangedFields[];
  userRecordes!:ChangedFields[];
  value: string | undefined;
  tableData!:ChangedFields[];
  addRequestForm!: FormGroup;
  @ViewChild('dt2') dt2!: any;
  selectedValue: string = '';
  userInfo:any;
  userInfoString:any;
  fileToUpload: any;
  attachmentUrl:any = null;
  hideSelect:boolean= true;
  index:number = 0;
  propertyList:any;
  propertyCode:any;
  requestType:any

  
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private Http: ChangeRequestService,
    private toasterservice: ToastrService,
    private dummyUserService: DummyUserService,
    private UserService:UserServiceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.userRole = localStorage.getItem('role')
    this.userID = localStorage.getItem('userId')
    this.getcrInfo();
     this.userInfoString = localStorage.getItem('userInfo');
    this.userInfo = JSON.parse(this.userInfoString);
    if(this.userRole === 'USER'){
      this.getUserDatabyId(this.userID);
      this.getRequestType()
    }
  }

  // Form Initialize 
  
  initializeForm() {
    this.addRequestForm = this.fb.group({
      userId: [{ value: this.userID, disabled: true }, Validators.required],
      requestType: [{ value: null}, Validators.required],
      attachment: [{ value: null }, Validators.required],
      propertyCode: [{ value: null }, Validators.required],
      description: ['', Validators.required]
    });
  }

   // Handle file input change
   onFileChange(event: any) {
    const files = event.target.files;
    if (files.length > 0) { // Check if any file is selected
      const file = files[0];
      this.fileToUpload = file;
      this.uploadAttachment(); // Trigger upload function if file exists
    } else {
      console.warn('No file selected');
    }
  }
  

  uploadAttachment(){
    let fd = new FormData();
    fd.append('image',  this.fileToUpload);
    this.Http.uploadAttachment(fd).subscribe({
      next:(res:any)=>{
        this.attachmentUrl = res.location;
        this.fileToUpload = null;
      },
      error:(err:any)=>{

      }
    })
  }

  downloadFile(url: string) {
    if (url) {
      // Open the S3 URL in a new tab
      window.open(url, '_blank');
    } else {
      console.error('No attachment URL provided');
    }
  }

  getcrInfo() {
    this.crData = [];
    this.Http.getChangeRequestData(this.userID,this.userRole).subscribe({
      next: (res: any) => {
        if(res.crInfo ){
          this.crData = res.crInfo;
          this.crData = res.crInfo.map((item: any) => {
            return {
              ...item,
              action: null  // Initialize tempAction as null
            };
          });
          this.filterData();
        }
       
      },
      error: (err: any) => {
        
      }
    });
  }

  filterData(){
    this.pendingRecordes = [];
    this.rejectedRecordes = [];

    this.pendingRecordes = this.crData.filter(item=> {
      return item.status === 'Approved' || item.status === 'Pending'
    })
    this.rejectedRecordes = this.crData.filter(item=> {
      return item.status === 'Closed'
    })

    if( this.userRole === 'USER'){
          this.tableData = this.pendingRecordes;
    }else{
      this.tableData = this.pendingRecordes;
    }
    this.cdr.detectChanges();
  }

  onFilterGlobal(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.dt2.filterGlobal(this.value, 'contains');
  }


  changeStatus(crno: any, request_type: any, status: any, stage: any, action: any,index:number) {
    // Update the action with the selected value from the dropdown
    this.index = index;  // Store the final action after user selects it
  
    // Prepare the payload
    this.payload = {
      crno: crno,
      request_type: request_type,
      status: status,
      stage: stage,
      role: this.userRole,
      action: action,  // Use the updated action value
      user_id: this.userID
    };
  
    // Show the modal or any additional logic
    this.showModalDiv();
  }
  

  submitChangeAction() {
    if (this.remarks.length > 0) {
      this.payload = {...this.payload,remarks:this.remarks};
     
      this.Http.setCRequest(this.payload).subscribe({
        next: (res: any) => {
          this.onHide();
          this.toasterservice.success("Saved Successfully");
          this.getcrInfo();
        },
        error: (err: any) => {
          this.toasterservice.warning(err.error.message);
        }
      });
     
    } else {
     this.toasterservice.warning("Please Enter Remarks")
    }
  }



  showModalDiv() {
    this.isDialogVisible = true;
  }

  RejectedDiv(){
    this.showrejecteddata=true
  }

  addRequestDiv(){
    this.addrequestdata = this.addrequestdata;
    this.addRequestForm.reset();
  }

  onHide() {
    this.isDialogVisible = false;
    this.remarks=''  // remarks form changes to null
    this.payload = {
      crno: null,
      request_type: null,
      status: null,
      stage: null,
      role: this.userRole, // keep role if needed
      action: null,
      user_id: this.userID // keep user_id if needed
    };
    // Reset item.action to initial value
    this.tableData[this.index].action = null;
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
        return buttonType === 'Select';
    }
  }


  isSelectDisabled(stage: string, status: string): boolean {
    switch (this.userRole) {
      case 'RI':
        return !(stage === 'Pending with RI' && status === 'Pending');
      case 'AO':
        return !((stage === 'Recommended for AO' || stage === 'Waiting for AO Approval' ) &&
        status === 'Pending');
      case 'SECRETARY':
        return !(stage === 'Recommended for Secretray' && status === 'Pending');
      case 'COMISSIONER':
        return !(stage === 'Recommended for Comissioner' && status === 'Pending');
      default:
        return true; // Disable by default
    }
  }

    // Function to handle key presses
    handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        // Submit the form on Enter key press
        this.submitChangeAction();
      } else if (event.key === 'Escape') {
        // Close the modal on Escape key press
        this.isDialogVisible = false;
      }
    }
  

//  API call for get data based on userid 

getUserDatabyId(userID: any) {
  this.UserService.getUserDetailsByID(userID).subscribe({
    next: (response) => {
      this.propertyList = response; // Populate the user object with fetched data
    },
    error: (error) => {
      console.error('Error fetching user data:', error);
    }

  });
}

  // api call for get data for select request type 

  getRequestType() {
    this.Http.getChangeRequestType().subscribe({
      next: (response) => {
        this.data = response; // Populate the user object with fetched data
        console.log('Change request type data fetched successfully:', this.data);
      },
      error: (error) => {
        console.error('Error fetching change request type:', error);
      }

    });
  }
  

  onSubmit() {
    this.addRequestForm.markAllAsTouched();
    if (this.addRequestForm.valid) {
      const formData = this.addRequestForm.value;
       // Check if a file has been uploaded
      if (!this.attachmentUrl) {
      console.error('File is required.');
      this.toasterservice.error("File is required."); // Notify user
      return; // Exit early if no file is uploaded
      }

      // Prepare the payload to be sent to the API
      const payload = {
        username: this.userInfo.USER_NAME,
        userId: this.userInfo.USER_ID,
        requesttype: formData.requestType,
        revenuedivision: this.userInfo.REVENUE_DIVISION,
        attachment: this.attachmentUrl,
        propertycode: formData.propertyCode, 
        description: formData.description,
        action: 'new'
      };
  
      // Call the saveUserData method and pass the payload
      this.Http.postCR(payload).subscribe({
        next: (response:any) => {
          this.addrequestdata = false;
          this.toasterservice.success("Change request raised successfully");
          this.addRequestForm.reset(); // Reset the form after successful submission
          this.getcrInfo(); // Refresh the data
          this.addRequestForm.reset();
        },
        error: (error) => {
          console.error('Error sending data:', error);
        }
      });
    } 
  }

}
