import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../configuration';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private apiUrl = environment.apiUrl; // Backend API URL

  constructor(private http: HttpClient) { }

  getUserDetails():Observable<any>{
    return this.http.get(`${this.apiUrl}/users`)
  }
  
  getUserDetailsByRole(USER_ID:any,USER_TYPE:any):Observable<any>{
    console.log(USER_ID,"id...");
    console.log(USER_TYPE,"type...");
    
    return this.http.post(`${this.apiUrl}/getUserInfo`,{USER_ID,USER_TYPE})
  }

  getUserDetailsByID(sl_no: number): Observable<any> {
    console.log(sl_no,"service check...");  
    return this.http.get<any>(`${this.apiUrl}/getuser/${sl_no}`)   
  }
  
  createUser(data: any): Observable<any> {
    console.log(data, "data in supplier post req");
    return this.http.post(`${this.apiUrl}/createuser`, data); // Pass data as the second argument
  }
  
}
