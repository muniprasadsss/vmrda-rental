import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../configuration';

@Injectable({
  providedIn: 'root'
})
export class ProfileSettingsService {

  private apiUrl = environment.apiUrl
  constructor(private http: HttpClient) { }

  updateProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateProfile`, profileData);
  }

  changePassword(passwordData: any): Observable<any> { 
    return this.http.post(`${this.apiUrl}/changepassword`, passwordData);
  }

  getNotificationsResponse(notificationsData: any): Observable<any> { 
    return this.http.post(`${this.apiUrl}/getNotices`, notificationsData);
  }
}
