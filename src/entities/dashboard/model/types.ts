export interface DashboardSubmission {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  read: boolean;
}

export interface DashboardStats {
  students: { total: number };
  events: { active: number };
  submissions: {
    unread: number;
    pending: number;
    total: number;
  };
  news: { total: number };
  projects: { total: number };
  contacts: { unread: number };
}

export interface SystemStatus {
  status: 'healthy' | 'unhealthy';
  database: 'healthy' | 'unhealthy';
  uptime: number;
  timestamp: string;
  memory: {
    used: number;
    total: number;
    unit: 'MB';
  };
}

export interface DashboardResponse {
  stats: DashboardStats;
  system: SystemStatus;
  recentSubmissions: DashboardSubmission[];
}

export interface CleanResponse {
  deletedCount: number;
}
