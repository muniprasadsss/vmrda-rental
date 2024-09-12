import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FormsModule } from '@angular/forms';

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

  constructor(private router:Router){}
  ngOnInit(): void {

    this.items = [
      {
          // label: 'Options',
          items: [
              {
                  label: 'Edit',
                  icon: 'pi pi-pencil',
                  // routerLink: ['/edit'] 
              },
              {
                  label: 'Log Out',
                  icon: 'pi pi-sign-out',
                  routerLink: ['/'] 

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
    localStorage.removeItem("userType")
   this.router.navigateByUrl('/')
  }
  
}
