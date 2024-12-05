import { Component, OnInit, ViewChild } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { HeaderComponent } from '../header/header.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FooterComponent } from '../footer/footer.component';
import { TransactionTrackingService } from '../services/tracking/transaction-tracking.service';
import { TransactionTrackingDetails } from '../interfaces/transactionTracking/transactionTrackingInterface';

@Component({
  selector: 'app-transaction-tracking',
  standalone: true,
  imports: [PrimeNgModule,HeaderComponent,DashboardComponent,FooterComponent],
  templateUrl: './transaction-tracking.component.html',
  styleUrl: './transaction-tracking.component.scss'
})
export class TransactionTrackingComponent {
  @ViewChild('dt2') dt!: any;

  constructor(private transactionTrackingservice:TransactionTrackingService){}

  dataSource!: any;
  responseMsg: string | undefined;
  visible: boolean = false;
  value: string = '';

  ngOnInit(): void {
    this.getTransactionTrackingDetails()
  }

  showDialog() {
    this.visible = true;
   }

   getTransactionTrackingDetails() {
    this.transactionTrackingservice.getTransactionData().subscribe({
      next: (res: any) => {
        this.dataSource = res;
        console.log(this.dataSource,"test...");
        
        this.responseMsg = res.message;
      },
      error: (err: any) => {
        if (err.error?.message) {
          this.responseMsg = err.error?.message;
        } else {
          this.responseMsg = "error";
        }
      }
    });
  }

  onFilterGlobal(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.dt.filterGlobal(this.value, 'contains');
  }
}
