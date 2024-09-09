import { Component } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { HeaderComponent } from '../header/header.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-bill-details',
  standalone: true,
  imports: [PrimeNgModule,HeaderComponent,DashboardComponent,FooterComponent],
  templateUrl: './bill-details.component.html',
  styleUrl: './bill-details.component.scss'
})
export class BillDetailsComponent {
  visible: boolean = false;

  showDialog() {
    this.visible = true;
}

}
