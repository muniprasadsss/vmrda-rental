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
  getBillDetailsByUserId(USER_ID: string,USER_TYPE:string): Observable<any> {
    return this.http.post(`${this.apiUrl}/getBillingInfo`,{USER_ID,USER_TYPE});
  }
      
       // New method to get bill details by bill_no
       getBillDetailsByBillNo(BillNo: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/getbillsByBillNo`, { BillNo });
      }    

// updateBillDetails(billData: any): Observable<any> {
//   console.log(billData,"check...");
//   return this.http.post(`${this.apiUrl}/updateBillDetails`, billData);
// }

updateBillDetails(billData: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/updatebill`, billData); // Updated endpoint
}

      sendEmail(emailData: { to: string; subject: string; text: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/send-email`, emailData); // billData is the data you're sending to the server
      }

      updateBillDetailsByBillNo(updateData: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/updatebillbyBillNo`, updateData); // Updated endpoint
      }
      updateReceipt(receiptData: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/saveReceipts`, receiptData); // Updated endpoint
      }
}
