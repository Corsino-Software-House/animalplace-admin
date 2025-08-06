import { REPORTS_ROUTE, REPORTS_STATISTICS_ROUTE, REPORTS_MY_ROUTE } from "@/lib/api-routes";
import { api } from "@/lib/api";
import { 
  Report, 
  ReportStatistics, 
  ReportsResponse, 
  CreateReportDto, 
  UpdateReportDto, 
  FilterReportDto,
  ReportStatus
} from "@/types/reports";

export const reportsService = {
  // Get all reports with pagination and filters
  async getReports(
    page: number = 1, 
    limit: number = 10, 
    filters?: FilterReportDto
  ): Promise<ReportsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });
    
    const response = await api.get<ReportsResponse>(
      `${REPORTS_ROUTE()}?${params.toString()}`
    );
    return response.data;
  },

  // Get reports statistics
  async getStatistics(): Promise<ReportStatistics> {
    const response = await api.get<ReportStatistics>(REPORTS_STATISTICS_ROUTE());
    return response.data;
  },  

  // Get user's own reports
  async getMyReports(page: number = 1, limit: number = 10): Promise<ReportsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    const response = await api.get<ReportsResponse>(
      `${REPORTS_MY_ROUTE()}?${params.toString()}`
    );
    return response.data;
  },

  // Get single report by ID
  async getReport(id: string): Promise<Report> {
    const response = await api.get<Report>(`${REPORTS_ROUTE()}/${id}`);
    return response.data;
  },

  // Create new report
  async createReport(data: CreateReportDto): Promise<Report> {
    const response = await api.post<Report>(REPORTS_ROUTE(), data);
    return response.data;
  },

  // Update report (admin only)
  async updateReport(id: string, data: UpdateReportDto): Promise<Report> {
    const response = await api.patch<Report>(`${REPORTS_ROUTE()}/${id}`, data);
    return response.data;
  },

  // Delete report (admin only)
  async deleteReport(id: string): Promise<void> {
    await api.delete(`${REPORTS_ROUTE()}/${id}`);
  },

  // Respond to a report (admin only)
  async respondToReport(id: string, response: string): Promise<Report> {
    const response_data = await api.patch<Report>(`${REPORTS_ROUTE()}/${id}`, {
      status: 'in_progress',
      adminResponse: response,
      respondedBy: 'Admin', // This should come from auth context
    });
    return response_data.data;
  },

  // Complete/Resolve a report (admin only)
  async completeReport(id: string, response?: string): Promise<Report> {
    const response_data = await api.patch<Report>(`${REPORTS_ROUTE()}/${id}`, {
      status: 'resolved',
      ...(response && { adminResponse: response }),
      respondedBy: 'Admin', // This should come from auth context
    });
    return response_data.data;
  },

  // Change report status
  async updateReportStatus(id: string, status: 'pending' | 'in_progress' | 'resolved' | 'closed' | 'rejected'): Promise<Report> {
    const response = await api.patch<Report>(`${REPORTS_ROUTE()}/${id}`, {
      status,
    });
    return response.data;
  },

  // Helper methods for specific status filters
  async getPendingReports(page: number = 1, limit: number = 10): Promise<ReportsResponse> {
    return this.getReports(page, limit, { status: 'pending' as ReportStatus });
  },

  async getInProgressReports(page: number = 1, limit: number = 10): Promise<ReportsResponse> {
    return this.getReports(page, limit, { status: 'in_progress' as ReportStatus });
  },

  async getResolvedReports(page: number = 1, limit: number = 10): Promise<ReportsResponse> {
    return this.getReports(page, limit, { status: 'resolved' as ReportStatus });
  },
};
