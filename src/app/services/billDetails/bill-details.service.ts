import { Injectable } from '@angular/core';
import { environment } from '../configuration';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillDetailsService {

  private apiUrl = environment.apiUrl
  constructor(private http: HttpClient) { }

    
  getBillDetails(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/getallbills`)   
    }
    
           // New method to get bill details by userid
  getBillDetailsByUserId(USER_ID: string,role:string): Observable<any> {
    return this.http.post(`${this.apiUrl}/getbillsByUserId`,{USER_ID,role});
  }
      
       // New method to get bill details by bill_no
  getBillDetailsByBillNo(billNo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/getbillsByBillNo`,billNo);
  }


updateBillDetails(billData: any): Observable<any> {
  console.log(billData,"check...");
  return this.http.post(`${this.apiUrl}/updateBillDetails`, billData);
}

      sendEmail(emailData: { to: string; subject: string; text: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/send-email`, emailData); // billData is the data you're sending to the server
      }
}
