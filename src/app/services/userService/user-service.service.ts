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

}
