import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ChangeField {
  field_name: string;
  oldValue: string;
  newValue: string;
  SL_NO: string;
}

export interface ChangeRequest {
  id: number;
  entity_type: string;
  entity_id: number;
  requested_by: string;
  status: string;
  fields: ChangeField[];
  requested_at: string;
}

@Injectable({ providedIn: 'root' })
export class RequestsService {
  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient) {}

  addRequest(payload:any): Observable<any>{
    return this.http.post(`${this.apiUrl}/dept-request`, payload)
  }

  getPending(): Observable<ChangeRequest[]> {
    return this.http.get<ChangeRequest[]>(`${this.apiUrl}/pending-dept-request`);
  }

  approve(id: number, reviewerId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/approve`, { reviewer_id: reviewerId });
  }

  reject(id: number, reviewerId: number, comment: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/reject`, { reviewer_id: reviewerId, comment });
  }
}