import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardsService implements CanActivate {
  private authenticated = new BehaviorSubject<boolean>(false);
  private userRole: string | null = null;

  constructor(private router: Router ) {
    this.checkInitialAuth();
  }

  private checkInitialAuth() {
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    this.userRole = role ? role.toUpperCase() : null;
    this.authenticated.next(!!user);
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const routeRole = route.data['role'];
    const token = localStorage.getItem('token');
    
    if (token ) {
      if (this.userRole && routeRole && this.isAuthorized(routeRole) && this.isAuthenticated()) {
        return true;
      } else {
        this.logout();
        this.router.navigate(['']);
        return false;
      }
    }
    // Handle case where role is undefined (e.g., not logged in)
    this.logout();
    this.router.navigate(['']);
    return false;
  }

  private isAuthorized(routeRole: string[]): boolean {
    return routeRole.includes(this.userRole!);  // This line is safer now because we check for `userRole` earlier.
  }

  get isAuthenticated$() {
    return this.authenticated.asObservable();
  }

  login(role: string,userID:string) {
    localStorage.setItem('userId',userID );
    localStorage.setItem('user', 'authenticated');
    localStorage.setItem('role', role.toUpperCase());
    this.userRole = role.toUpperCase();
    this.authenticated.next(true);
    
  }

  logout() {
    localStorage.removeItem('token'); 
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    this.authenticated.next(false);
    localStorage.removeItem('userInfo');
  }

// Get the JWT token
getToken(): string | null {
  return localStorage.getItem('token');
}

// Check if user is authenticated
isAuthenticated(): boolean {
  const token = this.getToken();
  // Check token validity (implement your own logic for token expiration)
  return !!token;
}

}
