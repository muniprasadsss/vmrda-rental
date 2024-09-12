import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../configuration';

@Injectable({
  providedIn: 'root'
})
export class DummyUserService {

  private apiUrl = environment.apiUrl
  constructor(private http: HttpClient) { }

    
    getCR(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/requestchange`)    
      }
      postCR(locationData: any): Observable<any> {
        console.log(locationData,"data check...");
        return this.http.post<any>(`${this.apiUrl}/requestchange`, locationData);
      }}
