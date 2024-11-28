import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { UserTaggingsComponent } from './user-taggings/user-taggings.component';
import { BillDetailsComponent } from './bill-details/bill-details.component';
import { ReceiptDetailsComponent } from './receipt-details/receipt-details.component';
import { TransactionTrackingComponent } from './transaction-tracking/transaction-tracking.component';
import { ChangeRequestComponent } from './change-request/change-request.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { ReportsComponent } from './reports/reports.component';
import { AssetsComponent } from './assets/assets.component';
import { AuthGuardsService } from './services/authGuards/auth-guards.service';
import { DepartmentUsersComponent } from './department-users/department-users.component';
import { IssueNoticeComponent } from './issue-notice/issue-notice.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SessionPageComponent } from './session-expired/session-page/session-page.component';



export const routes: Routes = [
    {path: '',component:LoginComponent},
    { path: 'dashboard', component: DashboardComponent, 
        canActivate: [AuthGuardsService], data: { role: ['RD', 'AO', 'SECRETARY', 'COMMISSIONER','USER','ADMIN','IT-TEAM'] } },
    { path: 'assets', component: AssetsComponent, 
        canActivate: [AuthGuardsService], data: { role: ['RD', 'AO', 'SECRETARY', 'COMMISSIONER','ADMIN','IT-TEAM'] } },
    { path: 'user', component: UserDetailsComponent,
        canActivate: [AuthGuardsService], data: { role: ['RD', 'AO', 'SECRETARY', 'COMMISSIONER','ADMIN','IT-TEAM'] } },
    { path: 'userTagging', component: UserTaggingsComponent,
         canActivate: [AuthGuardsService], data: { role: ['AO', 'SECRETARY', 'COMMISSIONER','RD','ADMIN','IT-TEAM'] } },
    { path: 'billDetails', component: BillDetailsComponent,
         canActivate: [AuthGuardsService], data: { role: ['RD', 'AO','USER','ADMIN','IT-TEAM'] } },
    { path: 'receptDetails', component: ReceiptDetailsComponent, 
        canActivate: [AuthGuardsService], data: { role: ['RD', 'AO','USER','ADMIN','IT-TEAM'] } },
    { path: 'transactionTracking', component: TransactionTrackingComponent, 
        canActivate: [AuthGuardsService], data: { role: ['RD', 'AO','ADMIN','IT-TEAM'] } },
    { path: 'changeRequest', component: ChangeRequestComponent, 
        canActivate: [AuthGuardsService], data: { role: ['RD','AO', 'SECRETARY', 'COMMISSIONER','ADMIN','USER','IT-TEAM'] } },
    { path: 'reports', component: ReportsComponent,
         canActivate: [AuthGuardsService], data: { role: ['RD','AO', 'SECRETARY', 'COMMISSIONER','ADMIN','IT-TEAM'] } },
    { path: 'departmentusers', component: DepartmentUsersComponent, canActivate: [AuthGuardsService], data: { role: ['AO', 'SECRETARY', 'COMMISSIONER','ADMIN','IT-TEAM'] } },
    { path: 'issueNotice', component: IssueNoticeComponent, canActivate: [AuthGuardsService], data: { role: ['RD','AO','ADMIN','IT-TEAM'] } },
    { path: 'session-expired', component: SessionPageComponent},
    {path:'**',component:PageNotFoundComponent}


];
