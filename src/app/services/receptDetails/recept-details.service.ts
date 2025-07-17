import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReceptDetailsService {
    apiUrl = environment.apiUrl

  constructor(private http:HttpClient) { }

  getReciptDetails(USER_ID: string,USER_TYPE:string): Observable<any> {
    return this.http.post(`${this.apiUrl}/getReceiptInfo`,{USER_ID,USER_TYPE});
  }


  getBillDetails(BillNo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/getbillsByBillNo`,{BillNo});
  }

  addReceipt(value:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/manualReceipt`,value);
  }

  filterReceiptData(updateData: any): Observable<any> {
    console.log(updateData,"Updated data to procedure after click on pay...");
    return this.http.post<any>(`${this.apiUrl}/filterReceiptData`, updateData); // Updated endpoint
  }

  getuserdataforreciept(USER_ID:string): Observable<any> {
    return this.http.post(`${this.apiUrl}/getUserInfobyId`,{USER_ID});
  }


}
