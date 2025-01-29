import { Injectable } from '@angular/core';
import { environment } from '../configuration';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IssuenoticeService {

  private apiUrl = environment.apiUrl
  constructor(private http: HttpClient) {}

  getIssueNoticeData(USER_ID:any,USER_TYPE:any):Observable<any>{
    return this.http.post(`${this.apiUrl}/issueNotice/issue-notices`,{USER_ID,USER_TYPE})
  }

  issueNoticeMail(data: any): Observable<any> {
    console.log(data,"check notice mail data service check...");
    return this.http.post<any>(`${this.apiUrl}/issueNotice/issue-notices/send-email`, data);
  }
  
}
