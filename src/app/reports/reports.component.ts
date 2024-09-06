import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [HeaderComponent, DashboardComponent, FooterComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {

}
