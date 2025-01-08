import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { ToastrService } from 'ngx-toastr';
import { UserTaggingService } from '../services/userTagging/user-tagging.service';
import { usertagging } from '../interfaces/userTagging/usertagginginterface';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeRequestService } from '../services/changeRequest/change-request.service';


@Component({
  selector: 'app-user-taggings',
  standalone: true,
  imports: [PrimeNgModule, ReactiveFormsModule],
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
  unoccupiedProprertys: any;
  @ViewChild('dt2') dt!: any;
  value: any;
  propertyCode:any;
  fileToUpload: any;
  attachmentUrl:any = null;
  constructor(
    private toasterservice: ToastrService,
    private usertaggingservice: UserTaggingService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private Http: ChangeRequestService,
  ) {
    this.addNewForm = this.fb.group({
      user_id: [null, Validators.required],
      attachment: [null, Validators.required],
      property: [null, Validators.required],
      start_date: [null, Validators.required],
      end_date: [null, Validators.required]
    });
    this.editForm = this.fb.group({
      username: [null, Validators.required],
      user_id: [null, Validators.required],
      property: [null, Validators.required],
      start_date: [null, Validators.required],
      end_date: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role');
    this.userID = localStorage.getItem('userId');
    this.getUnoccupiedPropertys();
    this.getUserTaggingDetails();
    this.getPropertyCodes();
  }

  getUnoccupiedPropertys() {
    this.usertaggingservice.getPropertys().subscribe({
      next: (res: any) => {
        this.unoccupiedProprertys = res;
      },
      error: (err: any) => {
        this.responseMsg = err.error?.message || "Error";
      }
    });
  }
  
  onFilterGlobal(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.dt.filterGlobal(this.value, 'contains');
  }

  onSelectGlobal(field: string, selectedValues: any[]): void {
    if (!selectedValues || selectedValues.length === 0) {
      // Clear the global filter when no selection
      this.dt.filterGlobal('', 'contains');
    } else {
      // Use the last selected item's specific field for filtering
      const lastSelected = selectedValues[selectedValues.length - 1][field];
      this.dt.filterGlobal(lastSelected, 'contains');
    }
  }
  
  
  getPropertyCodes(){
    this.usertaggingservice.getPropertyCodes( this.userID,this.userRole).subscribe({
      next:(res:any)=>{
        this.propertyCode = res;
      },
      error:(err:any)=>{
      }
    })
  }

  getUserTaggingDetails() {
    this.dataSource = [];
    this.usertaggingservice.getUserTagging(this.userID, this.userRole).subscribe({
      next: (res: any) => {
        this.dataSource = res.userData;
        this.responseMsg = res.message;
      },
      error: (err: any) => {
        this.responseMsg = err.error?.message || "Error";
      }
    });
    this.cd.detectChanges();
  }

  showDialog() {
    this.visible = true;
  }

  // In user-taggings.component.ts

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

  addNewUser() {
    this.addNewForm.markAllAsTouched(); // checking all form fields are touched or not
    if (this.addNewForm.valid) {
      const formValues = this.addNewForm.value;

      const payload = {
        user_id: formValues.user_id,
        start_date: formValues.start_date,
        end_date: formValues.end_date,
        property: formValues.property,
        attachment:this.attachmentUrl|| null, // Include `attachment` as null if not provided
      };
      this.usertaggingservice.createUserTagging(payload).subscribe({
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
    }
  }

  closeaddDialog(){
    this.visible=false;
    this.addNewForm.reset();
  }

  closeeditDialog(){
    this.editVisible=false;
    this.editForm.reset();
  }

  downloadFile(url: string) {
    if (url) {
      // Open the S3 URL in a new tab
      window.open(url, '_blank');
    } else {
      console.error('No attachment URL provided');
    }
    }

}
