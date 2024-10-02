import { Component, OnInit, ViewChild } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { HeaderComponent } from '../header/header.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { LocationsComponent } from '../locations/locations.component';
import { LocationDetails } from '../interfaces/location/locationInterface';
import { AssetsService } from '../services/assets/assets.service';
import { AuthGuardsService } from '../services/authGuards/auth-guards.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
FormsModule
@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [PrimeNgModule, HeaderComponent, DashboardComponent, FooterComponent,LocationsComponent,FormsModule,ReactiveFormsModule],
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.scss'
})
export class AssetsComponent implements OnInit{
  visible: boolean = false;
  editVisible: boolean = false;
  assetsData!: LocationDetails[];
  complex:any;
  location:any;
  userRole:any
  userID:any
  value: string | undefined;
  locationForm: FormGroup;
  editForm: FormGroup;
  @ViewChild('dt2') dt2!: any;
  selectedPropertyCode!: string;
    constructor(private http: AssetsService,private auth:AuthGuardsService,private assetsservice:AssetsService,private fb: FormBuilder){

       // Initialize the form
    this.locationForm = this.fb.group({
      location: [''],
      locationCode: [''],
      propertyCode: [''],
      propertyNo: [''],
      typeOfProperty: [''],
      floor: [''],
      attribuite1: [''],
      extent: [''],
      presentRent: [''],
      allotteeName: [''],
      size: [''],
      length: [''],
      breadth: [''],
      revenueDivision: [''],
      powerMeterNumber: [''],
      waterMeterNo: [''],
      details: [''],
      status: ['']
    });

    this.editForm = this.fb.group({
      editlocation: [''],
      editlocationCode: [''],
      editpropertyCode: [''],
      editpropertyNo: [''],
      edittypeOfProperty: [''],
      editfloor: [''],
      editattribuite1: [''],
      editextent: [''],
      editpresentRent: [''],
      editallotteeName: [''],
      editsize: [''],
      editlength: [''],
      editbreadth: [''],
      editrevenueDivision: [''],
      editpowerMeterNumber: [''],
      editwaterMeterNo: [''],
      editdetails: [''],
      editstatus: ['']
    });
    }

    ngOnInit(){
      this.userRole = localStorage.getItem('role')
      this.userID = localStorage.getItem('userId')
      this.getLocationInfo();
    }

    getLocationInfo(){
      this.http.getAssets( this.userID,this.userRole).subscribe({
        next:(res:any)=>{
          this.assetsData = res.propertyData;
          this.complex = res.complex;
          this.location = res.location;
        },
        error:(err:any)=>{
          
        }
      })
    }



    onFilterGlobal(event: Event): void {
      const target = event.target as HTMLInputElement;
      this.value = target.value;
      this.dt2.filterGlobal(this.value, 'contains');
    }
    onSelectGlobal(value:any): void {
      // const target = event.target as HTMLInputElement;
      // this.value = target.value;
      this.dt2.filterGlobal(value, 'contains');
    }

    showDialog() {
    this.visible = true;

    }
  
    onSave() {
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
      this.visible = false; // Close the dialog
      this.locationForm.reset(); // Reset the form
    },
    error: (error) => {
      console.error('Error adding property:', error);
    }
  });
    }

    onEdit(location: LocationDetails): void {
      // this.visible = true; 
      this.editVisible=true;
      
      
      this.editForm.patchValue({
        // LOCATION: location.LOCATION,
        // LOCATION_CODE: location.LOCATION_CODE,
        //    editpropertyCode: location.PROPERTY_CODE,
        //    PROPERTY_NO: location.PROPERTY_NO,
        //    TYPE_OF_PROPERTY: location.TYPE_OF_PROPERTY,
        //    FLOOR: location.FLOOR,
        //    ATTRIBUITE1: location.ATTRIBUITE1,
        //    EXTENT: location.EXTENT,
        //    PRESENT_RENT: location.PRESENT_RENT,
        //    ALLOTTEE_NAME: location.ALLOTTEE_NAME,
        //    SIZE: location.SIZE,
        //    LENGTH: location.LENGTH,
        //    BREDTH: location.BREDTH,
        //    REVENUE_DIVISION: location.REVENUE_DIVISION,
        //    POWER_METER_NUMBER: location.POWER_METER_NUMBER,
        //    WATER_METER_NO: location.WATER_METER_NO,
        //    DETAILS: location.DETAILS,
        //    STATUS: location.STATUS: location.LOCATION,
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

  

}
