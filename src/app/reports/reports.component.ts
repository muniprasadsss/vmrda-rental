import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import * as Highcharts from "highcharts";
import { HighchartsChartModule } from "highcharts-angular";
import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from "primeng/calendar";
import { ButtonModule } from "primeng/button";
import { MultiSelectModule } from "primeng/multiselect";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { ReportsServiceService } from "../services/reportsService/reports-service.service";
import { AuthGuardsService } from "../services/authGuards/auth-guards.service";
import * as XLSX from "xlsx";

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
    MultiSelectModule,
    CardModule,
    DividerModule,
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
      { name: "paid", count: 250 },
      { name: "Unpaid", count: 128 },
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
    { label: "Commercial", value: "commercial" },
    { label: "Residential", value: "residential" },
    { label: "Government", value: "government" },
    { label: "Industrial", value: "industrial" },
    { label: "Mixed Use", value: "mixed" },
  ];

  tenantOptions = [
    { label: "Individual", value: "individual" },
    { label: "Corporate", value: "corporate" },
    { label: "Government", value: "government" },
    { label: "Non-Profit", value: "nonprofit" },
  ];

  divisionOptions = [
    { label: "RI-1", value: "ri1" },
    { label: "RI-2", value: "ri2" },
    { label: "RI-3", value: "ri3" },
    { label: "RI-4", value: "ri4" },
    { label: "RI-5", value: "ri5" },
  ];

  reportTypeOptions = [
    { label: "All Reports", value: "all" },
    { label: "Financial Reports", value: "financial" },
    { label: "Property Reports", value: "property" },
    { label: "Tenant Reports", value: "tenant" },
    { label: "Collection Reports", value: "collection" },
  ];

  // Global filter values
  globalFilters = {
    startDate: null as Date | null,
    endDate: null as Date | null,
    selectedDivisions: [] as string[],
    selectedProperties: [] as string[],
    selectedTenants: [] as string[],
    reportType: "all" as string,
  };

  // Current user role
  currentUserRole: string = "";

  // Loading states
  isLoadingData: boolean = false;

  // Date range options for quick selection
  dateRangeOptions = [
    { label: "Last 7 Days", value: 7 },
    { label: "Last 30 Days", value: 30 },
    { label: "Last 3 Months", value: 90 },
    { label: "Last 6 Months", value: 180 },
    { label: "Last Year", value: 365 },
  ];

  selectedDateRange: number | null = null;

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
    private authService: AuthGuardsService,
  ) {}

  // Get filtered division options based on user role
  getFilteredDivisionOptions() {
    // If user is RI, only show their division
    if (this.currentUserRole === "RI") {
      const userDivision = this.getUserDivision();
      return this.divisionOptions.filter((div) => div.value === userDivision);
    }
    // For AO, SECRETARY, COMMISSIONER, ADMIN show all
    return this.divisionOptions;
  }

  // Get user's division based on their login info
  private getUserDivision(): string {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    return userInfo.division || "ri1"; // Default to ri1 if not specified
  }

  ngOnInit(): void {
    // Get current user role
    this.currentUserRole = localStorage.getItem("role") || "";

    // Set default date range (last 30 days)
    this.setDefaultDateRange();

    // Set default filters based on user role
    this.setDefaultFilters();

    // Load all data with initial filters
    this.applyGlobalFilters();
  }

  private setDefaultDateRange(): void {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    this.globalFilters.startDate = startDate;
    this.globalFilters.endDate = endDate;
    this.selectedDateRange = 30;
  }

  private setDefaultFilters(): void {
    // Set default filters based on user role
    if (this.currentUserRole === "RI") {
      this.globalFilters.selectedDivisions = [this.getUserDivision()];
    }
  }

  loadDemandVsCollectionData(): void {
    // Use original method for now, later can be updated when backend supports filtering
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
    // Use original method for now, later can be updated when backend supports filtering
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
    // Use original method with current month for now
    const currentMonth = new Date().getMonth() + 1;
    this.reportsService.getBillsData(currentMonth).subscribe({
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
    // Use original method with current month for now
    const currentMonth = new Date().getMonth() + 1;
    this.reportsService.getReceiptsData(currentMonth).subscribe({
      next: (data) => {
        this.receiptsData = data;
        this.updateReceiptsChart();
      },
      error: (error) => {
        console.error("Error loading receipts data:", error);
        // Set mock data for demonstration
        this.receiptsData = {
          paymentModes: [
            { name: "Online", amount: 180000, count: 180000 },
            { name: "DD", amount: 350000, count: 350000 },
            { name: "Total", amount: 530000, count: 530000 },
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
    // Use original method for now, later can be updated when backend supports filtering
    this.reportsService.getRIPerformanceData().subscribe({
      next: (data) => {
        this.riPerformanceChartOptions = {
          chart: {
            type: "column",
          },
          title: {
            text: "RI Wise Demand vs Collection Performance",
          },
          xAxis: {
            categories: data.categories || ["RI-1", "RI-2", "RI-3"],
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
              data: data.demandData || [2000000, 1800000, 1200000],
            },
            {
              type: "column",
              name: "Collection",
              data: data.collectionData || [1500000, 1600000, 1100000],
            },
          ],
        };
      },
      error: (error) => {
        console.error("Error loading RI performance data:", error);
        // Fallback to mock data
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
      },
    });
  }

  updateBillsChart(): void {
    const paidAmount = this.billsData.totalDueAmount - this.billsData.dueAmount;

    this.billsChartOptions = {
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

  // Global filter event handlers
  onDateRangeChange(event: any): void {
    const days = event.value;
    if (days) {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      this.globalFilters.startDate = startDate;
      this.globalFilters.endDate = endDate;
      this.selectedDateRange = days;
    }
  }

  onCustomDateChange(): void {
    // Reset quick date range selection when custom dates are used
    this.selectedDateRange = null;
  }

  applyGlobalFilters(): void {
    if (!this.globalFilters.startDate || !this.globalFilters.endDate) {
      console.error("Please select both start and end dates");
      return;
    }

    this.isLoadingData = true;

    // Load all data with current filters
    Promise.all([
      this.loadDemandVsCollectionData(),
      this.loadPropertiesData(),
      this.loadBillsData(),
      this.loadReceiptsData(),
      this.initializeRIPerformanceChart(),
      this.loadIssueNoticesData(),
      this.loadGrievanceData(),
    ]).finally(() => {
      this.isLoadingData = false;
    });
  }

  loadIssueNoticesData(): void {
    // Use original method with basic filters for now
    const basicFilters = {
      property: "all",
      tenant: "all",
      division: "all",
      date: null,
    };
    this.reportsService.getIssueNoticesData(basicFilters).subscribe({
      next: (data) => {
        this.updateIssueNoticesChart(data);
      },
      error: (error) => {
        console.error("Error loading issue notices data:", error);
        this.initializeIssueNoticesChart();
      },
    });
  }

  loadGrievanceData(): void {
    // Use original method with basic filters for now
    const basicFilters = {
      property: "all",
      tenant: "all",
      division: "all",
      date: null,
    };
    this.reportsService.getGrievanceData(basicFilters).subscribe({
      next: (data) => {
        this.updateGrievanceChart(data);
      },
      error: (error) => {
        console.error("Error loading grievance data:", error);
        this.initializeGrievanceChart();
      },
    });
  }

  updateIssueNoticesChart(data?: any): void {
    this.issueNoticesChartOptions = {
      chart: {
        type: "line",
      },
      title: {
        text: "Issue Notices Trend",
      },
      xAxis: {
        categories: data?.categories || [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
        ],
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
          data: data?.seriesData || [45, 52, 38, 67, 89, 76],
        },
      ],
    };
  }

  updateGrievanceChart(data?: any): void {
    this.grievanceChartOptions = {
      chart: {
        type: "bar",
      },
      title: {
        text: "Grievance Status Overview",
      },
      xAxis: {
        categories: data?.categories || [
          "Pending",
          "In Progress",
          "Resolved",
          "Closed",
        ],
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
          data: data?.seriesData || [25, 45, 78, 156],
        },
      ],
    };
  }

  resetFilters(): void {
    this.globalFilters = {
      startDate: null,
      endDate: null,
      selectedDivisions: [],
      selectedProperties: [],
      selectedTenants: [],
      reportType: "all",
    };
    this.selectedDateRange = null;
    this.setDefaultDateRange();
    this.setDefaultFilters();
    this.applyGlobalFilters();
  }

  generateReport(reportType: string, selectedDate?: Date): void {
    this.reportsService
      .generateReportWithFilters(reportType, this.globalFilters, selectedDate)
      .subscribe({
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

  generateExcelReport(): void {
    // Prepare data for Excel export
    const reportData = {
      demandVsCollection: this.demandVsCollection,
      propertiesData: this.propertiesData,
      billsData: this.billsData,
      receiptsData: this.receiptsData,
      filters: this.globalFilters,
      generatedDate: new Date().toISOString(),
      userRole: this.currentUserRole,
    };

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Demand vs Collection sheet
    const demandCollectionData = [
      ["Metric", "Amount"],
      ["Current Month Demand", this.demandVsCollection.currentMonthDemand],
      ["Current Month Revenue", this.demandVsCollection.currentMonthRevenue],
      ["Excess Amount", this.demandVsCollection.excessAmount],
      ["Current Month Due", this.demandVsCollection.currentMonthDue],
      ["Total Due Today", this.demandVsCollection.totalDueToday],
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(demandCollectionData);
    XLSX.utils.book_append_sheet(wb, ws1, "Demand vs Collection");

    // Properties data sheet
    const propertiesData = [
      ["Property Type", "Count"],
      ["Total Properties", this.propertiesData.total],
      ["Occupied Properties", this.propertiesData.occupied],
      ["Vacant Properties", this.propertiesData.vacant],
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(propertiesData);
    XLSX.utils.book_append_sheet(wb, ws2, "Properties Overview");

    // Receipts data sheet
    const receiptsHeader = ["Payment Mode", "Amount", "Count"];
    const receiptsRows = this.receiptsData.paymentModes.map((mode) => [
      mode.name,
      mode.amount,
      mode.count,
    ]);
    const receiptsData = [receiptsHeader, ...receiptsRows];
    const ws3 = XLSX.utils.aoa_to_sheet(receiptsData);
    XLSX.utils.book_append_sheet(wb, ws3, "Receipts Analysis");

    // Filters sheet
    const filtersData = [
      ["Filter", "Value"],
      ["Start Date", this.globalFilters.startDate?.toDateString() || "Not Set"],
      ["End Date", this.globalFilters.endDate?.toDateString() || "Not Set"],
      [
        "Selected Divisions",
        this.globalFilters.selectedDivisions.join(", ") || "All",
      ],
      [
        "Selected Properties",
        this.globalFilters.selectedProperties.join(", ") || "All",
      ],
      [
        "Selected Tenants",
        this.globalFilters.selectedTenants.join(", ") || "All",
      ],
      ["Report Type", this.globalFilters.reportType],
      ["Generated By", this.currentUserRole],
      ["Generated Date", new Date().toLocaleString()],
    ];
    const ws4 = XLSX.utils.aoa_to_sheet(filtersData);
    XLSX.utils.book_append_sheet(wb, ws4, "Report Filters");

    // Generate filename with timestamp
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .split("T")[0];
    const filename = `VMRDA_Reports_${timestamp}.xlsx`;

    // Save the file
    XLSX.writeFile(wb, filename);
  }
}
