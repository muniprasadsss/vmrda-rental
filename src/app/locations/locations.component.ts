import { Component } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [PrimeNgModule],
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.scss'
})
export class LocationsComponent {

}
