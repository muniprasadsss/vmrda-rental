import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/userService/user-service.service';
import { userdetails } from '../interfaces/userdetailsInterfaces/userdetailinterfaces';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { HeaderComponent } from "../header/header.component";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [PrimeNgModule, HeaderComponent, DashboardComponent, FooterComponent],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit {
  @ViewChild('dt2') dt!: any;

  value: string = '';

  dataSource!: userdetails[];

  initialValue!: userdetails[];

  activityValues: number[] = [0, 100];
  responseMsg: string | undefined;

  constructor(private router:Router,private userdetailsservice:UserServiceService){}
ngOnInit(): void {
  this.getuserdetails()
}
  getuserdetails() {
    this.userdetailsservice.getUserDetails().subscribe({
      next: (res: any) => {
        this.dataSource = Object.keys(res).map(key => ({ ...res[key] }));
        this.responseMsg = res.message;
        console.log(this.dataSource, "userservice data...");
      },
      error: (err: any) => {
        if (err.error?.message) {
          this.responseMsg = err.error?.message;
        } else {
          this.responseMsg = "error";
        }
      }
    });
  }

  onFilterGlobal(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.dt.filterGlobal(this.value, 'contains');
  }
  
}
