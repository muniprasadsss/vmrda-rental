import { Component } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { HeaderComponent } from '../header/header.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-receipt-details',
  standalone: true,
  imports: [PrimeNgModule,HeaderComponent,DashboardComponent,FooterComponent],
  templateUrl: './receipt-details.component.html',
  styleUrl: './receipt-details.component.scss'
})
export class ReceiptDetailsComponent {
  visible: boolean = false;

  showDialog() {
    this.visible = true;
}

}
