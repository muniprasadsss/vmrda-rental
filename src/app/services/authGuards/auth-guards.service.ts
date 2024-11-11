import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { environment } from '../configuration';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardsService implements CanActivate {
  private authenticated = new BehaviorSubject<boolean>(false);
  private userRole: string | null = null;
  private apiUrl = environment.apiUrl
  private tokenCheckInterval: Subscription | undefined;
   sessionMessageSource = new BehaviorSubject<string>(''); // Holds session message

  constructor(private router: Router,private http: HttpClient ) {
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

  checkTokenValidity() {
    this.http.get(`${this.apiUrl}/check-token-session`).subscribe({
      next:(res)=>{
        if(res !== 'User session is valid'){
          this.router.navigate(['session-expired']);
          this.stopTokenValidationCheck();
        }
        
      },

      error:(error)=>{
        let message = 'Please log in again to continue using the app.';

        if (error.error.message === 'Token expired due to 1-hour validity') {
          message = 'Your session has expired. Please log in again to continue using the app.';
        }
         else if (error.error.message === 'Token expired due to another active login') {
          message = 'Your session was terminated due to another active login. Please log in again.';
        }

        this.sessionMessageSource.next(message); // Set the message
        this.router.navigate(['session-expired']);
        this.stopTokenValidationCheck();
      }
    }
    )}

  startTokenValidationCheck() {
    // Set interval to check token validity every 5 minutes
    this.tokenCheckInterval = interval(300000).subscribe(() => {
      this.checkTokenValidity();
    });
  }

  stopTokenValidationCheck() {
    // Clear the interval when no longer needed
    this.tokenCheckInterval?.unsubscribe();
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
    localStorage.removeItem('userType');
    this.authenticated.next(false);
    localStorage.removeItem('userInfo');
    this.stopTokenValidationCheck();
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
