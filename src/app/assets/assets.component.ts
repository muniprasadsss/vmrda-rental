import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { HeaderComponent } from '../header/header.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { LocationsComponent } from '../locations/locations.component';

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [PrimeNgModule, HeaderComponent, DashboardComponent, FooterComponent,LocationsComponent],
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.scss'
})
export class AssetsComponent {

}
