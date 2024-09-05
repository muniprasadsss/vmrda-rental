import { Component } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';

@Component({
  selector: 'app-transaction-tracking',
  standalone: true,
  imports: [PrimeNgModule],
  templateUrl: './transaction-tracking.component.html',
  styleUrl: './transaction-tracking.component.scss'
})
export class TransactionTrackingComponent {

}
