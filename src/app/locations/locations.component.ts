import { Component } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FooterComponent } from "../footer/footer.component";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { HeaderComponent } from "../header/header.component";
import { LocationService } from '../services/location/location.service';
import { LocationDetails } from '../interfaces/location/locationInterface';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [PrimeNgModule, FooterComponent, DashboardComponent, HeaderComponent],
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.scss'
})
export class LocationsComponent {
  visible: boolean = false;
  locationData!: LocationDetails[];
    constructor(private http: LocationService){}

    ngOnInit(){
      this.getLocationInfo();
    }

    getLocationInfo(){
      this.http.getLocationData().subscribe({
        next:(res:any)=>{
          this.locationData = res;
        },
        error:(err:any)=>{
          
        }
      })
    }

  showDialog() {
    this.visible = true;

}
}
