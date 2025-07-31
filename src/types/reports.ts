export enum ReportType {
  BUG = 'bug',
  FEATURE_REQUEST = 'feature_request',
  SUPPORT = 'support',
  COMPLAINT = 'complaint',
  SUGGESTION = 'suggestion',
  OTHER = 'other',
}

export enum ReportStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  REJECTED = 'rejected',
}

export enum ReportPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface Report {
  id: string;
  title: string;
  description: string;
  type: ReportType;
  status: ReportStatus;
  priority: ReportPriority;
  contactEmail?: string;
  contactPhone?: string;
  attachments?: string[];
  adminResponse?: string;
  responseDate?: string;
  respondedBy?: string;
  userId?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ReportStatistics {
  total: number;
  byStatus: { [key: string]: number };
  byType: { [key: string]: number };
  byPriority: { [key: string]: number };
}

export interface ReportsResponse {
  reports: Report[];
  total: number;
  totalPages: number;
}

export interface CreateReportDto {
  title: string;
  description: string;
  type: ReportType;
  contactEmail?: string;
  contactPhone?: string;
  attachments?: string[];
}

export interface UpdateReportDto {
  title?: string;
  description?: string;
  type?: ReportType;
  status?: ReportStatus;
  priority?: ReportPriority;
  adminResponse?: string;
  respondedBy?: string;
}

export interface FilterReportDto {
  type?: ReportType;
  status?: ReportStatus;
  priority?: ReportPriority;
  userId?: string;
  startDate?: string;
  endDate?: string;
}
