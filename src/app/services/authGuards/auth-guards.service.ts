import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, interval, Observable, Subscription, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../login/login.service';
import { userdetails } from '../../interfaces/userdetailsInterfaces/userdetailinterfaces';
@Injectable({
  providedIn: 'root',
})
export class AuthGuardsService implements CanActivate {
  private authenticated = new BehaviorSubject<boolean>(false);
  private userRole: string | null = null;
  private apiUrl = environment.apiUrl
  private tokenCheckInterval: Subscription | undefined;
  sessionMessageSource = new BehaviorSubject<string>(''); // Holds session message
  private hasVisited: boolean;
  private userSubject = new BehaviorSubject<any>(null); // Holds user information
  user$ = this.userSubject.asObservable(); // Expose user information as an observable
  public publicKey = new BehaviorSubject<any>(null);
  constructor(private router: Router,private http: HttpClient,private loginService:LoginService, ) {
    this.checkInitialAuth();
    this.hasVisited = localStorage.getItem('hasVisited') === 'true';
  }


  isFirstTime(): boolean {
    return !this.hasVisited;
  }

  markAsVisited(): void {
    this.hasVisited = true;
    localStorage.setItem('hasVisited', 'true');
  }

  private checkInitialAuth() {
    console.log('Checking initial authentication...', this.userSubject.value?.user_type);
    const role = this.userSubject.value?.user_type 
    this.userRole = role ? role.toUpperCase() : null;
    console.log('User role after initial check:', this.userRole);
    this.authenticated.next(!!role);
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const routeRole = route.data['role'];
    
    if (routeRole ) {
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

  // Method to set user information
  loadUserInfo():Observable<userdetails> {
    
      return this.http.get<userdetails>(`${this.apiUrl}/userinfo`, { withCredentials: true }).pipe(
      tap((user:any) => {
        this.userSubject.next(user);
        this.checkInitialAuth();
      })
    );
    
  }

  getPublicKey(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/public-key`).pipe(
      tap((key: any) => {
        this.publicKey.next(key);
        console.log('Public key set:', key);
      })
    );
  }

//  encryptPassword(password: string): string {
//     const jsEncrypt = new JSEncrypt();
//   jsEncrypt.setPublicKey(this.publicKey.getValue());
//   return jsEncrypt.encrypt(password) || '';
// };

async encryptPassword(password: any) {
  const binaryDer = this.pemToArrayBuffer(this.publicKey.getValue());

  const key = await window.crypto.subtle.importKey(
    'spki',
    binaryDer,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    true,
    ['encrypt']
  );

  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    key,
    new TextEncoder().encode(password)
  );

  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}

pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64Lines = pem.replace(/-----[^-]+-----/g, '').replace(/\s/g, '');
  const byteStr = atob(b64Lines);
  const byteArray = new Uint8Array(byteStr.length);
  for (let i = 0; i < byteStr.length; i++) {
    byteArray[i] = byteStr.charCodeAt(i);
  }
  return byteArray.buffer;
}


  
  get user(): userdetails | null {
    return this.userSubject.value;
  }

  get user_Role(): string | null {
    return this.user?.user_type ?? null;
  }

  get userId(): string | null {
    return this.user?.User_ID ?? null;
  }

  checkTokenValidity() {
    this.http.get(`${this.apiUrl}/check-token-session`).subscribe({
      next:(res)=>{
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
        this.logout();
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

  login(role: any, userID: any) {
    // No localStorage usage, just set authenticated and fetch user info
    this.authenticated.next(true);
    this.userSubject.next({ user_type: role, User_ID: userID });
    this.checkInitialAuth();
    
  }

  logout() {
    const userId = this.user?.User_ID;
    if(userId !== null && userId !== undefined){
      const data = {
        user_id: userId,
      }
      this.loginService.logout(data).subscribe({
        next:(res:any)=>{
          console.log(res);
        },
        error:(err:any)=>{
          console.log(err);
        }
      });
    }
    this.authenticated.next(false);
    this.userRole = null;
    this.userSubject.next(null);
    this.stopTokenValidationCheck();
  }


// Check if user is authenticated
isAuthenticated(): boolean {
  const userRole = this.userRole;
  // Check token validity (implement your own logic for token expiration)
  return !!userRole;
}

  getSignedUrl(fileUrl: string) {
  return this.http.get<{ url: string }>(`${this.apiUrl}/file-url`, {
    params: { key: fileUrl }
  });
}


}
