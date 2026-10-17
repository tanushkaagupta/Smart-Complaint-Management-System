export type Status = 'Pending' | 'In Progress' | 'Resolved';
export type Priority = 'High' | 'Medium' | 'Low';

export type Complaint = {
  id: string;
  issue: string;
  category: string;
  description: string;
  location: string;
  reportedOn: string;
  priority: Priority;
  status: Status;
  reporter: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
  resolvedAt?: string;
};

export type SettingsState = {
  name: string;
  email: string;
  emailNotifications: boolean;
  newComplaintNotifications: boolean;
  statusNotifications: boolean;
  darkMode: boolean;
};

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
};

export type AnalyticsSummary = {
  totalComplaints: number;
  statusCounts: Record<Status, number>;
  priorityCounts: Record<Priority, number>;
  resolutionRate: string;
  avgResolutionTime: string;
  trendData: Array<{ name: string; received: number; resolved: number }>;
  statusData: Array<{ name: string; value: number; color: string }>;
  priorityData: Array<{ name: string; value: number; color: string }>;
  categoryData: Array<{ name: string; count: number }>;
};

const API_BASE = '/api';

export const api = {
  async getComplaints(params?: { search?: string; status?: string; priority?: string; category?: string }): Promise<Complaint[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.status && params.status !== 'All') query.append('status', params.status);
    if (params?.priority && params.priority !== 'All') query.append('priority', params.priority);
    if (params?.category && params.category !== 'All') query.append('category', params.category);

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${API_BASE}/complaints${qs}`);
    if (!res.ok) throw new Error(`Failed to fetch complaints: ${res.statusText}`);
    const json = await res.json();
    return json.data;
  },

  async getComplaintById(id: string): Promise<Complaint> {
    const res = await fetch(`${API_BASE}/complaints/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error(`Complaint not found: ${res.statusText}`);
    const json = await res.json();
    return json.data;
  },

  async createComplaint(data: Omit<Complaint, 'id' | 'reportedOn' | 'status'> & { id?: string }): Promise<Complaint> {
    const res = await fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create complaint');
    }
    const json = await res.json();
    return json.data;
  },

  async updateComplaintStatus(id: string, status: Status): Promise<Complaint> {
    const res = await fetch(`${API_BASE}/complaints/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error(`Failed to update complaint status: ${res.statusText}`);
    const json = await res.json();
    return json.data;
  },

  async deleteComplaint(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/complaints/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete complaint');
    return true;
  },

  async getAnalytics(): Promise<AnalyticsSummary> {
    const res = await fetch(`${API_BASE}/analytics/summary`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    const json = await res.json();
    return json.data;
  },

  async getSettings(): Promise<SettingsState> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    const json = await res.json();
    return json.data;
  },

  async updateSettings(settings: Partial<SettingsState>): Promise<SettingsState> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('Failed to update settings');
    const json = await res.json();
    return json.data;
  },

  async getNotifications(): Promise<{ notifications: NotificationItem[]; unreadCount: number }> {
    const res = await fetch(`${API_BASE}/notifications`);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    const json = await res.json();
    return { notifications: json.data, unreadCount: json.unreadCount };
  },

  async markAllNotificationsRead(): Promise<boolean> {
    const res = await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'PATCH',
    });
    return res.ok;
  }
};
