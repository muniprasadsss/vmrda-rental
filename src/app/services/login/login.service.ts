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
  userLogin(USER_ID: string, Password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { USER_ID, Password };
    return this.http.post(`${this.apiUrl}/auth/login-session`, body, { headers });
  }
  adminLogin(USER_ID: string, Password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { USER_ID, Password };
    return this.http.post(`${this.apiUrl}/cations`, body, { headers });
  }

  verifyOTPForgetPass(user_id: string, OTP: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { user_id, OTP };
    return this.http.post(`${this.apiUrl}/forget-pass-verify-otp`, body, { headers });
  }

  verifyOTP(OTP: number,user_id:any): Observable<any> {
    const body = { OTP,user_id };
    return this.http.post(`${this.apiUrl}/auth/verify-otp`, body);
  }

  OtpForChangePassword(UserId: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-otp`, {USER_ID:UserId});
  }
  resendOtp(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-otp`, payload);
  }
}
