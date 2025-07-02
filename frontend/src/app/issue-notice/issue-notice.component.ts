import { ChangeDetectorRef, Component } from '@angular/core';
import { billDetails } from '../interfaces/billDetails/billDetailsInterfaces';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { BillDetailsService } from '../services/billDetails/bill-details.service';
import { ReceptDetailsService } from '../services/receptDetails/recept-details.service';
import { IssuenoticeService } from '../services/issueNotice/issuenotice.service';
import { AuthGuardsService } from '../services/authGuards/auth-guards.service';

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
  constructor(private billDetailService: BillDetailsService, 
              private cd: ChangeDetectorRef, 
              private issueNoticeService: IssuenoticeService,
              private authService: AuthGuardsService, 
              http: ReceptDetailsService) {}

  ngOnInit(){
    this.userRole = this.authService.user_Role
    this.userID = this.authService.userId
    // this.getbilldetails();
    this.getIssueNoticeDetails();
  }

  showDialog1() {
    this.visible1 = true;
  }

  getIssueNoticeDetails() {
    this.issueNoticeService.getIssueNoticeData(this.userID,this.userRole).subscribe({
      next: (res: any) => {
        this.dataSource = res.issueNoticeData; // Adjust according to the actual response structure
        this.responseMsg = res.message;
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

  issueNoticeResponse(issuenotice: any) {
    // console.log(issuenotice, "check...");
    this.issueNoticeService.issueNoticeMail(issuenotice).subscribe({
      next: (response: any) => {
        console.log("Notice generated successfully:", response);
      },
      error: (error: any) => {
        console.error("Error generating notice:", error);
      }
    });
  }

}
