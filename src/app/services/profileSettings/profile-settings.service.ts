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
    return this.http.put(`${this.apiUrl}/user/updateProfile`, profileData);
  }

  changePassword(passwordData: any): Observable<any> { 
    return this.http.put(`${this.apiUrl}/user/changePassword`, passwordData);
  }

  getNotificationsResponse(notificationsData: any): Observable<any> { 
    return this.http.post(`${this.apiUrl}/issueNotice/notices`, notificationsData);
  }
  clearNotification(Id: any): Observable<any> { 
    return this.http.delete(`${this.apiUrl}/issueNotice/clearNotification`, { body:  Id });
  }
  clearAllNotifications(UserId: any): Observable<any> { 
    return this.http.delete(`${this.apiUrl}/issueNotice/clearAllNotifications`, { body:  UserId });
  }

}
