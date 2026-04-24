// src/pages/AdminPanel.jsx — Admin dashboard
import { useEffect, useState } from 'react';
import api from '../api/api';
import toast from 'react-hot-toast';
import './AdminPanel.css';

const TABS = ['Dashboard','Properties','Users','Enquiries'];

export default function AdminPanel() {
  const [tab,   setTab]   = useState('Dashboard');
  const [stats, setStats] = useState({});
  const [props, setProps] = useState([]);
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchProperties();
    fetchUsers();
    fetchContacts();
  }, []);

  const fetchStats      = () => api.get('/admin/stats').then(r => setStats(r.data.data)).catch(() => {});
  const fetchProperties = (status = '') => {
    setLoading(true);
    api.get('/admin/properties', { params: status ? { status } : {} })
      .then(r => setProps(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  };
  const fetchUsers    = () => api.get('/admin/users').then(r => setUsers(r.data.data || [])).catch(() => {});
  const fetchContacts = () => api.get('/contact').then(r => setContacts(r.data.data || [])).catch(() => {});

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/properties/${id}/status`, { status });
      toast.success(`Property ${status}`);
      fetchProperties(filter);
      fetchStats();
    } catch { toast.error('Failed'); }
  };

  const deleteProperty = async (id) => {
    if (!confirm('Delete this property?')) return;
    try {
      await api.delete(`/admin/properties/${id}`);
      toast.success('Property deleted');
      fetchProperties(filter);
      fetchStats();
    } catch { toast.error('Failed'); }
  };

  const toggleUser = async (id) => {
    try {
      await api.put(`/admin/users/${id}/toggle`);
      toast.success('User status updated');
      fetchUsers();
    } catch { toast.error('Failed'); }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch { toast.error('Failed'); }
  };

  const markResponded = async (id) => {
    try {
      await api.put(`/contact/${id}/respond`);
      toast.success('Marked as responded');
      fetchContacts();
    } catch { toast.error('Failed'); }
  };

  const statusColor = (s) => s === 'approved' ? 'green' : s === 'rejected' ? 'red' : 'gold';

  return (
    <div style={{ paddingTop: '70px' }}>
      <div className="page-header">
        <div className="container">
          <h1>⚙️ Admin Panel</h1>
          <p>Manage properties, users, and enquiries</p>
        </div>
      </div>

      <div className="container admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          {TABS.map(t => (
            <button key={t} className={`admin-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </aside>

        <div className="admin-content">
          {/* ── Dashboard ─────────────────────────────── */}
          {tab === 'Dashboard' && (
            <div>
              <h2 className="admin-section-title">Dashboard Overview</h2>
              <div className="stats-grid">
                {[
                  { icon:'👥', label:'Total Users',       val: stats.totalUsers },
                  { icon:'🏠', label:'Total Properties',  val: stats.totalProperties },
                  { icon:'⏳', label:'Pending Approval',  val: stats.pendingProperties },
                  { icon:'📧', label:'Total Enquiries',   val: stats.totalContacts },
                ].map(s => (
                  <div key={s.label} className="admin-stat-card">
                    <span className="admin-stat-icon">{s.icon}</span>
                    <strong>{s.val ?? '…'}</strong>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
              {stats.pendingProperties > 0 && (
                <div className="pending-alert">
                  ⚠️ <strong>{stats.pendingProperties}</strong> properties are awaiting approval.
                  <button className="btn btn-primary btn-sm" onClick={() => { setTab('Properties'); setFilter('pending'); fetchProperties('pending'); }} style={{ marginLeft: '12px' }}>Review Now</button>
                </div>
              )}
            </div>
          )}

          {/* ── Properties ─────────────────────────────── */}
          {tab === 'Properties' && (
            <div>
              <div className="admin-toolbar">
                <h2 className="admin-section-title">All Properties</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['','pending','approved','rejected'].map(s => (
                    <button key={s}
                      className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => { setFilter(s); fetchProperties(s); }}>
                      {s || 'All'}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? <div className="spinner-wrap"><div className="spinner"/></div> : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr><th>Property</th><th>Owner</th><th>Price</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {props.map(p => (
                        <tr key={p.id}>
                          <td>
                            <div className="table-prop">
                              <img src={p.primary_image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100'} alt="" onError={e=>e.target.src='https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100'}/>
                              <div>
                                <strong>{p.title}</strong>
                                <small>{p.location_city}</small>
                              </div>
                            </div>
                          </td>
                          <td><span>{p.owner_name}</span><br/><small style={{color:'var(--text-muted)'}}>{p.owner_email}</small></td>
                          <td style={{ color: 'var(--gold)', fontWeight: 700 }}>
                            ₹{p.price >= 10000000 ? `${(p.price/10000000).toFixed(1)} Cr` : `${(p.price/100000).toFixed(0)} L`}
                          </td>
                          <td><span className={`badge badge-${statusColor(p.status)}`}>{p.status}</span></td>
                          <td>
                            <div className="action-btns">
                              {p.status !== 'approved'  && <button className="btn btn-sm" style={{background:'var(--green)',color:'#fff'}} onClick={() => updateStatus(p.id,'approved')}>✓ Approve</button>}
                              {p.status !== 'rejected'  && <button className="btn btn-sm btn-ghost" onClick={() => updateStatus(p.id,'rejected')}>✗ Reject</button>}
                              <button className="btn btn-sm btn-danger" onClick={() => deleteProperty(p.id)}>🗑</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!props.length && <div className="empty-state"><div className="empty-icon">🏠</div><h3>No properties found</h3></div>}
                </div>
              )}
            </div>
          )}

          {/* ── Users ──────────────────────────────────── */}
          {tab === 'Users' && (
            <div>
              <h2 className="admin-section-title">All Users</h2>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>User</th><th>Role</th><th>Phone</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="user-avatar-sm">{u.name[0].toUpperCase()}</div>
                            <div><strong>{u.name}</strong><br/><small style={{color:'var(--text-muted)'}}>{u.email}</small></div>
                          </div>
                        </td>
                        <td><span className={`badge badge-${u.role==='admin'?'red':u.role==='seller'?'gold':'blue'}`}>{u.role}</span></td>
                        <td><small>{u.phone || '—'}</small></td>
                        <td><span className={`badge badge-${u.is_active?'green':'red'}`}>{u.is_active?'Active':'Inactive'}</span></td>
                        <td><small>{new Date(u.created_at).toLocaleDateString('en-IN')}</small></td>
                        <td>
                          <div className="action-btns">
                            <button className={`btn btn-sm ${u.is_active ? 'btn-ghost' : 'btn-primary'}`} onClick={() => toggleUser(u.id)}>
                              {u.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => deleteUser(u.id)}>🗑</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!users.length && <div className="empty-state"><div className="empty-icon">👥</div><h3>No users found</h3></div>}
              </div>
            </div>
          )}

          {/* ── Enquiries ───────────────────────────────── */}
          {tab === 'Enquiries' && (
            <div>
              <h2 className="admin-section-title">Contact Enquiries</h2>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>From</th><th>Property</th><th>Message</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {contacts.map(c => (
                      <tr key={c.id}>
                        <td><strong>{c.name}</strong><br/><small style={{color:'var(--text-muted)'}}>{c.email}</small></td>
                        <td><small>{c.property_title || 'General'}</small></td>
                        <td><small style={{color:'var(--text-secondary)'}}>{c.message?.slice(0,80)}…</small></td>
                        <td><span className={`badge badge-${c.status==='responded'?'green':'gold'}`}>{c.status}</span></td>
                        <td>
                          {c.status !== 'responded' && (
                            <button className="btn btn-sm btn-primary" onClick={() => markResponded(c.id)}>Mark Responded</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!contacts.length && <div className="empty-state"><div className="empty-icon">📧</div><h3>No enquiries yet</h3></div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
