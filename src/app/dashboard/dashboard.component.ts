import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PrimeNgModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    activeTabIndex: any;
    user_type:any = '';
    constructor(private route: Router) {};
    selectedHeader:string = '';

    ngOnInit() {
        this.user_type = localStorage.getItem('role')
        this.setActiveTabIndex();
    }

    setActiveTabIndex() {
        this.activeTabIndex = 0;
        this.onTabChange(this.selectedHeader)
    }


    onTabChange(event: any) {

        const selectedHeader = event?.originalEvent?.target?.innerText || ''; 
        this.activeTabIndex = event?.index ?? 0;  
        switch (selectedHeader) {
            case 'Tenants':
                this.route.navigateByUrl('/user');
                break;
            case 'Assets':
                this.route.navigateByUrl('/assets');
                break;
            case 'Tenant Tagging':
                this.route.navigateByUrl('/userTagging');
                break;
            case 'Bills':
                this.route.navigateByUrl('/billDetails');
                break;
            case 'Generate Bills':
                this.route.navigateByUrl('/genearateBills');
                break;
            case 'Grievance':
                this.route.navigateByUrl('/changeRequest');
                break;
            case 'Receipts':
                this.route.navigateByUrl('/receptDetails');
                break;
            case 'Issue Notice':
                this.route.navigateByUrl('/issueNotice');
                break;
            case 'Track Transactions':
                this.route.navigateByUrl('/transactionTracking');
                break;
            case 'Reports':
                this.route.navigateByUrl('/reports');
                break;
            case 'Grievance Request':
                this.route.navigateByUrl('/grievanceRequest');
                break;
            case 'Department Users':
                this.route.navigateByUrl('/departmentusers');
                break;
            case 'Requests':
                this.route.navigateByUrl('/requestsComponent');
                break;
                case 'Vacant Properties':
                    this.route.navigateByUrl('/vacant-properties');
                    break;
            default:
                break;
        }
    }
    
    
}
