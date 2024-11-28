import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit{
  constructor(private route: Router){}
   userType:any;
ngOnInit(): void {
  const revenueInspectorReports = "https://app.powerbi.com/links/M2oIqVzLry?ctid=392ae423-abe9-4219-b159-0ae77ac19fca&pbi_source=linkShare";

  this.userType=localStorage.getItem('role')
  
  window.open(revenueInspectorReports,'_blank')
  if( this.userType === 'USER'){
    this.route.navigateByUrl("billDetails")
  }else{
    this.route.navigateByUrl("user")
  }
}
}
