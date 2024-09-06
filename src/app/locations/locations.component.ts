import { Component } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FooterComponent } from "../footer/footer.component";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [PrimeNgModule, FooterComponent, DashboardComponent, HeaderComponent],
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.scss'
})
export class LocationsComponent {

}
