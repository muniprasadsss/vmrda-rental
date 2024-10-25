import { Component } from '@angular/core';
import { PrimeNgModule } from '../../prime-ng/prime-ng.module';
import { Router } from '@angular/router';
import { AuthGuardsService } from '../../services/authGuards/auth-guards.service';

@Component({
  selector: 'app-session-page',
  standalone: true,
  imports: [PrimeNgModule],
  templateUrl: './session-page.component.html',
  styleUrl: './session-page.component.scss'
})
export class SessionPageComponent {
  constructor(private router: Router, private authService: AuthGuardsService){}

  changeDialog:boolean = true;

  ngOnInit(){
    console.log(this.changeDialog)
    
  }

  logOut(){
    this.authService.logout();
    this.router.navigateByUrl('/');
    this.changeDialog = false;
  }

}
