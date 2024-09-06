
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  isLoggedIn = false;
  constructor() { }
// isAuthenticated(){
//     return this.isLoggedIn;
//   }
// Example in AuthService

//  muni prasad 
// changes made to fix hard reload issue
isAuthenticated(): boolean {
  const token = localStorage.getItem('token');
  return !!token;  // returns true if token exists, false otherwise
}


}