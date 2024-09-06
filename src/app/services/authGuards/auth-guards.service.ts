
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../authService/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardsService  {
  constructor(private authService: AuthServiceService, private router: Router){}
  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log('CanActivate called');
      let isLoggedIn = this.authService.isAuthenticated();
      console.log(isLoggedIn)
      if (isLoggedIn){
        // alert(isLoggedIn)
        return true
      } else {
        this.router.navigate(['/login']);
        //alert(isLoggedIn)
        return false;
      }
    
  }
  
}
