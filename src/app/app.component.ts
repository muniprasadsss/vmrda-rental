import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { CommonModule } from '@angular/common';
import { AuthGuardsService } from './services/authGuards/auth-guards.service';
import { SpinnerComponent } from "./spinner/spinner.component";
import { filter } from 'rxjs';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DashboardComponent, HeaderComponent, FooterComponent, CommonModule, SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'VMRDA';
  isAuthenticated: boolean = false;
  showComponents: boolean = false;
  constructor(private authService: AuthGuardsService, private cdr: ChangeDetectorRef,private router:Router) {
      //  Listen to route changes
       this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
        // Check if the current URL is the 404 page
        if (event.url === '/page-not-found' || event.url === '/404') {
          this.showComponents = false;
        } else {
          this.showComponents = true;
        }
      });
  }
    userType:any;
  ngOnInit() {
    this.authService.isAuthenticated$.subscribe(auth => {
      this.isAuthenticated = auth;
      if(this.isAuthenticated){
        this.authService.startTokenValidationCheck();
      }
      
    });
    this.userType = localStorage.getItem('role')
    if(this.userType !== undefined){
      if(this.userType === 'COMMISSIONER' || this.userType === 'SECRETARY'){
        this.router.navigateByUrl("changeRequest")
      }else{
        this.router.navigateByUrl("billDetails")
      }
    }
    
  }

  ngOnDestroy(): void {
    this.authService.stopTokenValidationCheck();
  }


}
