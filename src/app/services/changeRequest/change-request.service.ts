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

    setCRequest(cr_no:number): Observable<any> {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      const payload = { cr_no };
        return this.http.put<any>(`${this.apiUrl}/updateChangeRequest`, payload,{headers})
          
      }
}
