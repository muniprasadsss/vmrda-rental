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
  getOverdueBills(USER_ID: string,USER_TYPE:string): Observable<any> {
    return this.http.post(`${this.apiUrl}/overdueBills`,{USER_ID,USER_TYPE});
  }

       // New method to get bill details by bill_no
       getBillDetailsByBillNo(BillNo: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/getbillsByBillNo`, { BillNo });
      }

saveBill(billData: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/save-bill`, billData); // Updated endpoint
}

generateBill(billData: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/generate-bill`, billData); // Updated endpoint
}

      sendEmail(emailData: { to: string; subject: string; text: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/send-email`, emailData); // billData is the data you're sending to the server
      }

      updateBillDetailsByBillNo(updateData: any): Observable<any> {
        console.log(updateData,"Updated data to procedure after click on pay...");
        return this.http.post<any>(`${this.apiUrl}/update-bill-status`, updateData); // Updated endpoint
      }
      filterBillingData(updateData: any): Observable<any> {
        console.log(updateData,"Updated data to procedure after click on pay...");
        return this.http.post<any>(`${this.apiUrl}/filterBillingData`, updateData); // Updated endpoint
      }


  getPropertyInfo(BillNo: any): Observable<any> {

    return this.http.post<any>(`${this.apiUrl}/getBillAndPropertyInfo`, {BillNo: BillNo })

  }
  generateAllBills(revenueDivision:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/generate-all-bills`, {revenueDivision: revenueDivision })
  }

    createOrder(amount:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/payment/orders`, amount );
  }

  verifyPayment(paymentDetails: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/payment/verify`, paymentDetails);
  }

  saveTransactionDetails(transactionData: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/createTransaction`, transactionData); // Updated endpoint
  }

  sendEmailWithAttachment(formData: FormData) : Observable<any>{
  return this.http.post<any>(`${this.apiUrl}/sendEmailWithAttachment`, formData);
}
sendEmailWithAttachmentBill(formData: FormData) : Observable<any>{
  return this.http.post<any>(`${this.apiUrl}/sendEmailWithAttachmentBill`, formData);
}

getGst(BillNo: string): Observable<any> {
  console.log("BillNo",BillNo)
  return this.http.post(`${this.apiUrl}/gst`, { BillNo }, { responseType: 'blob' });

}

}
