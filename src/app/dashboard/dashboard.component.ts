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

    activeTabIndex: number = 0;

    constructor(private route: Router) {}

    ngOnInit() {
        // Determine initial tab based on the current route
        this.setActiveTabIndex(this.route.url);
    }

    setActiveTabIndex(url: string) {
        switch (url) {
            case '/user':
                this.activeTabIndex = 0;
                break;
            case '/complex':
                this.activeTabIndex = 1;
                break;
            case '/location':
                this.activeTabIndex = 2;
                break;
            case '/property':
                this.activeTabIndex = 3;
                break;
            case '/userTagging':
                this.activeTabIndex = 4;
                break;
            case '/billDetail':
                this.activeTabIndex = 5;
                break;
            case '/receptDetails':
                this.activeTabIndex = 6;
                break;
            case '/transactionTracking':
                this.activeTabIndex = 7;
                break;
            case '/changeRequest':
                this.activeTabIndex = 8;
                break;
            default:
                this.activeTabIndex = 0;
        }
    }

    onTabChange(event: any) {
        this.activeTabIndex = event.index;
        switch (this.activeTabIndex) {
            case 0:
                this.route.navigateByUrl('/user');
                break;
            case 1:
                this.route.navigateByUrl('/complex');
                break;
            case 2:
                this.route.navigateByUrl('/location');
                break;
            case 3:
                this.route.navigateByUrl('/property');
                break;
            case 4:
                this.route.navigateByUrl('/userTagging');
                break;
            case 5:
                this.route.navigateByUrl('/billDetails');
                break;
            case 6:
                this.route.navigateByUrl('/receptDetails');
                break;
            case 7:
                this.route.navigateByUrl('/transactionTracking');
                break;
            case 8:
                this.route.navigateByUrl('/changeRequest');
                break;
        }
    }
}
