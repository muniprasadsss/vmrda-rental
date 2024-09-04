import { Component, OnInit } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { RouterOutlet } from '@angular/router';
import { ComplexDetailsComponent } from '../complex-details/complex-details.component';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { HttpClientModule } from '@angular/common/http';
HttpClientModule
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PrimeNgModule,RouterOutlet,ComplexDetailsComponent,UserDetailsComponent,HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent  {
}
