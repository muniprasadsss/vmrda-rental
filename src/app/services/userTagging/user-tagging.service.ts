import { Injectable } from '@angular/core';
import { environment } from '../configuration';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserTaggingService {

  private apiUrl = environment.apiUrl; // Backend API URL

  constructor(private http: HttpClient) {}

  getUserTaggingDetails():Observable<any>{
    return this.http.get(`${this.apiUrl}/usertagging`)
  }}
