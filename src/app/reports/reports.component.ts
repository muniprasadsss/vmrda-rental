import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { ReportsServiceService } from '../services/reportsService/reports-service.service';
Chart.register(...registerables);
@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit{
  constructor(private route: Router,private http:ReportsServiceService){}
   userType:any;
  reportUrl:any
  public chart: any;
  public chartData: any;

ngOnInit(): void {

  this.userType=localStorage.getItem('role')

  if(this.userType === 'AO' || this.userType === 'SECRETARY' || this.userType === 'COMMISSIONER' || this.userType === 'ADMIN' || this.userType === 'CO_ADMIN' || this.userType === 'ACCOUNTS_TEAM' ){
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

  // Fetch billing data from the API
  
  
  // this.http.getBillSDemand().subscribe(data => {
  //   // Prepare chart data
  //    this.chartData = {
  //     labels: ['Total', 'Paid', 'Due'],
  //     datasets: [{
  //       data: [data.total, data.totalPaid, data.due],
  //       backgroundColor: ['#42A5F5', '#66BB6A', '#FF7043'],
  //       hoverBackgroundColor: ['#64B5F6', '#81C784', '#FF8A65'],
  //     }]
  //   };

  //   // Create the chart once the data is received
  //   this.createChart();
  // })

}

 

