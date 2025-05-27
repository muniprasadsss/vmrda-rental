import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { ToastrService } from 'ngx-toastr';
import { UserTaggingService } from '../services/userTagging/user-tagging.service';
import { usertagging } from '../interfaces/userTagging/usertagginginterface';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeRequestService } from '../services/changeRequest/change-request.service';
import * as XLSX from 'xlsx';
import { RequestsService } from '../services/dept-request/dept-request.service';



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
  selectedRecord:any = null;
  constructor(
    private toasterservice: ToastrService,
    private usertaggingservice: UserTaggingService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private Http: ChangeRequestService,
    private deptRequest: RequestsService
  ) {
    this.addNewForm = this.fb.group({
      user_id: [null, Validators.required],
      attachment: [null, Validators.required],
      property: [null, Validators.required],
      start_date: [null, Validators.required],
      end_date: [null, Validators.required]
    });
    this.editForm = this.fb.group({
      USER_NAME: [null, Validators.required],
      USER_ID: [null, Validators.required],
      PROPERTY: [null, Validators.required],
      START_DATE: [null, Validators.required],
      END_DATE: [null, Validators.required],
      SL_NO:[null]
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
        this.toasterservice.error ("Too large file ize")
      }
    })
  }

  // addNewUser() {
  //   this.addNewForm.markAllAsTouched(); // checking all form fields are touched or not
  //   if (this.addNewForm.valid) {
  //     const formValues = this.addNewForm.value;

  //     const payload = {
  //       user_id: formValues.user_id,
  //       start_date: formValues.start_date,
  //       end_date: formValues.end_date,
  //       property: formValues.property,
  //       DATE_OF_RENEWAL_OF_LICENSE: formValues.DATE_OF_RENEWAL_OF_LICENSE || null,
  //       RENTAL_LEASE_AMOUNT_PERMONTH: formValues.RENTAL_LEASE_AMOUNT_PERMONTH || null,
  //       RENT_GO_LIVE: formValues.RENT_GO_LIVE || null,
  //       RENTAL_LEASE_PERIOD: formValues.RENTAL_LEASE_PERIOD || null,
  //       rental_interest_percent: formValues.rental_interest_percent || null,
  //       RENTAL_HIKE_PERCENT: formValues.RENTAL_HIKE_PERCENT || null,
  //       GST: formValues.GST || null,
  //       GST_INTEREST_PERCENT: formValues.GST_INTEREST_PERCENT || null,
  //       LEASE_DEED_NO: formValues.LEASE_DEED_NO || null,
  //       attachment:this.attachmentUrl|| null, // Include `attachment` as null if not provided
  //     };
  //     this.usertaggingservice.createUserTagging(payload).subscribe({
  //       next: (res) => {
  //         this.toasterservice.success("User added successfully");
  //         this.visible = false; // Close the dialog
  //         this.getUserTaggingDetails(); // Refresh data
  //       },
  //       error: (err) => {
  //         this.toasterservice.error(err.error?.message || "Error adding user");
  //       }
  //     });
  //   }
  //    else {
  //   }
  // }
  addNewUser() {
  this.addNewForm.markAllAsTouched();

  if (this.addNewForm.valid) {
    const formValues = this.addNewForm.value;

    const payload = {
      USER_ID: formValues.user_id,
      START_DATE: formValues.start_date,
      END_DATE: formValues.end_date,
      PROPERTY: formValues.property,
      DATE_OF_RENEWAL_OF_LICENSE: formValues.DATE_OF_RENEWAL_OF_LICENSE || null,
      RENTAL_LEASE_AMOUNT_PERMONTH: formValues.RENTAL_LEASE_AMOUNT_PERMONTH || null,
      RENT_GO_LIVE: formValues.RENT_GO_LIVE || null,
      RENTAL_LEASE_PERIOD: formValues.RENTAL_LEASE_PERIOD || null,
      rental_interest_percent: formValues.rental_interest_percent || null,
      RENTAL_HIKE_PERCENT: formValues.RENTAL_HIKE_PERCENT || null,
      GST: formValues.GST || null,
      GST_INTEREST_PERCENT: formValues.GST_INTEREST_PERCENT || null,
      LEASE_DEED_NO: formValues.LEASE_DEED_NO || null,
      attachment_url: this.attachmentUrl || null,
    };

    if (this.userRole === 'RI') {
      const changes = Object.entries(payload).map(([key, value]) => ({
        field: key,
        oldValue: null,
        newValue: value
      }));

      const changeRequestPayload = {
        entity_type: 'user_tagging_table',  // adjust based on actual table name
        entity_id: formValues.user_id,
        requested_by: this.userID,
        changes: changes,
      };

      this.deptRequest.addRequest(changeRequestPayload).subscribe({
        next: () => {
          this.toasterservice.success("Change request submitted for approval");
          this.visible = false;
          this.addNewForm.reset();
        },
        error: (err) => {
          console.error(err);
          this.toasterservice.error("Failed to submit change request");
        }
      });
    } else {
      this.usertaggingservice.createUserTagging(payload).subscribe({
        next: (res) => {
          this.toasterservice.success("User added successfully");
          this.visible = false;
          this.getUserTaggingDetails();
        },
        error: (err) => {
          this.toasterservice.error(err.error?.message || "Error adding user");
        }
      });
    }
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
      USER_NAME: lease.USER_NAME,
      USER_ID: lease.USER_ID,
      PROPERTY: lease.PROPERTY,
      START_DATE: startDate,
      END_DATE: endDate,
      SL_NO: lease.SL_NO
    });
    this.selectedRecord = this.editForm.value
    this.editVisible = true; // Show the edit dialog
  }

  // In user-taggings.component.ts

  // updateUser() {
  //   if (this.editForm.valid) {
  //     // Call the service to update the user tagging
  //     this.usertaggingservice.editUserTagging(this.editForm.value).subscribe({
  //       next: (res) => {
  //         this.toasterservice.success("User updated successfully");
  //         this.editVisible = false; // Close the edit dialog
  //         this.getUserTaggingDetails(); // Refresh data
  //       },
  //       error: (err) => {
  //         this.toasterservice.error(err.error?.message || "Error updating user");
  //       }
  //     });
  //   } else {
  //   }
  // }

  updateUser() {
  if (this.editForm.valid) {
    const formValues = this.editForm.value;

    if (this.userRole === 'RI') {
      const changes: { field: string, oldValue: any, newValue: any, SL_NO:any }[] = [];
      const orig = this.selectedRecord; 

      const fieldMap = {
        PROPERTY: 'PROPERTY',
        START_DATE: 'START_DATE',
        END_DATE: 'END_DATE',
        USER_NAME: 'USER_NAME',
        USER_ID: 'USER_ID',
      };

      for (const key in fieldMap) {
        if (formValues[key] !== orig[key]) {
          changes.push({
            field: key,
            oldValue: orig[key],
            newValue: formValues[key],
            SL_NO: orig['SL_NO']
          });
        }
      }

      if (changes.length === 0) {
        this.toasterservice.info("No changes detected");
        return;
      }

      const changeRequestPayload = {
        entity_type: 'user_tagging_table',
        entity_id:  this.userID,
        requested_by: this.userID,
        changes: changes,
      };

      this.deptRequest.addRequest(changeRequestPayload).subscribe({
        next: () => {
          this.toasterservice.success("Change request submitted for approval");
          this.editForm.reset();
          this.editVisible = false;
        },
        error: (err) => {
          console.error(err);
          this.toasterservice.error("Failed to submit change request");
        }
      });
    } else {
      this.usertaggingservice.editUserTagging(formValues).subscribe({
        next: (res) => {
          this.toasterservice.success("User updated successfully");
          this.editVisible = false;
          this.getUserTaggingDetails();
        },
        error: (err) => {
          this.toasterservice.error(err.error?.message || "Error updating user");
        }
      });
    }
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

  downloadExcel(){
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource); // Convert table to sheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); // Append the sheet to the workbook
    XLSX.writeFile(wb, 'tenanttagging-data.xlsx'); // Write the file
  }

}
