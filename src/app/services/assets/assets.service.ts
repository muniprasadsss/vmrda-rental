import { Injectable } from '@angular/core';
import { environment } from '../configuration';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  private apiUrl = environment.apiUrl
  constructor(private http: HttpClient) { }

    
   getAssets(USER_ID:string,USER_TYPE:string): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/getPropertyInfo`,{USER_ID,USER_TYPE})   
    }

    addAssets(data: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/property`, data);
    }

    updateAssets(propertyCode: string, propertyData: any): Observable<any> {
      console.log(propertyCode,"service code...");
      console.log(propertyData,"service data...");
      
      return this.http.put(`${this.apiUrl}/property/${propertyCode}`, propertyData);
    }

    getLocationData(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/Locations`)
    }
  
}
