import { Component, ViewChild } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { HeaderComponent } from '../header/header.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { LocationsComponent } from '../locations/locations.component';
import { LocationDetails } from '../interfaces/location/locationInterface';
import { AssetsService } from '../services/assets/assets.service';
import { AuthGuardsService } from '../services/authGuards/auth-guards.service';
import { FormsModule } from '@angular/forms';
FormsModule
@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [PrimeNgModule, HeaderComponent, DashboardComponent, FooterComponent,LocationsComponent,FormsModule],
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.scss'
})
export class AssetsComponent {
  visible: boolean = false;
  assetsData!: LocationDetails[];
  complex:any;
  location:any;
  userRole:any
  userID:any
  value: string | undefined;
  @ViewChild('dt2') dt2!: any;
    constructor(private http: AssetsService,private auth:AuthGuardsService){}

    ngOnInit(){
      this.userRole = localStorage.getItem('role')
      this.userID = localStorage.getItem('userId')
      this.getLocationInfo();
    }

    getLocationInfo(){
      this.http.getAssets( this.userRole,this.userID).subscribe({
        next:(res:any)=>{
          this.assetsData = res.propertyData;
          this.complex = res.complex;
          this.location = res.location;
        },
        error:(err:any)=>{
          console.log(err)
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
}
