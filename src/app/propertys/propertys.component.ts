import { Component } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { HeaderComponent } from '../header/header.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-propertys',
  standalone: true,
  imports: [PrimeNgModule,HeaderComponent,DashboardComponent,FooterComponent],
  templateUrl: './propertys.component.html',
  styleUrl: './propertys.component.scss'
})
export class PropertysComponent {

}
