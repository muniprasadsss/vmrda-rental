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

  // API status
  isUsingMockData: boolean = true;
  mockDataMessage: string =
    "Currently displaying demo data. API endpoints will be available soon.";

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

    // Unified report options for dropdown
reportTypes = [
  { label: 'Rental Collection', value: 'rental_collection' },
  { label: 'Due by Tenant', value: 'due_by_tenant' },
  { label: 'User History', value: 'user_history' },
  { label: 'Cancelled Due List', value: 'cancelled_property_due' },
  { label: 'Govt Property Due', value: 'govt_property_due' },
  { label: 'Vacant Property', value: 'vacant_property' },
  { label: 'Notice Report', value: 'notice_report' },
  { label: 'GST Report', value: 'gst_report' },
  { label: 'TDS Report', value: 'tds_report' },
];


  // Unified report selection properties
  selectedReportType: string = '';
  selectedReportDescription: string = '';
  selectedReportDates: Date[] = [];

  // Legacy reports data (keeping for backward compatibility)
  reportsData = [
    {
      title: "Due by Properties List",
      description: "List of properties with due amounts as on date",
      hasDateFilter: true,
      hasDateRangeFilter: true,
      buttonText: "Generate Report",
      type: "due-properties",
      selectedDate: new Date(),
      selectedDates: [] as Date[],
      fromDate: null as Date | null,
      toDate: null as Date | null,
    },
    {
      title: "Due by Tenants List",
      description: "List of tenants with due amounts as on date",
      hasDateFilter: true,
      hasDateRangeFilter: true,
      buttonText: "Generate Report",
      type: "due-tenants",
      selectedDate: new Date(),
      selectedDates: [] as Date[],
      fromDate: null as Date | null,
      toDate: null as Date | null,
    },
    {
      title: "History of Users",
      description: "User activity history as on date",
      hasDateFilter: true,
      hasDateRangeFilter: true,
      buttonText: "Generate Report",
      type: "user-history",
      selectedDate: new Date(),
      selectedDates: [] as Date[],
      fromDate: null as Date | null,
      toDate: null as Date | null,
    },
    {
      title: "Cancelled Properties Due List",
      description: "List of cancelled properties with due amounts",
      hasDateFilter: true,
      hasDateRangeFilter: true,
      buttonText: "Generate Report",
      type: "cancelled-properties",
      selectedDate: new Date(),
      selectedDates: [] as Date[],
      fromDate: null as Date | null,
      toDate: null as Date | null,
    },
    {
      title: "Government Properties Due List",
      description: "List of government properties with due amounts",
      hasDateFilter: true,
      hasDateRangeFilter: true,
      buttonText: "Generate Report",
      type: "government-properties",
      selectedDate: new Date(),
      selectedDates: [] as Date[],
      fromDate: null as Date | null,
      toDate: null as Date | null,
    },
    {
      title: "Vacant Properties List",
      description: "List of vacant properties as on date",
      hasDateFilter: true,
      hasDateRangeFilter: true,
      buttonText: "Generate Report",
      type: "vacant-properties",
      selectedDate: new Date(),
      selectedDates: [] as Date[],
      fromDate: null as Date | null,
      toDate: null as Date | null,
    },
    {
      title: "Issue Notice Report",
      description: "Report of issued notices with custom date",
      hasDateFilter: true,
      hasDateRangeFilter: true,
      buttonText: "Generate Report",
      type: "issue-notice",
      selectedDate: new Date(),
      selectedDates: [] as Date[],
      fromDate: null as Date | null,
      toDate: null as Date | null,
    },
    {
      title: "Rental Collection Report",
      description: "Rental collection report as on date",
      hasDateFilter: true,
      hasDateRangeFilter: true,
      buttonText: "Generate Report",
      type: "rental-collection",
      selectedDate: new Date(),
      selectedDates: [] as Date[],
      fromDate: null as Date | null,
      toDate: null as Date | null,
    },
    {
      title: "GST Report",
      description: "GST report as on date",
      hasDateFilter: true,
      hasDateRangeFilter: true,
      buttonText: "Generate Report",
      type: "gst-report",
      selectedDate: new Date(),
      selectedDates: [] as Date[],
      fromDate: null as Date | null,
      toDate: null as Date | null,
    },
    {
      title: "TDS Report",
      description: "TDS report as on date",
      hasDateFilter: true,
      hasDateRangeFilter: true,
      buttonText: "Generate Report",
      type: "tds-report",
      selectedDate: new Date(),
      selectedDates: [] as Date[],
      fromDate: null as Date | null,
      toDate: null as Date | null,
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
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      return userInfo.division || "ri1"; // Default to ri1 if not specified
    } catch (error) {
      console.error("Error parsing user info:", error);
      return "ri1"; // Fallback default
    }
  }

  ngOnInit(): void {
    try {
      // Get current user role
      this.currentUserRole = localStorage.getItem("role") || "";
      console.log("Current user role:", this.currentUserRole);

      // Set default date range (last 30 days)
      this.setDefaultDateRange();

      // Set default filters based on user role
      this.setDefaultFilters();

      // Initialize charts first
      this.initializeCharts();

      // Ensure all reports have proper initialization
      this.initializeReportsData();

      // Load all data with initial filters
      this.applyGlobalFilters();
    } catch (error) {
      console.error("Error in ngOnInit:", error);
      // Fallback to basic initialization
      this.setDefaultDateRange();
      this.initializeCharts();
      this.initializeReportsData();
    }
  }

  private initializeReportsData(): void {
    // Ensure all reports have proper array initialization
    try {
      if (!this.reportsData || !Array.isArray(this.reportsData)) {
        console.error("reportsData is not properly initialized");
        return;
      }

      this.reportsData.forEach((report) => {
        if (!report) return;

        if (!report.selectedDates || !Array.isArray(report.selectedDates)) {
          report.selectedDates = [];
        }
        if (!report.selectedDate) {
          report.selectedDate = new Date();
        }
        if (report.fromDate === undefined) {
          report.fromDate = null;
        }
        if (report.toDate === undefined) {
          report.toDate = null;
        }
        // Ensure boolean flags are properly set
        if (typeof report.hasDateFilter !== "boolean") {
          report.hasDateFilter = true;
        }
        if (typeof report.hasDateRangeFilter !== "boolean") {
          report.hasDateRangeFilter = true;
        }
      });
      console.log(
        "Reports data initialized:",
        this.reportsData.length,
        "reports",
      );
    } catch (error) {
      console.error("Error initializing reports data:", error);
    }
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
    try {
      // Set default filters based on user role
      if (this.currentUserRole === "RI") {
        const userDivision = this.getUserDivision();
        this.globalFilters.selectedDivisions = [userDivision];
        console.log("Set default division for RI user:", userDivision);
      }
    } catch (error) {
      console.error("Error setting default filters:", error);
      // Use empty arrays as fallback
      this.globalFilters.selectedDivisions = [];
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
        console.warn(
          "API endpoint not available, using mock data for demand vs collection",
        );
        // Set realistic mock data for demonstration
        this.demandVsCollection = {
          currentMonthDemand: 8500000,
          currentMonthRevenue: 7200000,
          excessAmount: -1300000,
          currentMonthDue: 1300000,
          totalDueToday: 18500000,
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
        console.warn(
          "API endpoint not available, using mock data for properties overview",
        );
        // Set realistic mock data for demonstration
        this.propertiesData = {
          total: 1856,
          occupied: 1425,
          vacant: 431,
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
        console.warn("API endpoint not available, using mock data for bills");
        // Set realistic mock data for demonstration
        this.billsData = {
          dueAmount: 3200000,
          totalDueAmount: 18500000,
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
        console.warn(
          "API endpoint not available, using mock data for receipts",
        );
        // Set realistic mock data for demonstration
        this.receiptsData = {
          paymentModes: [
            { name: "Online", amount: 4200000, count: 850 },
            { name: "DD", amount: 1800000, count: 245 },
            { name: "Cash", amount: 950000, count: 180 },
            { name: "Cheque", amount: 1250000, count: 125 },
          ],
        };
        this.updateReceiptsChart();
      },
    });
  }

  initializeCharts(): void {
    try {
      this.initializeRIPerformanceChart();
      this.updateBillsChart();
      this.updateReceiptsChart();
      this.initializeIssueNoticesChart();
      this.initializeGrievanceChart();
    } catch (error) {
      console.error("Error initializing charts:", error);
      // Initialize with basic empty charts as fallback
      this.initializeFallbackCharts();
    }
  }

  private initializeFallbackCharts(): void {
    // Basic fallback chart configurations
    this.riPerformanceChartOptions = {
      chart: { type: "column" },
      title: { text: "RI Wise Performance - Loading..." },
      series: [{ type: "column", name: "Loading", data: [] }],
    };

    this.billsChartOptions = {
      chart: { type: "line" },
      title: { text: "Bills Trend - Loading..." },
      series: [{ type: "line", name: "Loading", data: [] }],
    };

    this.receiptsChartOptions = {
      chart: { type: "pie" },
      title: { text: "Receipts - Loading..." },
      series: [{ type: "pie", name: "Loading", data: [] }],
    };

    this.issueNoticesChartOptions = {
      chart: { type: "line" },
      title: { text: "Issue Notices - Loading..." },
      series: [{ type: "line", name: "Loading", data: [] }],
    };

    this.grievanceChartOptions = {
      chart: { type: "bar" },
      title: { text: "Grievances - Loading..." },
      series: [{ type: "bar", name: "Loading", data: [] }],
    };
  }

  initializeRIPerformanceChart(): void {
    // Use original method for now, later can be updated when backend supports filtering
    this.reportsService.getRIPerformanceData().subscribe({
      next: (data) => {
       this.riPerformanceChart(data)
      },
      error: (error) => {
        console.warn(
          "API endpoint not available, using mock data for RI performance",
        );
        // Fallback to realistic mock data
        this.riPerformanceChart('');
      },
    });
  }

  riPerformanceChart(data:any): void{
    // Validate and use API data if available, else use mock data
    let categories: string[] = ["RI-1", "RI-2", "RI-3", "RI-4", "RI-5"];
    let demandData: number[] = [2850000, 2200000, 1850000, 1950000, 1450000];
    let collectionData: number[] = [2400000, 1950000, 1600000, 1750000, 1300000];

    if (data && typeof data === 'object' && Array.isArray(data.categories) && Array.isArray(data.demand) && Array.isArray(data.collection) && data.demand.length && data.collection.length) {
      categories = data.categories;
      demandData = data.demand;
      collectionData = data.collection;
    }

    this.riPerformanceChartOptions = {
      chart: {
        type: "column",
      },
      title: {
        text: "RI Wise Demand vs Collection Performance",
      },
      xAxis: {
        categories: categories,
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
          data: demandData,
        },
        {
          type: "column",
          name: "Collection",
          data: collectionData,
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
      console.warn("Date range not selected, using default values");
      this.setDefaultDateRange();
    }

    this.isLoadingData = true;

    // Load all data with current filters
    Promise.allSettled([
      new Promise((resolve, reject) => {
        this.loadDemandVsCollectionData();
        setTimeout(resolve, 100); // Give it time to complete
      }),
      new Promise((resolve, reject) => {
        this.loadPropertiesData();
        setTimeout(resolve, 100);
      }),
      new Promise((resolve, reject) => {
        this.loadBillsData();
        setTimeout(resolve, 100);
      }),
      new Promise((resolve, reject) => {
        this.loadReceiptsData();
        setTimeout(resolve, 100);
      }),
      new Promise((resolve, reject) => {
        this.initializeRIPerformanceChart();
        setTimeout(resolve, 100);
      }),
      new Promise((resolve, reject) => {
        this.loadIssueNoticesData();
        setTimeout(resolve, 100);
      }),
      new Promise((resolve, reject) => {
        this.loadGrievanceData();
        setTimeout(resolve, 100);
      }),
    ]).finally(() => {
      this.isLoadingData = false;
      console.log("All data loading operations completed");
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
        console.warn(
          "API endpoint not available, using mock data for issue notices",
        );
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
        console.warn(
          "API endpoint not available, using mock data for grievance analysis",
        );
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

  generateReport(reportType: string, selectedDate?: Date, report?: any): void {
    // Determine which date(s) to use for the report
    let reportDate = selectedDate;
    let dateRange = null;

    if (report && report.hasDateRangeFilter) {
      if (report.selectedDates && report.selectedDates.length > 0) {
        // Use multiselect dates
        dateRange = {
          dates: report.selectedDates.map(
            (d: Date) => d.toISOString().split("T")[0],
          ),
          fromDate: report.fromDate
            ? report.fromDate.toISOString().split("T")[0]
            : null,
          toDate: report.toDate
            ? report.toDate.toISOString().split("T")[0]
            : null,
        };
      } else if (report.fromDate && report.toDate) {
        // Use from/to date range
        dateRange = {
          fromDate: report.fromDate.toISOString().split("T")[0],
          toDate: report.toDate.toISOString().split("T")[0],
        };
      }
    }

    // Use original method for now, later can be updated when backend supports filtering
    this.reportsService.generateReport(reportType, reportDate).subscribe({
      next: (response) => {
        // Handle report generation response
        console.log("Report generated:", response);
        console.log("Date range used:", dateRange);
        // Trigger download or open in new tab
        if (response.downloadUrl) {
          window.open(response.downloadUrl, "_blank");
        }
      },
      error: (error) => {
        console.error("Error generating report:", error);
        console.error("Full error details:", JSON.stringify(error, null, 2));
        // Show user-friendly error message
        console.warn(
          "Report generation failed, check if backend endpoint exists",
        );
      },
    });
  }

  // Handle multiselect date changes
  onMultiSelectDateChange(report: any, selectedDates: Date[]): void {
    if (!report) {
      console.error("Report object is undefined in onMultiSelectDateChange");
      return;
    }

    report.selectedDates = selectedDates || [];

    // Auto-set from and to dates based on selected dates
    if (
      selectedDates &&
      Array.isArray(selectedDates) &&
      selectedDates.length > 0
    ) {
      try {
        const sortedDates = [...selectedDates]
          .filter((date: any) => date instanceof Date && !isNaN(date.getTime()))
          .sort((a: Date, b: Date) => a.getTime() - b.getTime());

        if (sortedDates.length > 0) {
          report.fromDate = sortedDates[0];
          report.toDate = sortedDates[sortedDates.length - 1];
        } else {
          report.fromDate = null;
          report.toDate = null;
        }
      } catch (error) {
        console.error("Error processing selected dates:", error);
        report.fromDate = null;
        report.toDate = null;
      }
    } else {
      report.fromDate = null;
      report.toDate = null;
    }

    console.log(
      "Multi-select dates updated for",
      report?.title || "Unknown report",
      ":",
      {
        selectedDates: selectedDates,
        fromDate: report.fromDate,
        toDate: report.toDate,
      },
    );
  }

  // These methods are kept for future use if from/to date inputs are added back
  // onFromDateChange(report: any, fromDate: Date): void {
  //   report.fromDate = fromDate;
  //   console.log('From date updated for', report.title, ':', fromDate);
  // }
  //
  // onToDateChange(report: any, toDate: Date): void {
  //   report.toDate = toDate;
  //   console.log('To date updated for', report.title, ':', toDate);
  // }

  // Validate date range
  isValidDateRange(report: any): boolean {
    if (report.hasDateRangeFilter) {
      // Only check if multiselect dates are selected
      return report.selectedDates && report.selectedDates.length > 0;
    }
    // For single date reports, check if date is selected
    if (report.hasDateFilter) {
      return report.selectedDate != null;
    }
    return true;
  }

  // Get formatted date range text
  getDateRangeText(report: any): string {
    if (!report || !report.hasDateRangeFilter) return "";

    if (
      report.selectedDates &&
      Array.isArray(report.selectedDates) &&
      report.selectedDates.length > 0
    ) {
      try {
        const validDates = report.selectedDates.filter(
          (date: any) => date instanceof Date && !isNaN(date.getTime()),
        );

        if (validDates.length === 0) {
          return "No valid dates selected";
        }

        const count = validDates.length;
        if (count === 1) {
          return `1 date selected: ${validDates[0].toLocaleDateString()}`;
        } else {
          const sortedDates = [...validDates].sort(
            (a, b) => a.getTime() - b.getTime(),
          );
          const fromStr = sortedDates[0].toLocaleDateString();
          const toStr =
            sortedDates[sortedDates.length - 1].toLocaleDateString();
          return `${count} dates selected (${fromStr} to ${toStr})`;
        }
      } catch (error) {
        console.error("Error formatting date range text:", error);
        return "Error displaying dates";
      }
    }

    return "No dates selected";
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

    // New unified report methods
  onReportTypeChange(): void {
    const selectedOption = this.reportTypes.find(option => option.value === this.selectedReportType);
    // Clear previously selected dates when changing report type
    this.selectedReportDates = [];
  }

  onReportDateChange(selectedDates: Date[]): void {
    this.selectedReportDates = selectedDates || [];
  }

  generateSelectedReport(): void {
    if (!this.selectedReportType || !this.selectedReportDates.length) {
      console.warn('Report type or dates not selected');
      return;
    }

    // Create date range object for the selected report
    const dateRange = {
      dates: this.selectedReportDates.map(date => date.toISOString().split('T')[0]),
      fromDate: this.selectedReportDates.length > 0 ?
        Math.min(...this.selectedReportDates.map(d => d.getTime())) : null,
      toDate: this.selectedReportDates.length > 0 ?
        Math.max(...this.selectedReportDates.map(d => d.getTime())) : null
    };

    console.log('Generating report:', {
      type: this.selectedReportType,
      dateRange: dateRange,
      selectedDates: this.selectedReportDates
    });

    // Use the existing generateReport method with the first selected date
    const primaryDate = this.selectedReportDates[0];
    this.generateReport(this.selectedReportType, primaryDate, {
      selectedDates: this.selectedReportDates,
      hasDateRangeFilter: true,
      type: this.selectedReportType
    });
  }

  isValidReportSelection(): boolean {
    return !!this.selectedReportType && this.selectedReportDates.length > 0;
  }

  getSelectedDatesText(): string {
    if (!this.selectedReportDates || this.selectedReportDates.length === 0) {
      return 'No dates selected';
    }

    const count = this.selectedReportDates.length;
    if (count === 1) {
      return `1 date selected: ${this.selectedReportDates[0].toLocaleDateString()}`;
    } else {
      const sortedDates = [...this.selectedReportDates].sort((a, b) => a.getTime() - b.getTime());
      const fromStr = sortedDates[0].toLocaleDateString();
      const toStr = sortedDates[sortedDates.length - 1].toLocaleDateString();
      return `${count} dates selected (${fromStr} to ${toStr})`;
    }
  }

  // TrackBy function for ngFor to improve performance and prevent errors
  trackByReportType(index: number, report: any): string {
    return report?.type || index.toString();
  }
}
