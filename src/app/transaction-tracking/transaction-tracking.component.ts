import { Component, OnInit, ViewChild } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { HeaderComponent } from '../header/header.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FooterComponent } from '../footer/footer.component';
import { TransactionTrackingService } from '../services/tracking/transaction-tracking.service';
import { TransactionTrackingDetails } from '../interfaces/transactionTracking/transactionTrackingInterface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transaction-tracking',
  standalone: true,
  imports: [PrimeNgModule,HeaderComponent,DashboardComponent,FooterComponent,FormsModule],
  templateUrl: './transaction-tracking.component.html',
  styleUrl: './transaction-tracking.component.scss'
})
export class TransactionTrackingComponent {
  @ViewChild('dt2') dt2!: any;

  constructor(private transactionTrackingservice:TransactionTrackingService){}

  dataSource!: any;
  originalDataSource!: any; // Preserve the unfiltered data here
  responseMsg: string | undefined;
  visible: boolean = false;
  value: string = '';
  status: any[] = [];
  StatusFilter = [ 'Not Found','Captured','failed' ];
  fromDate!: Date;
  toDate!: Date;


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
        this.originalDataSource = [...res]; // Keep a copy of the original data
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
    this.dt2.filterGlobal(this.value, 'contains');
  }

  onFilterStatus(event: Event): void {
    this.dt2.filterGlobal(event, 'contains');
  }

  onFilterDate() {
    if (!this.fromDate || !this.toDate) {
      return;
    }
    console.log(this.fromDate,this.toDate,'0');
    const fromdate = new Date(this.fromDate).setHours(0, 0, 0, 0); // Start of the selected day
    const todate = new Date(this.toDate).setHours(23, 59, 59, 999); // End of the selected day
    console.log(fromdate,todate,'1');
    this.dataSource = this.originalDataSource.filter((transaction: any) => {
      const transactionDate = new Date(transaction.created_at).getTime(); // Convert created_at to timestamp
      return transactionDate >= fromdate && transactionDate <= todate;
    });
    console.log('Filtered Data:', this.dataSource);
  }
   
}
