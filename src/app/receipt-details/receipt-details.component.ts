import { Component } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';

@Component({
  selector: 'app-receipt-details',
  standalone: true,
  imports: [PrimeNgModule],
  templateUrl: './receipt-details.component.html',
  styleUrl: './receipt-details.component.scss'
})
export class ReceiptDetailsComponent {

}
