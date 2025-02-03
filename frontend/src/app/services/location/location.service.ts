import { Injectable } from '@angular/core';
import { environment } from '../configuration';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private apiUrl = environment.apiUrl
  constructor(private http: HttpClient) { }

    
    getLocationData(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/Locations`)
          
      }
      saveCR(locationData: any): Observable<any> {
        
        
        return this.http.post<any>(`${this.apiUrl}/cations`, locationData);
      }
}
