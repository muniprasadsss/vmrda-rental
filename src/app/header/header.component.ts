import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FormsModule } from '@angular/forms';
import { AuthGuardsService } from '../services/authGuards/auth-guards.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [PrimeNgModule,FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  selectedCity:any
  userType:any
  dropdownDiv:boolean=false
  items: any | undefined;

  constructor(private router:Router, private authService:AuthGuardsService){}
  ngOnInit(): void {

    this.items = [
      {
          // label: 'Options',
          items: [
              {
                  label: 'Edit Profile',
                  icon: 'pi pi-pencil',
                  // routerLink: ['/edit'] 
              },
              {
                  label: 'Log Out',
                  icon: 'pi pi-sign-out',
                  // routerLink: ['/'] ,
                  
                  command: () => this.logOut(),
              }
          ]
      }
  ];
   this.userType=localStorage.getItem("userType")
  }
  showDropDown(){
    this.dropdownDiv=true
  }
  logOut(){
    this.authService.logout();
    // localStorage.setItem("userType",'')
   this.router.navigateByUrl('/')
  }
  
}
