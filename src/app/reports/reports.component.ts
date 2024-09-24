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
  const revenueInspectorReports = "https://app.powerbi.com/links/G9OHWobBAq?ctid=392ae423-abe9-4219-b159-0ae77ac19fca&pbi_source=linkShare";
  const developmentReports = "https://app.powerbi.com/groups/me/reports/bc442fb1-c861-40ca-82e6-4540f340e881/36bf69323c2c697c3f2c?ctid=392ae423-abe9-4219-b159-0ae77ac19fca&experience=power-bi";

  this.userType=localStorage.getItem("userType")
  
  
 if(this.userType==="RI"){
  window.open(revenueInspectorReports,'_blank')
 }
 if(this.userType==="COMISSIONER"){
  window.open(developmentReports,'_blank')
 }
  // window.open(powerBILink, '_blank'); 
  // Opens the link in a new tab


}
}
