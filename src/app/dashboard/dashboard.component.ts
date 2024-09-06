import { Component, OnInit } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { RouterOutlet,Router } from '@angular/router';
import { ComplexDetailsComponent } from '../complex-details/complex-details.component';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { ChangeRequestComponent } from '../change-request/change-request.component';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PrimeNgModule, RouterOutlet, FooterComponent, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent  {

    constructor(private route:Router){}
  ngOnInit(){
    // this.onTabChange(0);
  }

  onTabChange(event: any) {
    // const index = event.index;
    const index = event && event.index !== undefined ? event.index : event;
    if (index === 0) { 
      this.route.navigateByUrl('/user') 
    }
    if (index === 1) { 
      this.route.navigateByUrl('/complex') 
    }
    if (index === 2) { 
      this.route.navigateByUrl('/location') 
    }
    if (index === 3) { 
      this.route.navigateByUrl('/property') 
    }
    if (index === 4) { 
      this.route.navigateByUrl('/userTagging') 
    }
    if (index === 5) { 
      this.route.navigateByUrl('/billDetail') 
    }
    if (index === 6) { 
      this.route.navigateByUrl('/receptDetails') 
    }
    if (index === 7) { 
      this.route.navigateByUrl('/transactionTracking') 
    }
    if (index === 8) { 
      this.route.navigateByUrl('/changeRequest') 
    }
}
}
