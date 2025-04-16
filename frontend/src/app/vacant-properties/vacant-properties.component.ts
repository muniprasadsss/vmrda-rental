import { Component, ViewChild } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { VacantpropertiesService } from '../services/vacantproperties/vacantproperties.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-vacant-properties',
  standalone: true,
  imports: [PrimeNgModule,ReactiveFormsModule,CommonModule],
  templateUrl: './vacant-properties.component.html',
  styleUrl: './vacant-properties.component.scss'
})
export class VacantPropertiesComponent {
  @ViewChild('dt2') dt!: any;

  userId: string | null = null;
  userRole: any;  
  value: string = '';
  responseMsg: string | undefined;
  dataSource: any[] = []; 
  editForm!: FormGroup; // Form group for Edit dialog
  editVisible: boolean = false; 
  selectedUser: any ; 
  formValue: any ; 
  currentdate!: string;
  Id!: string;

  constructor(private vacantPropertiesService: VacantpropertiesService,private fb: FormBuilder,
    private toaster:ToastrService
  ){
    this.editForm = this.fb.group({
      editAllotteeName: [{ value: '', disabled: true }],
      editAuctionDate: [{ value: '' }],
      editDetails: [{ value: '', disabled: true }],
      editExtent: [{ value: '', disabled: true }],
      editFloor: [{ value: '', disabled: true }],
      editLocation: [{ value: '', disabled: true }],
      editLocationCode: [{ value: '', disabled: true }],
      editPowerMeterNumber: [{ value: '', disabled: true }],
      editPresentRent: [{ value: '', disabled: true }],
      editPropertyCode: [{ value: '', disabled: true }],
      editPropertyNo: [{ value: '', disabled: true }],
      editRevenueDivision: [{ value: '', disabled: true }],
      editSerialNo: [{ value: '', disabled: true }],
      editStatus: [{ value: '', disabled: true }],
      editTypeOfProperty: [{ value: '', disabled: true }],
      editWaterMeterNo: [{ value: '', disabled: true }]
    });
    const today=new Date();
    this.currentdate=today.toISOString().split("T")[0];

  }

  ngOnInit(): void {
    this.loadData(); 
    this.userId = localStorage.getItem('username');
    this.userRole = localStorage.getItem('role')
  }

  loadData(): void {
    this.vacantPropertiesService.getVacantProperties().subscribe({
      next: (res) => {
        this.dataSource = res.data
        ; // Update dataSource with API response
        // console.log(this.dataSource,"data check..");  
      },
      error: (error) => {
        console.error('Error fetching data', error); // Handle errors
      }
    });
  }

  onFilterGlobal(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.dt.filterGlobal(this.value, 'contains');
  }

  openEditDialog(user: any) {
    console.log(user);
    this.editVisible=true
    this.selectedUser = user;
    this.editForm.patchValue({
      editPropertyNo: user.PROPERTY_NO,
      editPropertyCode: user.PROPERTY_CODE,
      editLocation: user.LOCATION,
      editExtent: user.EXTENT,
      editFloor: user.FLOOR,
      editStatus: user.STATUS,
      editTypeOfProperty: user.TYPE_OF_PROPERTY,
      editAuctionDate: user.AUCTION_DATE,
    });
  }

  updateUser(){
    this.formValue=this.editForm.value
    const payload={
      property_code:this.selectedUser.PROPERTY_CODE, 
      auction_date:this.editForm.value.editAuctionDate
    }
    console.log(payload);
    this.vacantPropertiesService.editAuctionDate(payload).subscribe({
      next: (response) => {
        this.responseMsg = response.message; // Show success message
        this.editVisible = false; // Close the edit dialog
        this.toaster.success("Auction Date updated")
        this.loadData(); // Reload the data to reflect changes
      },
      error: (error) => {
        this.responseMsg = error.error.message || 'An error occurred while updating'; // Handle errors
        this.toaster.error("Error updating auction date")
        console.error('Error updating auction date', error);
      }
    });
    
  }

  downloadExcel(){
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource); // Convert table to sheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); // Append the sheet to the workbook
    XLSX.writeFile(wb, 'vacantproperties-data.xlsx'); // Write the file
  }

}
