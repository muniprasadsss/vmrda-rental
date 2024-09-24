import { ChangeDetectorRef, Component } from '@angular/core';
import { billDetails } from '../interfaces/billDetails/billDetailsInterfaces';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { BillDetailsService } from '../services/billDetails/bill-details.service';
import { ReceptDetailsService } from '../services/receptDetails/recept-details.service';

@Component({
  selector: 'app-issue-notice',
  standalone: true,
  imports: [PrimeNgModule, ReactiveFormsModule],
  templateUrl: './issue-notice.component.html',
  styleUrl: './issue-notice.component.scss'
})
export class IssueNoticeComponent {
  visible: boolean = false;
  responseMsg: string | undefined;
  dataSource!: billDetails[];
  form!: FormGroup;
  userRole: any
  userID: any
  showModel: boolean = false;
  visible1: boolean = false;
  propertyData: any;
  propertyDetail: any;
  amount: any;
  receiptData: any;
  notPaidBills!: billDetails[];
  paidBills!: billDetails[];
  constructor(private billDetailService: BillDetailsService, private cd: ChangeDetectorRef, http: ReceptDetailsService) { }

  ngOnInit(){
    this.userRole = localStorage.getItem('role')
    this.userID = localStorage.getItem('userId')
    this.getbilldetails();
  }

  getbilldetails() {
    this.dataSource = []
    this.billDetailService.getOverdueBills(this.userID, this.userRole).subscribe({
      next: (res: any) => {
        this.dataSource = res;
        this.responseMsg = res.message;
        this.filterBillData();
      },
      error: (err: any) => {
        if (err.error?.message) {
          this.responseMsg = err.error?.message;
        } else {
          this.responseMsg = "error";
        }
      }
    });
  }

  filterBillData(){
    this.paidBills = [];
    this.notPaidBills = [];
    this.paidBills = this.dataSource.filter(item=>{
      return item.Status === 'FP'
    })

      this.notPaidBills = this.dataSource.filter(item => {
        return item.Status === 'NP'
      })
    
    this.cd.detectChanges();

  }

  showDialog1() {
    this.visible1 = true;
  }



}
