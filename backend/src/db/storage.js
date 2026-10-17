import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

const INITIAL_COMPLAINTS = [
  {
    id: '#C-1024',
    issue: 'Water leakage in main building',
    category: 'Maintenance',
    description: 'A persistent leak has been reported near the main building entrance and needs attention before it causes further damage.',
    location: 'Block A, 2nd Floor',
    reportedOn: '16 Oct 2026, 10:24 AM',
    priority: 'High',
    status: 'Pending',
    reporter: 'Aarav Gupta',
    email: 'aarav.g@example.com',
    createdAt: '2026-10-16T10:24:00.000Z',
    updatedAt: '2026-10-16T10:24:00.000Z'
  },
  {
    id: '#C-1023',
    issue: 'Street light not working',
    category: 'Electrical',
    description: 'The street light on Road 3 has not been working for several nights, reducing visibility for residents.',
    location: 'Sector 12, Road 3',
    reportedOn: '16 Oct 2026, 09:48 AM',
    priority: 'Medium',
    status: 'In Progress',
    reporter: 'Meera Shah',
    email: 'meera.s@example.com',
    createdAt: '2026-10-16T09:48:00.000Z',
    updatedAt: '2026-10-16T10:15:00.000Z'
  },
  {
    id: '#C-1022',
    issue: 'Garbage not collected',
    category: 'Sanitation',
    description: 'Household waste collection was missed for two consecutive days near the park entrance.',
    location: 'Sector 7, Near Park',
    reportedOn: '16 Oct 2026, 08:32 AM',
    priority: 'Low',
    status: 'Resolved',
    reporter: 'Rohan Iyer',
    email: 'rohan.i@example.com',
    createdAt: '2026-10-16T08:32:00.000Z',
    updatedAt: '2026-10-16T11:00:00.000Z',
    resolvedAt: '2026-10-16T11:00:00.000Z'
  },
  {
    id: '#C-1021',
    issue: 'Broken bench in park',
    category: 'Public Spaces',
    description: 'One of the benches near the walking path is damaged and should be repaired for public safety.',
    location: 'Central Park',
    reportedOn: '15 Oct 2026, 06:17 PM',
    priority: 'Medium',
    status: 'Pending',
    reporter: 'Nisha Verma',
    email: 'nisha.v@example.com',
    createdAt: '2026-10-15T18:17:00.000Z',
    updatedAt: '2026-10-15T18:17:00.000Z'
  },
  {
    id: '#C-1020',
    issue: 'Power outage',
    category: 'Electrical',
    description: 'The third-floor apartments experienced an unexpected power interruption this afternoon.',
    location: 'Block C, 3rd Floor',
    reportedOn: '15 Oct 2026, 04:12 PM',
    priority: 'High',
    status: 'In Progress',
    reporter: 'Kabir Singh',
    email: 'kabir.s@example.com',
    createdAt: '2026-10-15T16:12:00.000Z',
    updatedAt: '2026-10-15T17:00:00.000Z'
  },
  {
    id: '#C-1019',
    issue: 'Road damage',
    category: 'Roads',
    description: 'A deep pothole has formed on the main road and is creating a hazard for two-wheelers.',
    location: 'Sector 5, Main Road',
    reportedOn: '15 Oct 2026, 11:03 AM',
    priority: 'Low',
    status: 'Resolved',
    reporter: 'Anika Rao',
    email: 'anika.r@example.com',
    createdAt: '2026-10-15T11:03:00.000Z',
    updatedAt: '2026-10-15T14:30:00.000Z',
    resolvedAt: '2026-10-15T14:30:00.000Z'
  },
  {
    id: '#C-1018',
    issue: 'Noise complaint',
    category: 'Community',
    description: 'Loud construction noise has continued outside permitted hours for the past three evenings.',
    location: 'Block B, 1st Floor',
    reportedOn: '14 Oct 2026, 09:26 PM',
    priority: 'Medium',
    status: 'Pending',
    reporter: 'Dev Malhotra',
    email: 'dev.m@example.com',
    createdAt: '2026-10-14T21:26:00.000Z',
    updatedAt: '2026-10-14T21:26:00.000Z'
  },
  {
    id: '#C-1017',
    issue: 'Broken water pipe',
    category: 'Maintenance',
    description: 'A water pipe appears to be broken near the market and is flooding the walkway.',
    location: 'Sector 9, Near Market',
    reportedOn: '14 Oct 2026, 03:45 PM',
    priority: 'High',
    status: 'In Progress',
    reporter: 'Tara Joshi',
    email: 'tara.j@example.com',
    createdAt: '2026-10-14T15:45:00.000Z',
    updatedAt: '2026-10-14T16:00:00.000Z'
  }
];

const INITIAL_SETTINGS = {
  name: 'Aarav Gupta',
  email: 'admin@complainthub.com',
  emailNotifications: true,
  newComplaintNotifications: true,
  statusNotifications: true,
  darkMode: false
};

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'New Complaint Filed',
    message: 'Water leakage in main building (#C-1024) needs review.',
    createdAt: '2026-10-16T10:25:00.000Z',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Weekly Summary Ready',
    message: 'Weekly service summary and analytics report is ready.',
    createdAt: '2026-10-16T09:00:00.000Z',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Complaint Resolved',
    message: 'Garbage not collected (#C-1022) was marked as Resolved.',
    createdAt: '2026-10-16T08:35:00.000Z',
    read: true
  }
];

class Storage {
  constructor() {
    this.ensureInitialized();
  }

  ensureInitialized() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      const initialData = {
        complaints: INITIAL_COMPLAINTS,
        settings: INITIAL_SETTINGS,
        notifications: INITIAL_NOTIFICATIONS,
        activities: [
          {
            id: 'act-1',
            type: 'complaint_created',
            complaintId: '#C-1024',
            description: 'New complaint reported by Aarav Gupta',
            timestamp: '2026-10-16T10:24:00.000Z'
          }
        ]
      };
      this.saveData(initialData);
    }
  }

  loadData() {
    try {
      this.ensureInitialized();
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (err) {
      console.error('Error reading database file:', err);
      return {
        complaints: INITIAL_COMPLAINTS,
        settings: INITIAL_SETTINGS,
        notifications: INITIAL_NOTIFICATIONS,
        activities: []
      };
    }
  }

  saveData(data) {
    try {
      const tempPath = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
      return true;
    } catch (err) {
      console.error('Error saving database file:', err);
      return false;
    }
  }

  // Complaints
  getComplaints() {
    const data = this.loadData();
    return data.complaints || [];
  }

  getComplaintById(id) {
    const normalized = id.startsWith('#') ? id : `#${id}`;
    const complaints = this.getComplaints();
    return complaints.find(c => c.id === normalized || c.id === id);
  }

  createComplaint(complaintData) {
    const data = this.loadData();
    
    // Auto-generate ID if not provided
    let newId = complaintData.id;
    if (!newId) {
      // Find highest existing numeric ID
      let maxNum = 1024;
      for (const c of data.complaints) {
        const match = c.id.match(/#?C-(\d+)/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) maxNum = num;
        }
      }
      newId = `#C-${maxNum + 1}`;
    }

    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(now);

    const newComplaint = {
      id: newId,
      issue: complaintData.issue,
      category: complaintData.category || 'Maintenance',
      description: complaintData.description,
      location: complaintData.location,
      reportedOn: complaintData.reportedOn || formattedDate,
      priority: complaintData.priority || 'Medium',
      status: complaintData.status || 'Pending',
      reporter: complaintData.reporter,
      email: complaintData.email || `${complaintData.reporter.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    data.complaints.unshift(newComplaint);

    // Add activity
    data.activities.unshift({
      id: `act-${Date.now()}`,
      type: 'complaint_created',
      complaintId: newId,
      description: `New complaint filed: "${newComplaint.issue}" by ${newComplaint.reporter}`,
      timestamp: now.toISOString()
    });

    // Add notification
    data.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: 'New Complaint Submitted',
      message: `${newComplaint.issue} (${newComplaint.id}) reported in ${newComplaint.location}.`,
      createdAt: now.toISOString(),
      read: false
    });

    this.saveData(data);
    return newComplaint;
  }

  updateComplaint(id, updates) {
    const data = this.loadData();
    const normalized = id.startsWith('#') ? id : `#${id}`;
    const index = data.complaints.findIndex(c => c.id === normalized || c.id === id);
    if (index === -1) return null;

    const existing = data.complaints[index];
    const now = new Date().toISOString();

    const updated = {
      ...existing,
      ...updates,
      id: existing.id, // prevent changing ID
      updatedAt: now
    };

    if (updates.status === 'Resolved' && existing.status !== 'Resolved') {
      updated.resolvedAt = now;
    }

    data.complaints[index] = updated;

    // Add activity for status changes
    if (updates.status && updates.status !== existing.status) {
      data.activities.unshift({
        id: `act-${Date.now()}`,
        type: 'status_updated',
        complaintId: existing.id,
        description: `Status changed from ${existing.status} to ${updates.status}`,
        timestamp: now
      });

      data.notifications.unshift({
        id: `notif-${Date.now()}`,
        title: 'Status Updated',
        message: `${existing.id} status changed to ${updates.status}.`,
        createdAt: now,
        read: false
      });
    }

    this.saveData(data);
    return updated;
  }

  deleteComplaint(id) {
    const data = this.loadData();
    const normalized = id.startsWith('#') ? id : `#${id}`;
    const initialLength = data.complaints.length;
    data.complaints = data.complaints.filter(c => c.id !== normalized && c.id !== id);

    if (data.complaints.length === initialLength) {
      return false;
    }

    this.saveData(data);
    return true;
  }

  // Settings
  getSettings() {
    const data = this.loadData();
    return data.settings || INITIAL_SETTINGS;
  }

  updateSettings(newSettings) {
    const data = this.loadData();
    data.settings = {
      ...data.settings,
      ...newSettings
    };
    this.saveData(data);
    return data.settings;
  }

  // Notifications
  getNotifications() {
    const data = this.loadData();
    return data.notifications || [];
  }

  markNotificationAsRead(id) {
    const data = this.loadData();
    const notif = data.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.saveData(data);
      return true;
    }
    return false;
  }

  markAllNotificationsAsRead() {
    const data = this.loadData();
    data.notifications.forEach(n => { n.read = true; });
    this.saveData(data);
    return true;
  }

  // Activities
  getActivities(limit = 20) {
    const data = this.loadData();
    return (data.activities || []).slice(0, limit);
  }
}

export const storage = new Storage();
