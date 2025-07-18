import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ReportsServiceService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Existing method
  getBillSDemand(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/bills-demand`);
  }

  // Demand vs Collection APIs
  getDemandVsCollection(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reports/demand-vs-collection`);
  }

  // TODO: Implement filtered version when backend is ready
  // getDemandVsCollectionFiltered(filters: any): Observable<any> {
  //   let params = this.buildFilterParams(filters);
  //   return this.http.get<any>(`${this.apiUrl}/reports/demand-vs-collection`, { params });
  // }

  // Properties Overview APIs
  getPropertiesOverview(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reports/properties-overview`);
  }

  // TODO: Implement filtered version when backend is ready
  // getPropertiesOverviewFiltered(filters: any): Observable<any> {
  //   let params = this.buildFilterParams(filters);
  //   return this.http.get<any>(`${this.apiUrl}/reports/properties-overview`, { params });
  // }

  // Bills APIs
  getBillsData(month: number): Observable<any> {
    const params = new HttpParams().set("month", month.toString());
    return this.http.get<any>(`${this.apiUrl}/reports/bills-data`, { params });
  }

  // TODO: Implement filtered version when backend is ready
  // getBillsDataFiltered(filters: any): Observable<any> {
  //   let params = this.buildFilterParams(filters);
  //   return this.http.get<any>(`${this.apiUrl}/reports/bills-data`, { params });
  // }

  // Receipts APIs
  getReceiptsData(month: number): Observable<any> {
    const params = new HttpParams().set("month", month.toString());
    return this.http.get<any>(`${this.apiUrl}/reports/receipts-data`, {
      params,
    });
  }

  // TODO: Implement filtered version when backend is ready
  // getReceiptsDataFiltered(filters: any): Observable<any> {
  //   let params = this.buildFilterParams(filters);
  //   return this.http.get<any>(`${this.apiUrl}/reports/receipts-data`, { params });
  // }

  // RI Performance APIs
  getRIPerformanceData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reports/ri-performance`);
  }

  // TODO: Implement filtered version when backend is ready
  // getRIPerformanceDataFiltered(filters: any): Observable<any> {
  //   let params = this.buildFilterParams(filters);
  //   return this.http.get<any>(`${this.apiUrl}/reports/ri-performance`, { params });
  // }

  // Issue Notices APIs
  getIssueNoticesData(filters: any): Observable<any> {
    let params = new HttpParams();
    if (filters.property && filters.property !== "all") {
      params = params.set("property", filters.property);
    }
    if (filters.tenant && filters.tenant !== "all") {
      params = params.set("tenant", filters.tenant);
    }
    if (filters.division && filters.division !== "all") {
      params = params.set("division", filters.division);
    }
    if (filters.date) {
      params = params.set("date", filters.date.toISOString().split("T")[0]);
    }
    return this.http.get<any>(`${this.apiUrl}/reports/issue-notices`, {
      params,
    });
  }

  // TODO: Implement filtered version when backend is ready
  // getIssueNoticesDataFiltered(filters: any): Observable<any> {
  //   let params = this.buildFilterParams(filters);
  //   return this.http.get<any>(`${this.apiUrl}/reports/issue-notices`, { params });
  // }

  // Grievance APIs
  getGrievanceData(filters: any): Observable<any> {
    let params = new HttpParams();
    if (filters.property && filters.property !== "all") {
      params = params.set("property", filters.property);
    }
    if (filters.tenant && filters.tenant !== "all") {
      params = params.set("tenant", filters.tenant);
    }
    if (filters.division && filters.division !== "all") {
      params = params.set("division", filters.division);
    }
    if (filters.date) {
      params = params.set("date", filters.date.toISOString().split("T")[0]);
    }
    return this.http.get<any>(`${this.apiUrl}/reports/grievance-data`, {
      params,
    });
  }

  // TODO: Implement filtered version when backend is ready
  // getGrievanceDataFiltered(filters: any): Observable<any> {
  //   let params = this.buildFilterParams(filters);
  //   return this.http.get<any>(`${this.apiUrl}/reports/grievance-data`, { params });
  // }

  // Report Generation APIs
  generateReport(reportType: string, selectedDate?: Date): Observable<any> {
    const body: any = { reportType };
    if (selectedDate) {
      body.date = selectedDate.toISOString().split("T")[0];
    }
    return this.http.post<any>(`${this.apiUrl}/reports/generate`, body);
  }

  // TODO: Implement filtered version when backend is ready
  // generateReportWithFilters(reportType: string, filters: any, selectedDate?: Date): Observable<any> {
  //   const body: any = {
  //     reportType,
  //     filters: filters,
  //     userRole: localStorage.getItem('role')
  //   };
  //   if (selectedDate) {
  //     body.date = selectedDate.toISOString().split("T")[0];
  //   }
  //   return this.http.post<any>(`${this.apiUrl}/reports/generate-filtered`, body);
  // }

  // Specific Report APIs
  getDuePropertiesList(date?: Date): Observable<any> {
    let params = new HttpParams();
    if (date) {
      params = params.set("date", date.toISOString().split("T")[0]);
    }
    return this.http.get<any>(`${this.apiUrl}/reports/due-properties`, {
      params,
    });
  }

  getDueTenantsList(date?: Date): Observable<any> {
    let params = new HttpParams();
    if (date) {
      params = params.set("date", date.toISOString().split("T")[0]);
    }
    return this.http.get<any>(`${this.apiUrl}/reports/due-tenants`, { params });
  }

  getUserHistoryReport(date?: Date): Observable<any> {
    let params = new HttpParams();
    if (date) {
      params = params.set("date", date.toISOString().split("T")[0]);
    }
    return this.http.get<any>(`${this.apiUrl}/reports/user-history`, {
      params,
    });
  }

  getCancelledPropertiesDue(date?: Date): Observable<any> {
    let params = new HttpParams();
    if (date) {
      params = params.set("date", date.toISOString().split("T")[0]);
    }
    return this.http.get<any>(
      `${this.apiUrl}/reports/cancelled-properties-due`,
      { params },
    );
  }

  getGovernmentPropertiesDue(date?: Date): Observable<any> {
    let params = new HttpParams();
    if (date) {
      params = params.set("date", date.toISOString().split("T")[0]);
    }
    return this.http.get<any>(
      `${this.apiUrl}/reports/government-properties-due`,
      { params },
    );
  }

  getVacantPropertiesList(date?: Date): Observable<any> {
    let params = new HttpParams();
    if (date) {
      params = params.set("date", date.toISOString().split("T")[0]);
    }
    return this.http.get<any>(`${this.apiUrl}/reports/vacant-properties`, {
      params,
    });
  }

  getIssueNoticeReport(date?: Date): Observable<any> {
    let params = new HttpParams();
    if (date) {
      params = params.set("date", date.toISOString().split("T")[0]);
    }
    return this.http.get<any>(`${this.apiUrl}/reports/issue-notice-report`, {
      params,
    });
  }

  getRentalCollectionReport(date?: Date): Observable<any> {
    let params = new HttpParams();
    if (date) {
      params = params.set("date", date.toISOString().split("T")[0]);
    }
    return this.http.get<any>(`${this.apiUrl}/reports/rental-collection`, {
      params,
    });
  }

  getGSTReport(date?: Date): Observable<any> {
    let params = new HttpParams();
    if (date) {
      params = params.set("date", date.toISOString().split("T")[0]);
    }
    return this.http.get<any>(`${this.apiUrl}/reports/gst-report`, { params });
  }

  getTDSReport(date?: Date): Observable<any> {
    let params = new HttpParams();
    if (date) {
      params = params.set("date", date.toISOString().split("T")[0]);
    }
    return this.http.get<any>(`${this.apiUrl}/reports/tds-report`, { params });
  }

  // Export APIs
  exportReportToPDF(reportType: string, data: any): Observable<Blob> {
    const body = { reportType, data };
    return this.http.post(`${this.apiUrl}/reports/export/pdf`, body, {
      responseType: "blob",
    });
  }

  exportReportToExcel(reportType: string, data: any): Observable<Blob> {
    const body = { reportType, data };
    return this.http.post(`${this.apiUrl}/reports/export/excel`, body, {
      responseType: "blob",
    });
  }

  // Dashboard Summary APIs
  getDashboardSummary(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reports/dashboard-summary`);
  }

  // Real-time Updates APIs
  getRealtimeMetrics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reports/realtime-metrics`);
  }

  // Helper method to build filter parameters
  private buildFilterParams(filters: any): HttpParams {
    let params = new HttpParams();

    if (filters.startDate) {
      params = params.set(
        "startDate",
        filters.startDate.toISOString().split("T")[0],
      );
    }
    if (filters.endDate) {
      params = params.set(
        "endDate",
        filters.endDate.toISOString().split("T")[0],
      );
    }
    if (filters.selectedDivisions && filters.selectedDivisions.length > 0) {
      params = params.set("divisions", filters.selectedDivisions.join(","));
    }
    if (filters.selectedProperties && filters.selectedProperties.length > 0) {
      params = params.set("properties", filters.selectedProperties.join(","));
    }
    if (filters.selectedTenants && filters.selectedTenants.length > 0) {
      params = params.set("tenants", filters.selectedTenants.join(","));
    }
    if (filters.reportType && filters.reportType !== "all") {
      params = params.set("reportType", filters.reportType);
    }

    // Add user role for authorization
    const userRole = localStorage.getItem("role");
    if (userRole) {
      params = params.set("userRole", userRole);
    }

    return params;
  }
}
