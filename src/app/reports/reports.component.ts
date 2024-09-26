import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,DashboardComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit{
   userType:any;
ngOnInit(): void {
  const revenueInspectorReports = "https://app.powerbi.com/links/M2oIqVzLry?ctid=392ae423-abe9-4219-b159-0ae77ac19fca&pbi_source=linkShare";

  this.userType=localStorage.getItem("userType")
  
  window.open(revenueInspectorReports,'_blank')




}
}
