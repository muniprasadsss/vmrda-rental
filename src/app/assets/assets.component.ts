import { Component, OnInit, ViewChild } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { HeaderComponent } from '../header/header.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { LocationDetails } from '../interfaces/location/locationInterface';
import { AssetsService } from '../services/assets/assets.service';
import { AuthGuardsService } from '../services/authGuards/auth-guards.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';

FormsModule
@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [PrimeNgModule, FormsModule, ReactiveFormsModule],
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.scss'
})
export class AssetsComponent implements OnInit {
  addvisible: boolean = false;
  editVisible: boolean = false;
  assetsData!: LocationDetails[];
  complex: any;
  location: any;
  userRole: any
  userID: any
  value: string | undefined;
  locationForm: FormGroup;
  editForm: FormGroup;
  submitted = false; // track input fields befor submit

  @ViewChild('dt2') dt2!: any;
  selectedPropertyCode!: string;
  constructor(
    private http: AssetsService, private auth: AuthGuardsService,
     private assetsservice: AssetsService, private fb: FormBuilder,
      private authService: AuthGuardsService
    ) {

    // Initialize the form
    this.locationForm = this.fb.group({
      location: [null, Validators.required],
      locationCode: [null, Validators.required],
      propertyCode: [null, Validators.required],
      propertyNo: [null, Validators.required],
      typeOfProperty: [null, Validators.required],
      floor: [null],
      attribuite1: [null],
      extent: [null, Validators.required],
      presentRent: [null, Validators.required],
      allotteeName: [null, Validators.required],
      size: [null],
      length: [null],
      breadth: [null],
      revenueDivision: [null, Validators.required],
      powerMeterNumber: [null],
      waterMeterNo: [null],
      details: [null],
      status: [null, Validators.required]
    });

    this.editForm = this.fb.group({
      editlocation: [null, Validators.required],
      editlocationCode: [null, Validators.required],
      editpropertyCode: [null, Validators.required],
      editpropertyNo: [null, Validators.required],
      edittypeOfProperty: [null, Validators.required],
      editfloor: [null, Validators.required],
      editattribuite1: [null],
      editextent: [null, Validators.required],
      editpresentRent: [null, Validators.required],
      editallotteeName: [null],
      editsize: [null],
      editlength: [null],
      editbreadth: [null],
      editrevenueDivision: [null, Validators.required],
      editpowerMeterNumber: [null],
      editwaterMeterNo: [null],
      editdetails: [null],
      editstatus: [null, Validators.required]
    });
  }
  

  ngOnInit() {
    this.userRole = this.authService.user_Role
    this.userID = this.authService.userId
    this.getLocationInfo();
  }

  getLocationInfo() {
    this.http.getAssets(this.userID, this.userRole).subscribe({
      next: (res: any) => {
        this.assetsData = res.propertyData;
        this.complex = res.complex;
        this.location = res.location;
      },
      error: (err: any) => {

      }
    })
  }

  onFilterGlobal(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.dt2.filterGlobal(this.value, 'contains');
  }

  onSelectGlobal(selectedValues: any[]): void {
    if (!selectedValues || selectedValues.length === 0) {
        // Clear the global filter when no selection
        this.dt2.clear();  
    } else {
        // Convert selected values array into a comma-separated string
        // const filterValue = selectedValues.join(', ');
        // this.dt2.filterGlobal(filterValue, 'contains');
        this.dt2.filter(selectedValues, 'LOCATION', 'in');
    }
}


  showDialog() {
    this.addvisible = true;
  }

  onSave() {
    this.submitted=true;
    this.locationForm.markAllAsTouched(); // checking all form fields are touched or not
      const propertyFormData = this.locationForm.value;
      if (!propertyFormData.location || !propertyFormData.locationCode) {
        console.error('Required fields missing');
        return;
      }

    const propertyData = {
      LOCATION: this.locationForm.value.location,
      LOCATION_CODE: this.locationForm.value.locationCode,
      PROPERTY_CODE: this.locationForm.value.propertyCode,
      PROPERTY_NO: this.locationForm.value.propertyNo,
      TYPE_OF_PROPERTY: this.locationForm.value.typeOfProperty,
      FLOOR: this.locationForm.value.floor,
      ATTRIBUITE1: this.locationForm.value.attribuite1,
      EXTENT: this.locationForm.value.extent,
      PRESENT_RENT: this.locationForm.value.presentRent,
      ALLOTTEE_NAME: this.locationForm.value.allotteeName,
      SIZE: this.locationForm.value.size,
      LENGTH: this.locationForm.value.length,
      BREDTH: this.locationForm.value.breadth,
      REVENUE_DIVISION: this.locationForm.value.revenueDivision,
      POWER_METER_NUMBER: this.locationForm.value.powerMeterNumber,
      WATER_METER_NO: this.locationForm.value.waterMeterNo,
      DETAILS: this.locationForm.value.details,
      STATUS: this.locationForm.value.status
    };
    
    this.assetsservice.addAssets(propertyData).subscribe({
      next: (response) => {
        this.getLocationInfo(); // Refresh the list if needed
        this.addvisible = false; // Close the dialog
        this.locationForm.reset(); // Reset the form
      },
      error: (error) => {
        console.error('Error adding property:', error);
      }
    });
  }

  onEdit(location: LocationDetails): void {
    this.editVisible = true;
    this.editForm.patchValue({
      editlocation: location.LOCATION,
      editlocationCode: location.LOCATION_CODE,
      editpropertyCode: location.PROPERTY_CODE,
      editpropertyNo: location.PROPERTY_NO,
      edittypeOfProperty: location.TYPE_OF_PROPERTY,
      editfloor: location.FLOOR,
      editattribuite1: location.ATTRIBUITE1,
      editextent: location.EXTENT,
      editpresentRent: location.PRESENT_RENT,
      editallotteeName: location.ALLOTTEE_NAME,
      editsize: location.SIZE,
      editlength: location.LENGTH,
      editbreadth: location.BREDTH,
      editrevenueDivision: location.REVENUE_DIVISION,
      editpowerMeterNumber: location.POWER_METER_NUMBER,
      editwaterMeterNo: location.WATER_METER_NO,
      editdetails: location.DETAILS,
      editstatus: location.STATUS
    });
    this.selectedPropertyCode = location.PROPERTY_CODE; // Store the property code
  }

  onUpdate(): void {
    let data = this.editForm.value
    const propertyData = {
      LOCATION: data.editlocation,
      LOCATION_CODE: data.editlocationCode,
      editpropertyCode: data.editpropertyCode,
      PROPERTY_NO: data.editpropertyNo,
      TYPE_OF_PROPERTY: data.edittypeOfProperty,
      FLOOR: data.editfloor,
      ATTRIBUITE1: data.editattribuite1,
      EXTENT: data.editextent,
      PRESENT_RENT: data.editpresentRent,
      ALLOTTEE_NAME: data.editallotteeName,
      SIZE: data.editsize,
      LENGTH: data.editlength,
      BREDTH: data.editbreadth,
      REVENUE_DIVISION: data.editrevenueDivision,
      POWER_METER_NUMBER: data.editpowerMeterNumber,
      WATER_METER_NO: data.editpowerMeterNumber,
      DETAILS: data.editdetails,
      STATUS: data.editstatus
    }



    this.assetsservice.updateAssets(this.selectedPropertyCode, propertyData).subscribe({
      next: (response) => {

        this.getLocationInfo(); // Refresh the list if needed
        this.editVisible = false; // Close the dialog
        this.editForm.reset(); // Reset the form
      },
      error: (error) => {
        console.error('Error updating property:', error);
      }
    });
  }

  closeaddDialog(){
    this.addvisible=false;
    this.locationForm.reset();   
  }

  closeeditDialog(){
    this.editVisible=false;
    this.editForm.reset(); 
  }

    downloadExcel(){
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.assetsData); // Convert table to sheet
      const wb: XLSX.WorkBook = XLSX.utils.book_new(); // Create a new workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); // Append the sheet to the workbook
      XLSX.writeFile(wb, 'assets-data.xlsx'); // Write the file
    }

}
