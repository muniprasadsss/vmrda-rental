import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/userService/user-service.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit {
  dataSource:any=''
  responseMsg: any;
  constructor(private router:Router,private userdetailsservice:UserServiceService){}
ngOnInit(): void {
  this.getuserdetails()
}
  getuserdetails() {
    console.log("api entered..."); 
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
  
}
