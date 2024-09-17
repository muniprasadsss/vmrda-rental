import { Injectable } from '@angular/core';
import { environment } from '../configuration';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentUsersService {

  private apiUrl = environment.apiUrl
  constructor(private http: HttpClient) { }

    
  getAdminDetails(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/getAllAdminInfo`)   
    }}
