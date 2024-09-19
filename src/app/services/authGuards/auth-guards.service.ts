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
    const routeRole = route.data['role']; // Get role from route data

    // Ensure userRole and routeRole are defined
    if (this.userRole && routeRole) {
      if (this.isAuthorized(routeRole)) {
        return true;
      } else {
        // If not authorized, redirect to login or error page
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
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    this.authenticated.next(false);
  }
}
