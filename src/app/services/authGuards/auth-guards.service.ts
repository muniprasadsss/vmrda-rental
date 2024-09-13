
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthServiceService } from '../authService/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardsService  {
  private authenticated = new BehaviorSubject<boolean>(false);

  constructor() {
    this.checkInitialAuth();
  }

  private checkInitialAuth() {
    const user = localStorage.getItem('user');
    this.authenticated.next(!!user);
  }

  get isAuthenticated$() {
    return this.authenticated.asObservable();
  }

  login() {
    localStorage.setItem('user', 'authenticated');
    this.authenticated.next(true);
  }

  logout() {
    localStorage.removeItem('user');
    this.authenticated.next(false);
  }
  
}
