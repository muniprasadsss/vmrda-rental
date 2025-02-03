import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../configuration';
@Injectable({
  providedIn: 'root'
})
export class ComplexServiceService {
     private apiUrl = environment.apiUrl
  constructor(private http: HttpClient) { }

    
    getComplexData(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/complexes`)
          
      }
    


}
