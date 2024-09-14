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
        return this.http.get<any>(`${this.apiUrl}/billdetails`)
          
      }  
      
       // New method to get bill details by bill_no
  getBillDetailsByBillNo(billNo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/billdetailsbybillno?billNo=${billNo}`);
  }


updateBillDetails(billData: any): Observable<any> {
  console.log(billData,"check...");
  return this.http.post(`${this.apiUrl}/updateBillDetails`, billData);
}

      sendEmail(emailData: { to: string; subject: string; text: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/send-email`, emailData); // billData is the data you're sending to the server
      }
}
