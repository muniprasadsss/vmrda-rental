import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import * as Highcharts from "highcharts";
import { HighchartsChartModule } from "highcharts-angular";
import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from "primeng/calendar";
import { ButtonModule } from "primeng/button";
import { ReportsServiceService } from "../services/reportsService/reports-service.service";

@Component({
  selector: "app-reports",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HighchartsChartModule,
    DropdownModule,
    CalendarModule,
    ButtonModule,
  ],
  templateUrl: "./reports.component.html",
  styleUrl: "./reports.component.scss",
})
export class ReportsComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;

  // Data properties
  demandVsCollection = {
    currentMonthDemand: 0,
    currentMonthRevenue: 0,
    excessAmount: 0,
    currentMonthDue: 0,
    totalDueToday: 0,
  };

  propertiesData = {
    total: 0,
    occupied: 0,
    vacant: 0,
  };

  billsData = {
    dueAmount: 0,
    totalDueAmount: 0,
  };

  receiptsData = {
    paymentModes: [
      { name: "Online", amount: 0, count: 0 },
      { name: "DD", amount: 0, count: 0 },
    ],
  };

  BillsData = {
    billsCount: [
      { name: "paid",  count: 250},
      { name: "Unpaid",  count: 128 },
    ],
  };

  // Filter options
  monthOptions = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
  ];

  propertyOptions = [
    { label: "All Properties", value: "all" },
    { label: "Commercial", value: "commercial" },
    { label: "Residential", value: "residential" },
    { label: "Government", value: "government" },
  ];

  tenantOptions = [
    { label: "All Tenants", value: "all" },
    { label: "Individual", value: "individual" },
    { label: "Corporate", value: "corporate" },
    { label: "Government", value: "government" },
  ];

  divisionOptions = [
    { label: "All Divisions", value: "all" },
    { label: "RI-1", value: "ri1" },
    { label: "RI-2", value: "ri2" },
    { label: "RI-3", value: "ri3" },
  ];

  // Selected filter values
  selectedMonth: number = new Date().getMonth() + 1;
  selectedReceiptMonth: number = new Date().getMonth() + 1;
  selectedProperty: string = "all";
  selectedTenant: string = "all";
  selectedDivision: string = "all";
  selectedDate: Date | null = null;
  selectedGrievanceProperty: string = "all";
  selectedGrievanceTenant: string = "all";
  selectedGrievanceDivision: string = "all";
  selectedGrievanceDate: Date | null = null;

  // Chart options
  riPerformanceChartOptions: Highcharts.Options = {};
  billsChartOptions: Highcharts.Options = {};
  receiptsChartOptions: Highcharts.Options = {};
  issueNoticesChartOptions: Highcharts.Options = {};
  grievanceChartOptions: Highcharts.Options = {};

  // Reports data
  reportsData = [
    {
      title: "Due by Properties List",
      description: "List of properties with due amounts as on date",
      hasDateFilter: true,
      buttonText: "Generate Report",
      type: "due-properties",
      selectedDate: new Date(),
    },
    {
      title: "Due by Tenants List",
      description: "List of tenants with due amounts as on date",
      hasDateFilter: true,
      buttonText: "Generate Report",
      type: "due-tenants",
      selectedDate: new Date(),
    },
    {
      title: "History of Users",
      description: "User activity history as on date",
      hasDateFilter: true,
      buttonText: "Generate Report",
      type: "user-history",
      selectedDate: new Date(),
    },
    {
      title: "Cancelled Properties Due List",
      description: "List of cancelled properties with due amounts",
      hasDateFilter: true,
      buttonText: "Generate Report",
      type: "cancelled-properties",
      selectedDate: new Date(),
    },
    {
      title: "Government Properties Due List",
      description: "List of government properties with due amounts",
      hasDateFilter: true,
      buttonText: "Generate Report",
      type: "government-properties",
      selectedDate: new Date(),
    },
    {
      title: "Vacant Properties List",
      description: "List of vacant properties as on date",
      hasDateFilter: true,
      buttonText: "Generate Report",
      type: "vacant-properties",
      selectedDate: new Date(),
    },
    {
      title: "Issue Notice Report",
      description: "Report of issued notices with custom date",
      hasDateFilter: true,
      buttonText: "Generate Report",
      type: "issue-notice",
      selectedDate: new Date(),
    },
    {
      title: "Rental Collection Report",
      description: "Rental collection report as on date",
      hasDateFilter: true,
      buttonText: "Generate Report",
      type: "rental-collection",
      selectedDate: new Date(),
    },
    {
      title: "GST Report",
      description: "GST report as on date",
      hasDateFilter: true,
      buttonText: "Generate Report",
      type: "gst-report",
      selectedDate: new Date(),
    },
    {
      title: "TDS Report",
      description: "TDS report as on date",
      hasDateFilter: true,
      buttonText: "Generate Report",
      type: "tds-report",
      selectedDate: new Date(),
    },
  ];

  constructor(
    private route: Router,
    private reportsService: ReportsServiceService,
  ) {}

  ngOnInit(): void {
    this.loadDemandVsCollectionData();
    this.loadPropertiesData();
    this.loadBillsData();
    this.loadReceiptsData();
    this.initializeCharts();
  }

  loadDemandVsCollectionData(): void {
    this.reportsService.getDemandVsCollection().subscribe({
      next: (data) => {
        this.demandVsCollection = data;
        this.demandVsCollection.excessAmount =
          this.demandVsCollection.currentMonthRevenue -
          this.demandVsCollection.currentMonthDemand;
      },
      error: (error) => {
        console.error("Error loading demand vs collection data:", error);
        // Set mock data for demonstration
        this.demandVsCollection = {
          currentMonthDemand: 5000000,
          currentMonthRevenue: 4200000,
          excessAmount: -800000,
          currentMonthDue: 800000,
          totalDueToday: 15000000,
        };
      },
    });
  }

  loadPropertiesData(): void {
    this.reportsService.getPropertiesOverview().subscribe({
      next: (data) => {
        this.propertiesData = data;
      },
      error: (error) => {
        console.error("Error loading properties data:", error);
        // Set mock data for demonstration
        this.propertiesData = {
          total: 1250,
          occupied: 980,
          vacant: 270,
        };
      },
    });
  }

  loadBillsData(): void {
    this.reportsService.getBillsData(this.selectedMonth).subscribe({
      next: (data) => {
        this.billsData = data;
        this.updateBillsChart();
      },
      error: (error) => {
        console.error("Error loading bills data:", error);
        // Set mock data for demonstration
        this.billsData = {
          dueAmount: 2500000,
          totalDueAmount: 15000000,
        };
        this.updateBillsChart();
      },
    });
  }

  loadReceiptsData(): void {
    this.reportsService.getReceiptsData(this.selectedReceiptMonth).subscribe({
      next: (data) => {
        this.receiptsData = data;
        this.updateReceiptsChart();
      },
      error: (error) => {
        console.error("Error loading receipts data:", error);
        // Set mock data for demonstration
        this.receiptsData = {
          paymentModes: [
            { name: "Online", amount: 1800000, count: 245 },
            { name: "DD", amount: 350000, count: 45 },
          ],
        };
        this.updateReceiptsChart();
      },
    });
  }

  initializeCharts(): void {
    this.initializeRIPerformanceChart();
    this.updateBillsChart();
    this.updateReceiptsChart();
    this.initializeIssueNoticesChart();
    this.initializeGrievanceChart();
  }

  initializeRIPerformanceChart(): void {
    this.riPerformanceChartOptions = {
      chart: {
        type: "column",
      },
      title: {
        text: "RI Wise Demand vs Collection Performance",
      },
      xAxis: {
        categories: ["RI-1", "RI-2", "RI-3"],
      },
      yAxis: {
        title: {
          text: "Amount (₹)",
        },
      },
      series: [
        {
          type: "column",
          name: "Demand",
          data: [2000000, 1800000, 1200000],
        },
        {
          type: "column",
          name: "Collection",
          data: [1500000, 1600000, 1100000],
        },
      ],
    };
  }

  updateBillsChart(): void {
    const paidAmount = this.billsData.totalDueAmount - this.billsData.dueAmount;

    this.billsChartOptions = {
      chart: {
        type: "line",
      },
      title: {
        text: "Bills Overview",
      },
      series: [
        {
          type: "line",
          name: "Amount",
          data: [
            { name: "Paid", y: paidAmount },
            { name: "Due", y: this.billsData.dueAmount },
          ],
        },
      ],
    };
  }

  updateReceiptsChart(): void {
    this.receiptsChartOptions = {
      chart: {
        type: "pie",
      },
      title: {
        text: "Receipts by Payment Mode",
      },
      series: [
        {
          type: "pie",
          name: "Amount",
          data: this.receiptsData.paymentModes.map((mode) => ({
            name: mode.name,
            y: mode.amount,
          })),
        },
      ],
    };
  }

  initializeIssueNoticesChart(): void {
    this.issueNoticesChartOptions = {
      chart: {
        type: "line",
      },
      title: {
        text: "Issue Notices Trend",
      },
      xAxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      },
      yAxis: {
        title: {
          text: "Number of Notices",
        },
      },
      series: [
        {
          type: "line",
          name: "Notices Issued",
          data: [45, 52, 38, 67, 89, 76],
        },
      ],
    };
  }

  initializeGrievanceChart(): void {
    this.grievanceChartOptions = {
      chart: {
        type: "bar",
      },
      title: {
        text: "Grievance Status Overview",
      },
      xAxis: {
        categories: ["Pending", "In Progress", "Resolved", "Closed"],
      },
      yAxis: {
        title: {
          text: "Count",
        },
      },
      series: [
        {
          type: "bar",
          name: "Grievances",
          data: [25, 45, 78, 156],
        },
      ],
    };
  }

  // Filter event handlers
  onMonthFilterChange(event: any): void {
    this.selectedMonth = event.value;
    this.loadBillsData();
  }

  onReceiptMonthFilterChange(event: any): void {
    this.selectedReceiptMonth = event.value;
    this.loadReceiptsData();
  }

  applyIssueNoticeFilters(): void {
    // Apply filters and reload issue notices data
    console.log("Applying issue notice filters:", {
      property: this.selectedProperty,
      tenant: this.selectedTenant,
      division: this.selectedDivision,
      date: this.selectedDate,
    });
    // Call service to reload data with filters
  }

  applyGrievanceFilters(): void {
    // Apply filters and reload grievance data
    console.log("Applying grievance filters:", {
      property: this.selectedGrievanceProperty,
      tenant: this.selectedGrievanceTenant,
      division: this.selectedGrievanceDivision,
      date: this.selectedGrievanceDate,
    });
    // Call service to reload data with filters
  }

  generateReport(reportType: string, selectedDate?: Date): void {
    this.reportsService.generateReport(reportType, selectedDate).subscribe({
      next: (response) => {
        // Handle report generation response
        console.log("Report generated:", response);
        // Trigger download or open in new tab
        if (response.downloadUrl) {
          window.open(response.downloadUrl, "_blank");
        }
      },
      error: (error) => {
        console.error("Error generating report:", error);
        // Show user-friendly error message
      },
    });
  }
}
