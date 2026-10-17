import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { BrowserRouter, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Clock3,
  ClipboardList,
  Filter,
  Home,
  Leaf,
  ListFilter,
  Menu,
  MessageSquareText,
  Moon,
  Plus,
  RefreshCw,
  Search,
  Settings as SettingsIcon,
  ShieldCheck,
  SlidersHorizontal,
  Sun,
  Trash2,
  UserRound,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import {
  api,
  type Complaint,
  type Status,
  type Priority,
  type SettingsState,
  type NotificationItem
} from './services/api';

const initialComplaints: Complaint[] = [
  { id: '#C-1024', issue: 'Water leakage in main building', category: 'Maintenance', description: 'A persistent leak has been reported near the main building entrance and needs attention before it causes further damage.', location: 'Block A, 2nd Floor', reportedOn: '16 Oct 2026, 10:24 AM', priority: 'High', status: 'Pending', reporter: 'Aarav Gupta', email: 'aarav.g@example.com' },
  { id: '#C-1023', issue: 'Street light not working', category: 'Electrical', description: 'The street light on Road 3 has not been working for several nights, reducing visibility for residents.', location: 'Sector 12, Road 3', reportedOn: '16 Oct 2026, 09:48 AM', priority: 'Medium', status: 'In Progress', reporter: 'Meera Shah', email: 'meera.s@example.com' },
  { id: '#C-1022', issue: 'Garbage not collected', category: 'Sanitation', description: 'Household waste collection was missed for two consecutive days near the park entrance.', location: 'Sector 7, Near Park', reportedOn: '16 Oct 2026, 08:32 AM', priority: 'Low', status: 'Resolved', reporter: 'Rohan Iyer', email: 'rohan.i@example.com' },
  { id: '#C-1021', issue: 'Broken bench in park', category: 'Public Spaces', description: 'One of the benches near the walking path is damaged and should be repaired for public safety.', location: 'Central Park', reportedOn: '15 Oct 2026, 06:17 PM', priority: 'Medium', status: 'Pending', reporter: 'Nisha Verma', email: 'nisha.v@example.com' },
  { id: '#C-1020', issue: 'Power outage', category: 'Electrical', description: 'The third-floor apartments experienced an unexpected power interruption this afternoon.', location: 'Block C, 3rd Floor', reportedOn: '15 Oct 2026, 04:12 PM', priority: 'High', status: 'In Progress', reporter: 'Kabir Singh', email: 'kabir.s@example.com' },
  { id: '#C-1019', issue: 'Road damage', category: 'Roads', description: 'A deep pothole has formed on the main road and is creating a hazard for two-wheelers.', location: 'Sector 5, Main Road', reportedOn: '15 Oct 2026, 11:03 AM', priority: 'Low', status: 'Resolved', reporter: 'Anika Rao', email: 'anika.r@example.com' },
  { id: '#C-1018', issue: 'Noise complaint', category: 'Community', description: 'Loud construction noise has continued outside permitted hours for the past three evenings.', location: 'Block B, 1st Floor', reportedOn: '14 Oct 2026, 09:26 PM', priority: 'Medium', status: 'Pending', reporter: 'Dev Malhotra', email: 'dev.m@example.com' },
  { id: '#C-1017', issue: 'Broken water pipe', category: 'Maintenance', description: 'A water pipe appears to be broken near the market and is flooding the walkway.', location: 'Sector 9, Near Market', reportedOn: '14 Oct 2026, 03:45 PM', priority: 'High', status: 'In Progress', reporter: 'Tara Joshi', email: 'tara.j@example.com' },
];

const initialNotifications: NotificationItem[] = [
  { id: 'notif-1', title: 'New Complaint Filed', message: 'Water leakage in main building (#C-1024) needs review.', createdAt: '10m ago', read: false },
  { id: 'notif-2', title: 'Weekly Summary Ready', message: 'Weekly service summary is ready.', createdAt: '1h ago', read: false },
  { id: 'notif-3', title: 'Complaint Resolved', message: 'Garbage not collected (#C-1022) marked resolved.', createdAt: '2h ago', read: true }
];

const navItems = [
  { label: 'Dashboard', to: '/', icon: Home },
  { label: 'Complaint Management', to: '/complaints', icon: ClipboardList },
  { label: 'Analytics', to: '/analytics', icon: BarChart3 },
  { label: 'Settings', to: '/settings', icon: SettingsIcon },
];

function App() {
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('complainthub-complaints');
    return saved ? JSON.parse(saved) as Complaint[] : initialComplaints;
  });
  const [settings, setSettings] = useState<SettingsState>(() => {
    const saved = localStorage.getItem('complainthub-settings');
    return saved ? JSON.parse(saved) as SettingsState : { name: 'Aarav Gupta', email: 'admin@complainthub.com', emailNotifications: true, newComplaintNotifications: true, statusNotifications: true, darkMode: false };
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [toast, setToast] = useState('');

  // Initial load from backend API
  const refreshBackendData = () => {
    api.getComplaints()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setComplaints(data);
        }
        setServerOnline(true);
      })
      .catch(() => {
        setServerOnline(false);
      });

    api.getSettings()
      .then((data) => {
        if (data) setSettings(data);
      })
      .catch(() => {});

    api.getNotifications()
      .then((res) => {
        if (res?.notifications) setNotifications(res.notifications);
      })
      .catch(() => {});
  };

  useEffect(() => {
    refreshBackendData();
  }, []);

  // Sync to localStorage as offline fallback
  useEffect(() => localStorage.setItem('complainthub-complaints', JSON.stringify(complaints)), [complaints]);
  useEffect(() => localStorage.setItem('complainthub-settings', JSON.stringify(settings)), [settings]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const addComplaint = async (newComplaint: Omit<Complaint, 'id' | 'reportedOn' | 'status'> & { id?: string }) => {
    try {
      const created = await api.createComplaint(newComplaint);
      setComplaints((current) => [created, ...current]);
      setToast('Complaint registered and saved to database!');
      setServerOnline(true);
      // Refresh notifications
      api.getNotifications().then((res) => { if (res?.notifications) setNotifications(res.notifications); }).catch(() => {});
    } catch {
      const id = `#C-${1025 + Math.floor(Math.random() * 800)}`;
      const fallback: Complaint = {
        ...newComplaint,
        id,
        email: newComplaint.email || `${newComplaint.reporter.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        reportedOn: new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date()),
        status: 'Pending'
      };
      setComplaints((current) => [fallback, ...current]);
      setToast('Complaint added locally');
      setServerOnline(false);
    }
  };

  const updateStatus = async (id: string, status: Status) => {
    // Optimistic UI update
    setComplaints((current) => current.map((item) => item.id === id ? { ...item, status } : item));
    try {
      await api.updateComplaintStatus(id, status);
      setToast(`Complaint status updated to ${status}`);
      setServerOnline(true);
    } catch {
      setToast('Complaint status updated locally');
      setServerOnline(false);
    }
  };

  const deleteComplaint = async (id: string) => {
    setComplaints((current) => current.filter((item) => item.id !== id));
    try {
      await api.deleteComplaint(id);
      setToast('Complaint deleted from database');
      setServerOnline(true);
    } catch {
      setToast('Complaint deleted locally');
      setServerOnline(false);
    }
  };

  const handleSaveSettings = async (next: SettingsState) => {
    setSettings(next);
    try {
      await api.updateSettings(next);
      setToast('Settings saved to database');
      setServerOnline(true);
    } catch {
      setToast('Settings saved locally');
      setServerOnline(false);
    }
  };

  const handleClearNotifications = async () => {
    setNotifications((curr) => curr.map((n) => ({ ...n, read: true })));
    try {
      await api.markAllNotificationsRead();
    } catch {}
  };

  return (
    <BrowserRouter>
      <div className={settings.darkMode ? 'app-shell dark-mode' : 'app-shell'}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="app-main">
          <Header
            onMenu={() => setMobileOpen(true)}
            notificationOpen={notificationOpen}
            setNotificationOpen={setNotificationOpen}
            settings={settings}
            serverOnline={serverOnline}
            notifications={notifications}
            onClearNotifications={handleClearNotifications}
            onRefresh={refreshBackendData}
          />
          <main className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard complaints={complaints} />} />
              <Route path="/complaints" element={<ComplaintsPage complaints={complaints} onAdd={addComplaint} />} />
              <Route path="/complaints/:complaintId" element={<ComplaintDetails complaints={complaints} onStatusChange={updateStatus} onDelete={deleteComplaint} />} />
              <Route path="/analytics" element={<Analytics complaints={complaints} />} />
              <Route path="/settings" element={<Settings settings={settings} onSave={handleSaveSettings} />} />
            </Routes>
          </main>
        </div>
        {toast && <div className="toast"><Check size={16} /> {toast}</div>}
      </div>
    </BrowserRouter>
  );
}

function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  return <>
    {mobileOpen && <button className="mobile-overlay" aria-label="Close navigation" onClick={onClose} />}
    <aside className={mobileOpen ? 'sidebar sidebar-open' : 'sidebar'}>
      <div className="brand"><span className="brand-mark"><Leaf size={20} fill="currentColor" /></span><span>Complaint<span>Hub</span></span></div>
      <nav className="nav-list" aria-label="Main navigation">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'} onClick={onClose} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Icon size={19} />
            <span>{label}</span>
            {label === 'Complaint Management' && <ChevronRight className="nav-chevron" size={16} />}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <Building2 size={29} />
        <div>
          <strong>Better Services</strong>
          <span>A Stronger Community</span>
        </div>
      </div>
    </aside>
  </>;
}

function Header({
  onMenu,
  notificationOpen,
  setNotificationOpen,
  settings,
  serverOnline,
  notifications,
  onClearNotifications,
  onRefresh
}: {
  onMenu: () => void;
  notificationOpen: boolean;
  setNotificationOpen: (open: boolean) => void;
  settings: SettingsState;
  serverOnline: boolean | null;
  notifications: NotificationItem[];
  onClearNotifications: () => void;
  onRefresh: () => void;
}) {
  const location = useLocation();
  const current = navItems.find((item) => item.to === location.pathname)?.label;
  const date = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(2026, 9, 16));
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="topbar">
      <button className="icon-button menu-button" aria-label="Open navigation" onClick={onMenu}><Menu size={21} /></button>
      <div className="mobile-page-title">{current}</div>
      <div className="topbar-spacer" />

      {/* Backend Status indicator */}
      <div
        className={`backend-pill ${serverOnline ? 'online' : 'offline'}`}
        title={serverOnline ? 'Connected to REST Backend API (http://localhost:5000)' : 'Running in Offline/Local Mode'}
      >
        <span className="status-dot" />
        <span>{serverOnline ? 'Backend Online' : 'Local Mode'}</span>
      </div>

      <button className="icon-button" title="Refresh data from server" onClick={onRefresh} aria-label="Refresh data">
        <RefreshCw size={16} />
      </button>

      <div className="topbar-date"><CalendarDays size={16} /> {date}</div>

      <div className="notification-wrap">
        <button className="icon-button notification-button" aria-label="Notifications" onClick={() => setNotificationOpen(!notificationOpen)}>
          <Bell size={19} />
          {unreadCount > 0 && <span className="notification-dot" />}
        </button>
        {notificationOpen && (
          <div className="notification-popover">
            <div className="notif-header">
              <strong>Notifications ({unreadCount} new)</strong>
              {unreadCount > 0 && (
                <button className="notif-clear-btn" onClick={onClearNotifications}>Mark all read</button>
              )}
            </div>
            {notifications.slice(0, 4).map((notif) => (
              <div key={notif.id} className="notif-item">
                <strong>{notif.title}</strong>
                <p>{notif.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="profile-chip">
        <span className="avatar">{settings.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>
        <span className="profile-name">{settings.name}</span>
        <ChevronDown size={15} />
      </div>
    </header>
  );
}

function PageHeading({ eyebrow, title, subtitle, action }: { eyebrow?: string; title: string; subtitle: string; action?: ReactNode }) {
  return <div className="page-heading"><div><p className="eyebrow">{eyebrow ?? 'Overview'}</p><h1>{title}</h1><p className="page-subtitle">{subtitle}</p></div>{action}</div>;
}

function Dashboard({ complaints }: { complaints: Complaint[] }) {
  const navigate = useNavigate();
  const counts = countStatuses(complaints);
  const cards = [
    { label: 'Total Complaints', value: complaints.length, icon: ClipboardList, trend: '12%', note: 'vs. last week' },
    { label: 'Pending', value: counts.Pending, icon: Clock3, trend: '8%', note: 'vs. last week' },
    { label: 'Resolved', value: counts.Resolved, icon: CircleCheck, trend: '15%', note: 'vs. last week' },
    { label: 'In Progress', value: counts['In Progress'], icon: Users, trend: '5%', note: 'vs. last week' }
  ];
  return <>
    <PageHeading eyebrow="Dashboard" title="Good Morning, Admin!" subtitle="Here's what's happening with your complaints today." />
    <div className="metrics-grid">{cards.map(({ label, value, icon: Icon, trend, note }) => <MetricCard key={label} label={label} value={value} icon={<Icon size={21} />} trend={trend} note={note} />)}</div>
    <section className="panel recent-panel">
      <div className="panel-header">
        <div className="section-title"><span className="section-icon"><ListFilter size={18} /></span><h2>Recent Complaints</h2></div>
        <button className="text-button" onClick={() => navigate('/complaints')}>View All <ArrowRight size={15} /></button>
      </div>
      <ComplaintTable complaints={complaints.slice(0, 8)} compact />
    </section>
  </>;
}

function MetricCard({ label, value, icon, trend, note }: { label: string; value: string | number; icon: ReactNode; trend: string; note: string }) {
  return <div className="metric-card"><span className="metric-icon">{icon}</span><div className="metric-label">{label}</div><div className="metric-value">{value}</div><div className="metric-trend"><span>↗ {trend}</span> {note}</div></div>;
}

function ComplaintTable({ complaints, compact = false }: { complaints: Complaint[]; compact?: boolean }) {
  const navigate = useNavigate();
  if (!complaints.length) return <EmptyState title="No complaints found" message="Try adjusting your search or filters to find what you need." />;
  return <>
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Issue</th>
            <th>Location</th>
            <th>Reported On</th>
            <th>Priority</th>
            <th>Status</th>
            <th aria-label="Action" />
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint) => (
            <tr key={complaint.id} onClick={() => navigate(`/complaints/${encodeURIComponent(complaint.id)}`)} tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter') navigate(`/complaints/${encodeURIComponent(complaint.id)}`); }}>
              <td className="id-cell">{complaint.id}</td>
              <td className="issue-cell"><strong>{complaint.issue}</strong><small>{complaint.category}</small></td>
              <td>{complaint.location}</td>
              <td>{complaint.reportedOn}</td>
              <td><PriorityBadge priority={complaint.priority} /></td>
              <td><StatusBadge status={complaint.status} /></td>
              <td className="arrow-cell"><ArrowRight size={16} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="mobile-complaint-list">
      {complaints.map((complaint) => (
        <button className="mobile-complaint-card" key={complaint.id} onClick={() => navigate(`/complaints/${encodeURIComponent(complaint.id)}`)}>
          <div className="mobile-card-top"><span className="id-cell">{complaint.id}</span><ArrowRight size={16} /></div>
          <strong>{complaint.issue}</strong>
          <span className="mobile-location">{complaint.location}</span>
          <div className="badge-row"><PriorityBadge priority={complaint.priority} /><StatusBadge status={complaint.status} /></div>
          <small>{complaint.reportedOn}</small>
        </button>
      ))}
    </div>
    {compact && <div className="table-footnote">Showing the latest {complaints.length} complaints</div>}
  </>;
}

function PriorityBadge({ priority }: { priority: Priority }) { return <span className={`badge priority-${priority.toLowerCase()}`}>{priority}</span>; }
function StatusBadge({ status }: { status: Status }) { return <span className={`badge status-${status.toLowerCase().replace(' ', '-')}`}>{status}</span>; }
function EmptyState({ title, message }: { title: string; message: string }) { return <div className="empty-state"><span className="empty-icon"><Search size={22} /></span><h3>{title}</h3><p>{message}</p></div>; }
function countStatuses(complaints: Complaint[]) { return complaints.reduce<Record<Status, number>>((acc, complaint) => { if (acc[complaint.status] !== undefined) acc[complaint.status] += 1; return acc; }, { Pending: 0, 'In Progress': 0, Resolved: 0 }); }

function ComplaintsPage({ complaints, onAdd }: { complaints: Complaint[]; onAdd: (complaint: Omit<Complaint, 'id' | 'reportedOn' | 'status'> & { id?: string }) => void }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'All' | Status>('All');
  const [priority, setPriority] = useState<'All' | Priority>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const counts = countStatuses(complaints);
  const filtered = useMemo(() => complaints.filter((complaint) => {
    const haystack = `${complaint.id} ${complaint.issue} ${complaint.location} ${complaint.reporter} ${complaint.category}`.toLowerCase();
    return haystack.includes(search.toLowerCase()) && (status === 'All' || complaint.status === status) && (priority === 'All' || complaint.priority === priority);
  }), [complaints, priority, search, status]);

  return <>
    <PageHeading eyebrow="Workspace" title="Complaint Management" subtitle="Manage, track, and resolve reported complaints." action={<button className="primary-button" onClick={() => setModalOpen(true)}><Plus size={17} /> Add Complaint</button>} />
    <div className="management-summary">{[['Total Complaints', complaints.length], ['Pending', counts.Pending], ['In Progress', counts['In Progress']], ['Resolved', counts.Resolved]].map(([label, value]) => <div className="mini-stat" key={label as string}><span>{label}</span><strong>{value}</strong></div>)}</div>
    <section className="panel management-panel">
      <div className="filters-top">
        <div className="search-field"><Search size={17} /><input aria-label="Search complaints" placeholder="Search by ID, issue, reporter, or location" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
        <div className="select-group">
          <label>Status<select value={status} onChange={(event) => setStatus(event.target.value as 'All' | Status)}><option>All</option><option>Pending</option><option>In Progress</option><option>Resolved</option></select></label>
          <label>Priority<select value={priority} onChange={(event) => setPriority(event.target.value as 'All' | Priority)}><option>All</option><option>High</option><option>Medium</option><option>Low</option></select></label>
          <button className="secondary-button clear-button" onClick={() => { setSearch(''); setStatus('All'); setPriority('All'); }}><SlidersHorizontal size={16} /> Reset</button>
        </div>
      </div>
      <div className="management-heading"><div><h2>All Complaints</h2><p>{filtered.length} of {complaints.length} records</p></div><Filter size={18} /></div>
      <ComplaintTable complaints={filtered} />
    </section>
    {modalOpen && <ComplaintForm onClose={() => setModalOpen(false)} onSave={(complaint) => { onAdd(complaint); setModalOpen(false); }} />}
  </>;
}

function ComplaintForm({ onClose, onSave }: { onClose: () => void; onSave: (complaint: Omit<Complaint, 'id' | 'reportedOn' | 'status'> & { id?: string }) => void }) {
  const [form, setForm] = useState({ issue: '', category: 'Maintenance', description: '', location: '', priority: 'Medium' as Priority, reporter: '' });
  const [error, setError] = useState('');
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.issue.trim() || !form.description.trim() || !form.location.trim() || !form.reporter.trim()) { setError('Please complete all required fields.'); return; }
    onSave({
      ...form,
      email: `${form.reporter.toLowerCase().replace(/\s+/g, '.')}@example.com`
    });
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="add-complaint-title">
        <div className="modal-header">
          <div><p className="eyebrow">New record</p><h2 id="add-complaint-title">Add Complaint</h2></div>
          <button className="icon-button" aria-label="Close" onClick={onClose}><X size={19} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>Issue title *<input value={form.issue} onChange={(event) => setForm({ ...form, issue: event.target.value })} placeholder="e.g. Broken street light" /></label>
            <label>Category<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option>Maintenance</option><option>Electrical</option><option>Sanitation</option><option>Public Spaces</option><option>Roads</option><option>Community</option></select></label>
            <label className="full-field">Description *<textarea rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Describe the issue in a little more detail" /></label>
            <label>Location *<input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} placeholder="e.g. Block A, Main Road" /></label>
            <label>Priority<select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as Priority })}><option>High</option><option>Medium</option><option>Low</option></select></label>
            <label className="full-field">Reporter name *<input value={form.reporter} onChange={(event) => setForm({ ...form, reporter: event.target.value })} placeholder="Full name" /></label>
          </div>
          {error && <p className="form-error">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-button"><Check size={16} /> Save Complaint</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ComplaintDetails({
  complaints,
  onStatusChange,
  onDelete
}: {
  complaints: Complaint[];
  onStatusChange: (id: string, status: Status) => void;
  onDelete: (id: string) => void;
}) {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const complaint = complaints.find((item) => item.id === decodeURIComponent(complaintId ?? ''));

  if (!complaint) return <EmptyState title="Complaint not found" message="This complaint may have been removed or the link is no longer valid." />;

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete complaint ${complaint.id}?`)) {
      onDelete(complaint.id);
      navigate('/complaints');
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <button className="back-button" style={{ marginBottom: 0 }} onClick={() => navigate('/complaints')}>
          <ArrowRight size={16} className="back-arrow" /> Back to complaints
        </button>
        <button className="danger-button" onClick={handleDelete} title="Permanently delete this complaint">
          <Trash2 size={15} /> Delete Record
        </button>
      </div>
      <PageHeading eyebrow={complaint.id} title={complaint.issue} subtitle={`${complaint.category} complaint reported from ${complaint.location}.`} action={<StatusBadge status={complaint.status} />} />
      <div className="details-grid">
        <section className="panel detail-main">
          <div className="detail-section">
            <div className="detail-section-heading"><MessageSquareText size={18} /><h2>Complaint description</h2></div>
            <p>{complaint.description}</p>
          </div>
          <div className="detail-section">
            <div className="detail-section-heading"><SlidersHorizontal size={18} /><h2>Update status</h2></div>
            <p>Keep the reporter informed by moving this complaint through its resolution stages.</p>
            <div className="status-actions">
              {(['Pending', 'In Progress', 'Resolved'] as Status[]).map((status) => (
                <button
                  key={status}
                  className={complaint.status === status ? 'status-choice selected' : 'status-choice'}
                  onClick={() => onStatusChange(complaint.id, status)}
                >
                  <span className={`choice-dot ${status.toLowerCase().replace(' ', '-')}`} />
                  {status}
                  {complaint.status === status && <Check size={15} />}
                </button>
              ))}
            </div>
          </div>
        </section>
        <aside className="panel detail-side">
          <div className="detail-section-heading"><ClipboardList size={18} /><h2>Complaint information</h2></div>
          <dl>
            <div><dt>Complaint ID</dt><dd>{complaint.id}</dd></div>
            <div><dt>Location</dt><dd>{complaint.location}</dd></div>
            <div><dt>Reported on</dt><dd>{complaint.reportedOn}</dd></div>
            <div><dt>Priority</dt><dd><PriorityBadge priority={complaint.priority} /></dd></div>
          </dl>
          <div className="reporter-card">
            <span className="avatar large">{complaint.reporter.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>
            <div>
              <span>Reported by</span>
              <strong>{complaint.reporter}</strong>
              <small>{complaint.email}</small>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

type ChartTooltipProps = { active?: boolean; payload?: ReadonlyArray<{ value?: ValueType }>; label?: NameType };
const chartTooltip = ({ active, payload, label }: ChartTooltipProps) => active && payload?.length ? <div className="chart-tooltip"><strong>{label}</strong><span>{payload[0].value} complaints</span></div> : null;

function Analytics({ complaints }: { complaints: Complaint[] }) {
  const counts = countStatuses(complaints);
  const total = complaints.length || 1;
  const statusData = [{ name: 'Pending', value: counts.Pending, color: '#efb94d' }, { name: 'In Progress', value: counts['In Progress'], color: '#5db49a' }, { name: 'Resolved', value: counts.Resolved, color: '#087a50' }];
  const priorityData = [{ name: 'High', value: complaints.filter((item) => item.priority === 'High').length, color: '#e98077' }, { name: 'Medium', value: complaints.filter((item) => item.priority === 'Medium').length, color: '#efb94d' }, { name: 'Low', value: complaints.filter((item) => item.priority === 'Low').length, color: '#16a36a' }];
  const trendData = [{ name: '10 Oct', received: 5, resolved: 3 }, { name: '11 Oct', received: 8, resolved: 5 }, { name: '12 Oct', received: 6, resolved: 4 }, { name: '13 Oct', received: 9, resolved: 6 }, { name: '14 Oct', received: 7, resolved: 6 }, { name: '15 Oct', received: 11, resolved: 8 }, { name: '16 Oct', received: complaints.length, resolved: counts.Resolved }];

  return (
    <>
      <PageHeading eyebrow="Insights" title="Analytics" subtitle="Understand complaint volume, priorities, and resolution progress." action={<button className="secondary-button"><CalendarDays size={16} /> Last 30 days <ChevronDown size={15} /></button>} />
      <div className="metrics-grid analytics-metrics">
        <MetricCard label="Total Complaints" value={complaints.length} icon={<MessageSquareText size={21} />} trend="12%" note="vs. previous period" />
        <MetricCard label="Resolution Rate" value={`${Math.round((counts.Resolved / total) * 100)}%`} icon={<CircleCheck size={21} />} trend="5%" note="vs. previous period" />
        <MetricCard label="Avg. Resolution Time" value="4.2 hrs" icon={<Clock3 size={21} />} trend="18%" note="faster than before" />
        <MetricCard label="Pending Complaints" value={counts.Pending} icon={<Clock3 size={21} />} trend="20%" note="vs. previous period" />
      </div>
      <div className="analytics-grid">
        <section className="panel chart-panel trend-panel">
          <div className="chart-header"><div><h2>Complaint trends</h2><p>Received versus resolved complaints</p></div><span className="chart-period">Daily</span></div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs><linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#16a36a" stopOpacity={0.28} /><stop offset="100%" stopColor="#16a36a" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid stroke="#e6efeb" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#7b8e88', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#7b8e88', fontSize: 11 }} />
                <Tooltip content={chartTooltip} />
                <Area type="monotone" dataKey="received" stroke="#16a36a" fill="url(#trendFill)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="resolved" stroke="#7da59a" fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend"><span><i className="legend-green" /> Received</span><span><i className="legend-gray" /> Resolved</span></div>
        </section>
        <section className="panel chart-panel">
          <div className="chart-header"><div><h2>Status distribution</h2><p>Current complaint status</p></div></div>
          <div className="donut-layout">
            <div className="donut-chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" innerRadius={54} outerRadius={78} paddingAngle={3}>
                    {statusData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <strong>{complaints.length}<small>Total</small></strong>
            </div>
            <div className="chart-legend vertical">
              {statusData.map((item) => (
                <span key={item.name}>
                  <i style={{ background: item.color }} /> {item.name}<b>{Math.round((item.value / total) * 100)}%</b>
                </span>
              ))}
            </div>
          </div>
        </section>
        <section className="panel chart-panel priority-panel">
          <div className="chart-header"><div><h2>Priority distribution</h2><p>How urgent are the open reports?</p></div></div>
          <div className="priority-bars">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} layout="vertical" margin={{ left: 10, right: 22 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#536964', fontSize: 12 }} />
                <Tooltip content={chartTooltip} />
                <Bar dataKey="value" radius={[0, 5, 5, 0]}>
                  {priorityData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </>
  );
}

function Settings({ settings, onSave }: { settings: SettingsState; onSave: (settings: SettingsState) => void }) {
  const [draft, setDraft] = useState(settings);
  const [section, setSection] = useState<'Profile' | 'Notifications' | 'Appearance' | 'Security'>('Profile');

  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  return (
    <>
      <PageHeading eyebrow="Workspace" title="Settings" subtitle="Manage your profile and application preferences." />
      <div className="settings-layout">
        <aside className="panel settings-nav">
          {(['Profile', 'Notifications', 'Appearance', 'Security'] as const).map((item) => (
            <button key={item} className={section === item ? 'settings-nav-item active' : 'settings-nav-item'} onClick={() => setSection(item)}>
              {item === 'Profile' ? <UserRound size={18} /> : item === 'Notifications' ? <Bell size={18} /> : item === 'Appearance' ? <Sun size={18} /> : <ShieldCheck size={18} />}
              <span>{item}</span>
              <ChevronRight size={15} />
            </button>
          ))}
        </aside>
        <section className="panel settings-content">
          {section === 'Profile' && (
            <>
              <div className="settings-title">
                <div><h2>Profile settings</h2><p>Update your personal information and account details.</p></div>
                <button className="secondary-button" onClick={() => onSave(draft)}><Check size={16} /> Save changes</button>
              </div>
              <div className="profile-hero">
                <span className="avatar profile-avatar">{draft.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>
                <div>
                  <h3>{draft.name}</h3>
                  <p><span className="online-dot" /> Administrator</p>
                  <p><span className="online-dot" /> Active account</p>
                </div>
              </div>
              <div className="form-grid settings-form">
                <label>Admin name<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
                <label>Email address<input type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} /></label>
              </div>
              <div className="account-overview">
                <h3>Account overview</h3>
                <div className="overview-grid">
                  <div><CalendarDays size={17} /><span>Account created<strong>12 Apr 2025</strong></span></div>
                  <div><ShieldCheck size={17} /><span>Last login<strong>Today, 10:24 AM</strong></span></div>
                  <div><Zap size={17} /><span>Active sessions<strong>1 device</strong></span></div>
                </div>
              </div>
            </>
          )}
          {section === 'Notifications' && (
            <SettingsSection title="Notification preferences" subtitle="Choose which updates you want to see in ComplaintHub.">
              <Toggle label="Email notifications" description="Receive daily activity summaries by email." checked={draft.emailNotifications} onChange={(checked) => setDraft({ ...draft, emailNotifications: checked })} />
              <Toggle label="New complaint alerts" description="Get notified when a new complaint is submitted." checked={draft.newComplaintNotifications} onChange={(checked) => setDraft({ ...draft, newComplaintNotifications: checked })} />
              <Toggle label="Status update alerts" description="Get notified when a complaint changes status." checked={draft.statusNotifications} onChange={(checked) => setDraft({ ...draft, statusNotifications: checked })} />
              <button className="primary-button" onClick={() => onSave(draft)}>Save preferences</button>
            </SettingsSection>
          )}
          {section === 'Appearance' && (
            <SettingsSection title="Appearance" subtitle="Adjust how ComplaintHub looks on your screen.">
              <div className="appearance-options">
                <button className={!draft.darkMode ? 'appearance-option selected' : 'appearance-option'} onClick={() => setDraft({ ...draft, darkMode: false })}>
                  <Sun size={21} /><strong>Light theme</strong><span>Clean, bright workspace</span>
                </button>
                <button className={draft.darkMode ? 'appearance-option selected' : 'appearance-option'} onClick={() => setDraft({ ...draft, darkMode: true })}>
                  <Moon size={21} /><strong>Dark theme</strong><span>Low-light focused workspace</span>
                </button>
              </div>
              <button className="primary-button" onClick={() => onSave(draft)}>Save appearance</button>
            </SettingsSection>
          )}
          {section === 'Security' && (
            <SettingsSection title="Security" subtitle="Keep your administrator account protected.">
              <div className="security-callout">
                <ShieldCheck size={22} />
                <div>
                  <strong>Password protected</strong>
                  <p>Your account is using a secure password. Changes are verified by the backend.</p>
                </div>
              </div>
              <label className="password-field">New password<input type="password" placeholder="Enter a new password" /></label>
              <label className="password-field">Confirm password<input type="password" placeholder="Confirm new password" /></label>
              <button className="primary-button" onClick={() => onSave(draft)}>Update password</button>
            </SettingsSection>
          )}
        </section>
      </div>
    </>
  );
}

function SettingsSection({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return <div className="settings-section"><div className="settings-title"><div><h2>{title}</h2><p>{subtitle}</p></div></div>{children}</div>;
}

function Toggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="toggle-row">
      <span><strong>{label}</strong><small>{description}</small></span>
      <button type="button" aria-label={`Toggle ${label}`} className={checked ? 'toggle on' : 'toggle'} onClick={() => onChange(!checked)}>
        <span />
      </button>
    </label>
  );
}

export default function AppEntry() { return <App />; }
