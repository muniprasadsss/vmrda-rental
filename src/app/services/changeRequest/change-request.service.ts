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

    
    getChangeRequestData(USER_ID:any,USER_TYPE:any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/changeReques/getCrInfo`,{USER_ID,USER_TYPE})
          
      }

    setCRequest(payload:any): Observable<any> {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<any>(`${this.apiUrl}/changeReques/create-cr-event`, payload,{headers})
          
      }

      getChangeRequestType(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/changeReques/crrequestTypes`)   
      }

      postCR(CRdata: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<any>(`${this.apiUrl}/changeReques/requestchange`, CRdata);
      }

      uploadAttachment(CRdata: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/upload/uploadFile`, CRdata);
      }
}


