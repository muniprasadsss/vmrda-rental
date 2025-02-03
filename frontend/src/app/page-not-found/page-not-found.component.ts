import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuardsService } from '../services/authGuards/auth-guards.service';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent {
  constructor(private router: Router, private authService: AuthGuardsService){}
  logOut(){
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
