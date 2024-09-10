import { Component } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FormsModule,FormBuilder, FormGroup, Validators ,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { FooterComponent } from "../footer/footer.component";
import { ChangeRequestService } from '../services/changeRequest/change-request.service';
import { ChangedFields } from '../interfaces/changeRequest/changeRequest';

@Component({
  selector: 'app-change-request',
  standalone: true,
  imports: [PrimeNgModule, FormsModule, HeaderComponent, DashboardComponent, FooterComponent,
    ReactiveFormsModule],
  templateUrl: './change-request.component.html',
  styleUrl: './change-request.component.scss'
})
export class ChangeRequestComponent {
  editForm: FormGroup ;
  visible: boolean = false;
  isApprovedClicked:boolean = true;
  isRejectClicked:boolean = false;
  isPendingClicked:boolean = false;
  activeButton: string = '';
  crData!:ChangedFields[];
  approvedcrData!:ChangedFields[];
  pendingcrData!:ChangedFields[];
  rejectedcrData!:ChangedFields[];
  existingRecord: any = {
    s_no: 1,
    user_id: 101,
    Revenue_Division: 'RD1',
    requester_name: 'John Doe',
    request_type: 'Type A',
    request_status: 'Pending',
    comments: 'Initial request',
    attachment: null,
    description: 'Request description',
    created_at: '2024-09-09',
    Aadhaar_No: '123456789012',
    PAN_No: 'ABCDE1234F',
    GSITN: '123456789',
    Email_Id: 'john.doe@example.com'
  };

  changedFields:ChangedFields = {
    s_no: false,
    user_id: false,
    Revenue_Division: false,
    requester_name: false,
    request_type: false,
    request_status: false,
    comments: false,
    attachment: false,
    description: false,
    created_at: false,
    Aadhaar_No: false,
    PAN_No: false,
    GSITN: false,
    Email_Id: true // The user changed this field
  };
  
  constructor(private router: Router,private fb: FormBuilder, private crHttp:ChangeRequestService) {
    this.editForm = this.fb.group({
      s_no: [this.existingRecord.s_no],
      user_id: [this.existingRecord.user_id],
      Revenue_Division: [this.existingRecord.Revenue_Division],
      requester_name: [this.existingRecord.requester_name],
      request_type: [this.existingRecord.request_type],
      request_status: [this.existingRecord.request_status],
      comments: [this.existingRecord.comments],
      attachment: [this.existingRecord.attachment],
      description: [this.existingRecord.description],
      created_at: [this.existingRecord.created_at],
      Aadhaar_No: [this.existingRecord.Aadhaar_No],
      PAN_No: [this.existingRecord.PAN_No],
      GSITN: [this.existingRecord.GSITN],
      Email_Id: [this.existingRecord.Email_Id]
  })
}

      ngOnInit() {
      this.getcrInfo();
      }

    getcrInfo(){
      this.crHttp.getChangeRequestData().subscribe({
        next:(res:any)=>{
          this.crData = res;
        },
        error:(err:any)=>{
          console.log(err)
        }
      })
    }

  setActiveButton(button: string) {
    this.activeButton = button;
  }



    trackChanges(): void {
      this.editForm.valueChanges.subscribe((formValues) => {
        Object.keys(formValues).forEach(key => {
          this.changedFields[key as keyof ChangedFields] = formValues[key] !== this.existingRecord[key];
        });
      });
    }
    
    
    saveChanges(): void {
      const hasChanges = Object.values(this.changedFields).some(isChanged => isChanged);
    
      if (!hasChanges) {
        alert('No changes detected. The request cannot be submitted.');
        return;
      }
    
      console.log('Changed Fields:', this.changedFields);
      console.log('Form data:', this.editForm.value);
    
      // Proceed with form submission or further processing
      this.visible = false;
    }
    

    showDialog() {
      this.visible = true;
    }

    navigateTo(status: string) {
      this.activeButton = status;
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


}
