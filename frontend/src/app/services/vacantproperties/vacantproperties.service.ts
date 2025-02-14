import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VacantpropertiesService {

  private apiUrl = environment.apiUrl
  constructor(private http: HttpClient) { }
  
  getVacantProperties(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/vacantProperties-without-bills`)
  }

  editAuctionDate(data: any):Observable<any> {    
    return this.http.put<any>(`${this.apiUrl}/update-auction-date`, data);
  }}
