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

    return this.http.post(`${this.apiUrl}/user/getUserInfo`,{USER_ID,USER_TYPE})
  }

  getUserDetailsByID(sl_no: number): Observable<any> {
    
    return this.http.get<any>(`${this.apiUrl}/user/getuser/${sl_no}`)   
  }
  
  createUser(data: any): Observable<any> {

    return this.http.post(`${this.apiUrl}/user/createuser`, data); // Pass data as the second argument
  }
  
  editUserDetails(data: any) {    
    return this.http.put(`${this.apiUrl}/user/updateuser`, data);
  }
}
