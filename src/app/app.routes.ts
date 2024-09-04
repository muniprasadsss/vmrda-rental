import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ComplexDetailsComponent } from './complex-details/complex-details.component';

export const routes: Routes = [
    {path: 'dashboard',component:DashboardComponent},
    {path: '',component:LoginComponent},
    {path: 'complex',component:ComplexDetailsComponent}
];
