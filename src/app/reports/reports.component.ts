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
  reportUrl:any

ngOnInit(): void {

  this.userType=localStorage.getItem('userId')

  if(this.userType === 'AO' || this.userType === 'SECARATORY' || this.userType === 'COMMISSIONER' || this.userType === 'ADMIN' || this.userType === 'CO_ADMIN'){
    this.reportUrl = 'https://app.powerbi.com/view?r=eyJrIjoiYzBlYzBmOTUtMmFiZi00NWY0LTk4MWItYTBjZDYxODE2ZDE2IiwidCI6IjM5MmFlNDIzLWFiZTktNDIxOS1iMTU5LTBhZTc3YWMxOWZjYSJ9'
  }
  else if(this.userType === 'RI-1'){
    this.reportUrl = 'https://app.powerbi.com/view?r=eyJrIjoiYTk4ZGE5MzEtOWY4Mi00MmM3LWJkOTUtNTU1ZDcyYWExZjEyIiwidCI6IjM5MmFlNDIzLWFiZTktNDIxOS1iMTU5LTBhZTc3YWMxOWZjYSJ9'
  }
  else if(this.userType === 'RI-2'){
    this.reportUrl = 'https://app.powerbi.com/view?r=eyJrIjoiYmE2YWQwOWQtMzA1Yy00MDFiLTk1NjItYmY3YzZlYzhiYWE2IiwidCI6IjM5MmFlNDIzLWFiZTktNDIxOS1iMTU5LTBhZTc3YWMxOWZjYSJ9'
  }
  else if(this.userType === 'RI-3'){
    this.reportUrl = 'https://app.powerbi.com/view?r=eyJrIjoiZDAyNDhjZDgtYWFmOC00YjdhLWJhOWItYWRlNjk1NzJmNGY2IiwidCI6IjM5MmFlNDIzLWFiZTktNDIxOS1iMTU5LTBhZTc3YWMxOWZjYSJ9'
  }
  


  
      window.open(this.reportUrl,'_blank')
      if( this.userType === 'USER'){
        this.route.navigateByUrl("billDetails")
      }else{
        this.route.navigateByUrl("user")
      }
    }
}
