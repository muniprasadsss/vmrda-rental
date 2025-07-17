import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface ReportRow {
  property: string;
  tenant: string;
  division: string;
  dueAmount: number;
  dueDate: string;
}
@Component({
  selector: 'app-report-dashboard',
  standalone: true,
    imports: [PrimeNgModule,ReactiveFormsModule,FormsModule],
  templateUrl: './report-dashboard.component.html',
  styleUrl: './report-dashboard.component.scss'
})


export class ReportDashboardComponent implements OnInit {
  reportData: ReportRow[] = [];
  filteredData: ReportRow[] = [];
  selectedDivision: string = '';
  selectedProperty: string = '';
  selectedTenant: string = '';
  selectedDate: string = '';

  divisions = ['Division A', 'Division B', 'Division C'];

  ngOnInit() {
    this.loadDummyData();
  }

  loadDummyData() {
    this.reportData = [
      { property: 'Prop001', tenant: 'Tenant A', division: 'Division A', dueAmount: 2000, dueDate: '2025-07-01' },
      { property: 'Prop002', tenant: 'Tenant B', division: 'Division B', dueAmount: 1500, dueDate: '2025-07-01' },
      { property: 'Prop003', tenant: 'Tenant C', division: 'Division A', dueAmount: 3000, dueDate: '2025-07-10' },
    ];
    this.filteredData = [...this.reportData];
  }

  filterData() {
    this.filteredData = this.reportData.filter(row => {
      return (
        (!this.selectedDivision || row.division === this.selectedDivision) &&
        (!this.selectedProperty || row.property.includes(this.selectedProperty)) &&
        (!this.selectedTenant || row.tenant.includes(this.selectedTenant)) &&
        (!this.selectedDate || row.dueDate === this.selectedDate)
      );
    });
  }

  exportToExcel() {
    const worksheet = XLSX.utils.json_to_sheet(this.filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');
    XLSX.writeFile(workbook, 'report-data.xlsx');
  }
}
