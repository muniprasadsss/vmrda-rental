import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../configuration';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = environment.apiUrl
  constructor(private http: HttpClient) { }

  // Login function to send userId and password to the backend
  userLogin(userId: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { userId, password };
    return this.http.post(`${this.apiUrl}/userogin`, body, { headers });
  }
  adminLogin(userId: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { userId, password };
    return this.http.post(`${this.apiUrl}/cations`, body, { headers });
  }

  verifyOTP(userId: string, OTP: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { userId, OTP };
    return this.http.post(`${this.apiUrl}/cations`, body, { headers });
  }
}
