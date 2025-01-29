import { Injectable } from '@angular/core';
import { environment } from '../configuration';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserTaggingService {

  private apiUrl = environment.apiUrl; // Backend API URL

  constructor(private http: HttpClient) {}

  createUserTagging(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createusertagging`, userData);
  }

  getUserTagging(USER_ID:string,USER_TYPE:string):Observable<any>{
    return this.http.post(`${this.apiUrl}/getUserTagging`,{USER_ID,USER_TYPE})
  }

  editUserTagging(data: any) {    
    return this.http.put(`${this.apiUrl}/updateusertagging`, data);
  }

  getPropertys() {    
    return this.http.get(`${this.apiUrl}/propertyNotoccupied`);
  }

  getPropertyCodes(USER_ID:string,USER_TYPE:string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Allproperty`,{USER_ID,USER_TYPE})
  }
}
