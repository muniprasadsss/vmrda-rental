import { Component, OnInit } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { RouterOutlet } from '@angular/router';
import { ComplexDetailsComponent } from '../complex-details/complex-details.component';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { LocationsComponent } from '../locations/locations.component';
import { PropertysComponent } from '../propertys/propertys.component';
import { UserTaggingsComponent } from '../user-taggings/user-taggings.component';
import { BillDetailsComponent } from '../bill-details/bill-details.component';
import { ReceiptDetailsComponent } from '../receipt-details/receipt-details.component';
import { TransactionTrackingComponent } from '../transaction-tracking/transaction-tracking.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PrimeNgModule,RouterOutlet,ComplexDetailsComponent,UserDetailsComponent,LocationsComponent,PropertysComponent,UserTaggingsComponent,BillDetailsComponent,ReceiptDetailsComponent,TransactionTrackingComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent  {
}
