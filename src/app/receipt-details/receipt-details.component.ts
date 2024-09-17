import { Component } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { HeaderComponent } from '../header/header.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FooterComponent } from '../footer/footer.component';
import { ReceptDetailsService } from '../services/receptDetails/recept-details.service';

@Component({
  selector: 'app-receipt-details',
  standalone: true,
  imports: [PrimeNgModule,HeaderComponent,DashboardComponent,FooterComponent],
  templateUrl: './receipt-details.component.html',
  styleUrl: './receipt-details.component.scss'
})
export class ReceiptDetailsComponent {
  visible: boolean = false;
  userRole:any
  userID:any
  receiptData:any
  constructor(private http:ReceptDetailsService){}

  ngOnInit(){
    this.userRole = localStorage.getItem('role')
    this.userID = localStorage.getItem('userId')
    this.getReceptData();
  }
  showDialog() {
    this.visible = true;
}

  getReceptData(){
    this.http.getReciptDetails(this.userID,this.userRole).subscribe({
      next:(res:any)=>{
        this.receiptData = res.receiptData
      },
      error:(err:any)=>{
        
      }
    })
  }

}
