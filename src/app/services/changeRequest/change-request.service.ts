import { Injectable } from '@angular/core';
import { environment } from '../configuration';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChangeRequestService {

  private apiUrl = environment.apiUrl
  constructor(private http: HttpClient) { }

    
    getChangeRequestData(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/requestchange`)
          
      }

    setCRequest(payload:any): Observable<any> {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        console.log(payload)
        return this.http.post<any>(`${this.apiUrl}/create-cr-event`, payload,{headers})
          
      }
}
