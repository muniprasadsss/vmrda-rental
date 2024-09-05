import { Component } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';

@Component({
  selector: 'app-bill-details',
  standalone: true,
  imports: [PrimeNgModule],
  templateUrl: './bill-details.component.html',
  styleUrl: './bill-details.component.scss'
})
export class BillDetailsComponent {

}
