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
import { AuthGuardsService } from './services/authGuards/auth-guards.service';
import { DepartmentUsersComponent } from './department-users/department-users.component';


export const routes: Routes = [

    // {path: '',component:LoginComponent},
    // {path: 'dashboard',component:DashboardComponent},
    // {path: 'assets',component:AssetsComponent},
    // {path: 'user',component:UserDetailsComponent},
    // {path: 'complex',component:ComplexDetailsComponent},
    // {path: 'location',component:LocationsComponent},
    // {path: 'property',component:PropertysComponent},
    // {path: 'userTagging',component:UserTaggingsComponent},
    // {path: 'billDetails',component:BillDetailsComponent},
    // {path: 'receptDetails',component:ReceiptDetailsComponent},
    // {path: 'transactionTracking',component:TransactionTrackingComponent},
    // {path: 'changeRequest',component:ChangeRequestComponent},
    // {path: 'reports',component:ReportsComponent},
    // {path: 'gRDevanceRequest',component:DummyUserComponent},
    {path: '',component:LoginComponent},
    { path: 'dashboard', component: DashboardComponent, 
        canActivate: [AuthGuardsService], data: { role: ['RD', 'AO', 'SECRETARY', 'COMMISSIONER','USER','ADMIN'] } },
    { path: 'assets', component: AssetsComponent, 
        canActivate: [AuthGuardsService], data: { role: ['RD', 'AO', 'SECRETARY', 'COMMISSIONER','ADMIN'] } },
    { path: 'user', component: UserDetailsComponent,
        canActivate: [AuthGuardsService], data: { role: ['RD', 'AO', 'SECRETARY', 'COMMISSIONER','ADMIN'] } },
    // { path: 'complex', component: ComplexDetailsComponent,
    //      canActivate: [AuthGuardsService], data: { role: ['RD'] } },
    // { path: 'location', component: LocationsComponent,
    //      canActivate: [AuthGuardsService], data: { role: ['RD', 'AO'] } },
    // { path: 'property', component: PropertysComponent,
    //      canActivate: [AuthGuardsService], data: { role: ['RD', 'AO', 'SECRETARY'] } },
    { path: 'userTagging', component: UserTaggingsComponent,
         canActivate: [AuthGuardsService], data: { role: ['AO', 'SECRETARY', 'COMMISSIONER','RD','ADMIN'] } },
    { path: 'billDetails', component: BillDetailsComponent,
         canActivate: [AuthGuardsService], data: { role: ['RD', 'AO','USER','ADMIN'] } },
    { path: 'receptDetails', component: ReceiptDetailsComponent, 
        canActivate: [AuthGuardsService], data: { role: ['RD', 'AO','USER','ADMIN'] } },
    { path: 'transactionTracking', component: TransactionTrackingComponent, 
        canActivate: [AuthGuardsService], data: { role: ['RD', 'AO','ADMIN'] } },
    { path: 'changeRequest', component: ChangeRequestComponent, 
        canActivate: [AuthGuardsService], data: { role: ['RD','AO', 'SECRETARY', 'COMMISSIONER','ADMIN','USER'] } },
    { path: 'reports', component: ReportsComponent,
         canActivate: [AuthGuardsService], data: { role: ['RD','AO', 'SECRETARY', 'COMMISSIONER','ADMIN'] } },
    { path: 'grievanceRequest', component: DummyUserComponent, 
        canActivate: [AuthGuardsService], data: { role: ['USER','ADMIN'] } },
        { path: 'departmentusers', component: DepartmentUsersComponent, 
            canActivate: [AuthGuardsService], data: { role: ['AO', 'SECRETARY', 'COMMISSIONER','ADMIN'] } },
            { path: 'dummyuser', component: DummyUserComponent, },
    


];
