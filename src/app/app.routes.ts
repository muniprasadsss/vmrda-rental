import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ComplexDetailsComponent } from './complex-details/complex-details.component';
import { PropertysComponent } from './propertys/propertys.component';
import { UserTaggingsComponent } from './user-taggings/user-taggings.component';
import { BillDetailsComponent } from './bill-details/bill-details.component';
import { ReceiptDetailsComponent } from './receipt-details/receipt-details.component';
import { TransactionTrackingComponent } from './transaction-tracking/transaction-tracking.component';
import { ChangeRequestComponent } from './change-request/change-request.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { LocationsComponent } from './locations/locations.component';
import { ReportsComponent } from './reports/reports.component';
import { DummyUserComponent } from './dummy-user/dummy-user.component';
import { AssetsComponent } from './assets/assets.component';


export const routes: Routes = [
    {path: '',component:LoginComponent},
    {path: 'dashboard',component:DashboardComponent},
    {path: 'assets',component:AssetsComponent},
    {path: 'user',component:UserDetailsComponent},
    {path: 'complex',component:ComplexDetailsComponent},
    {path: 'location',component:LocationsComponent},
    {path: 'property',component:PropertysComponent},
    {path: 'userTagging',component:UserTaggingsComponent},
    {path: 'billDetails',component:BillDetailsComponent},
    {path: 'receptDetails',component:ReceiptDetailsComponent},
    {path: 'transactionTracking',component:TransactionTrackingComponent},
    {path: 'changeRequest',component:ChangeRequestComponent},
    {path: 'reports',component:ReportsComponent},
    {path: 'grievanceRequest',component:DummyUserComponent},


];
