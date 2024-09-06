import { Component } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-change-request',
  standalone: true,
  imports: [PrimeNgModule, FormsModule, HeaderComponent, DashboardComponent, FooterComponent],
  templateUrl: './change-request.component.html',
  styleUrl: './change-request.component.scss'
})
export class ChangeRequestComponent {
  
  isApprovedClicked:boolean = true;
  isRejectClicked:boolean = false;
  isPendingClicked:boolean = false;
  activeButton: string = '';
  constructor(private router: Router) {}
  setActiveButton(button: string) {
    this.activeButton = button;
  }
  ngOnInit() {
    
    
}


navigateTo(status: string) {
  this.activeButton = status;
  switch (status) {
    case 'approved':
      this.isApprovedClicked = true;
      this.isPendingClicked = false;
      this.isRejectClicked = false;
      break;
    case 'pending':
      this.isApprovedClicked = false;
      this.isPendingClicked = true;
      this.isRejectClicked = false;
      break;
    case 'rejected':
      this.isApprovedClicked = false;
      this.isPendingClicked = false;
      this.isRejectClicked = true;
      break;
  }
}


}
