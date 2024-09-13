import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PrimeNgModule, RouterOutlet, FooterComponent, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    activeTabIndex: any
    user_type:any = '';
    constructor(private route: Router) {};
    selectedHeader:string = '';

    ngOnInit() {
        this.user_type = localStorage.getItem('userType')
        // if(this.user_type === 'USER'){
        //     this.selectedHeader = 'Bills';
        // }
        // else{
        //     this.selectedHeader = 'Tenants';
        // }
        this.setActiveTabIndex();
    }

    setActiveTabIndex() {
        this.activeTabIndex = 0;
        this.onTabChange(this.selectedHeader)
    }


    // onTabChange(event: any) {
    //     this.activeTabIndex = event.index;
    //     switch (this.activeTabIndex) {
    //         case 0:
    //             this.route.navigateByUrl('/user');
    //             break;
    //         case 1:
    //             this.route.navigateByUrl('/assets');
    //             break;
    //         case 2:
    //             this.route.navigateByUrl('/userTagging');
    //             break;
    //         case 3:
    //             this.route.navigateByUrl('/billDetails');
    //             break;
    //         case 4:
    //             this.route.navigateByUrl('/receptDetails');
    //             break;
    //         case 5:
    //             this.route.navigateByUrl('/transactionTracking');
    //             break;
    //         case 6:
    //             this.route.navigateByUrl('/changeRequest');
    //             break;
    //         case 7:
    //             this.route.navigateByUrl('/reports');
    //             break;
    //             case 8:
    //                 this.route.navigateByUrl('/dummyuser');
    //                 break;
    //     }
    // }

    onTabChange(event: any) {
        const selectedHeader = event.originalEvent.target.innerText; // Gets the header text
        this.activeTabIndex = event.index;
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
                this.route.navigateByUrl('/trackTransactions');
                break;
            case 'Reports':
                this.route.navigateByUrl('/reports');
                break;
            case 'Grievance Request':
                this.route.navigateByUrl('/grievanceRequest');
                break;
            case 'Department Users':
                this.route.navigateByUrl('/dummyuser');
                break;
            default:
                break;
        }
    }
    
    
}
