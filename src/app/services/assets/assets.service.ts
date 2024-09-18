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
}
