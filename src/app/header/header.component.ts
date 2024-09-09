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
  constructor(private router:Router){}
  ngOnInit(): void {
   this.userType=localStorage.getItem("userType")
  }
  logOut(){
    localStorage.removeItem("userType")
   this.router.navigateByUrl('/')
  }
  
}
