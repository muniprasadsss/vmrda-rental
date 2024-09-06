import { Component } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FormsModule } from '@angular/forms';
import { ApprovedComponent } from '../approved/approved.component';
import { HeaderComponent } from '../header/header.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-change-request',
  standalone: true,
  imports: [PrimeNgModule,FormsModule,ApprovedComponent,HeaderComponent,DashboardComponent,FooterComponent],
  templateUrl: './change-request.component.html',
  styleUrl: './change-request.component.scss'
})
export class ChangeRequestComponent {
  


}
