// src/pages/BankDashboard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { activityLog } from '../data/mockData';
import { showToast } from '../components/Toast';
import ToastContainer from '../components/Toast';
import { useBankDashboard } from '../hooks/useBankDashboard';
import AccountDetailModal from '../components/AccountDetailModal';
import { RefreshCw, Eye, CheckCircle, XCircle } from 'lucide-react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  .vx-bd { display: flex; min-height: 100vh; font-family: 'Inter', sans-serif; }

  /* Sidebar */
  .vx-bd-sidebar {
    width: 240px; flex-shrink: 0;
    background: #3D3535; display: flex; flex-direction: column;
    position: fixed; top: 0; bottom: 0; left: 0; z-index: 100;
  }
  .vx-bd-sidebar-logo {
    padding: 24px 20px; display: flex; align-items: center; gap: 10px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .vx-bd-logo-icon {
    width: 38px; height: 38px; border-radius: 11px;
    background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .vx-bd-logo-vault { color: #FFFFFF; font-size: 17px; font-weight: 700; font-style: italic; }
  .vx-bd-logo-x { color: #F9C74F; font-size: 21px; font-weight: 700; font-style: italic; }
  .vx-bd-logo-sub { font-size: 6px; letter-spacing: 0.38em; color: rgba(255,255,255,0.45); text-transform: uppercase; font-weight: 700; display: block; margin-top: 2px; }

  .vx-bd-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; }
  .vx-bd-nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 14px; border-radius: 10px; cursor: pointer;
    font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.6);
    transition: all 0.18s ease; background: none; border: none;
    text-align: left; width: 100%;
  }
  .vx-bd-nav-item:hover { color: #FFFFFF; background: rgba(255,255,255,0.06); }
  .vx-bd-nav-item.active {
    color: #FFFFFF; background: rgba(255,255,255,0.12);
    border-left: 3px solid #F9C74F; padding-left: 11px;
  }

  .vx-bd-user-badge {
    padding: 16px; border-top: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; gap: 10px;
  }
  .vx-bd-user-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: rgba(249,199,79,0.25); color: #F9C74F;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; flex-shrink: 0;
  }
  .vx-bd-user-name { font-size: 13px; font-weight: 700; color: #FFFFFF; }
  .vx-bd-user-role { font-size: 11px; color: rgba(255,255,255,0.45); }
  .vx-bd-logout {
    background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.4);
    margin-left: auto; transition: color 0.18s; padding: 4px;
  }
  .vx-bd-logout:hover { color: #F9C74F; }

  /* Main content */
  .vx-bd-main { margin-left: 240px; flex: 1; background: #F5F0EB; padding: 32px; min-height: 100vh; }
  .vx-bd-page-header { margin-bottom: 28px; }
  .vx-bd-page-title { font-size: 26px; font-weight: 800; color: #1A1A2E; }
  .vx-bd-page-sub { font-size: 14px; color: #6C6C80; margin-top: 4px; }

  /* Stat row */
  .vx-bd-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
  .vx-bd-stat { background: #FFFFFF; border: 1px solid #EDE8E1; border-radius: 16px; padding: 20px; position: relative; }
  .vx-bd-stat-label { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #6C6C80; margin-bottom: 8px; }
  .vx-bd-stat-value { font-size: 28px; font-weight: 800; color: #1A1A2E; }
  .vx-bd-stat-icon { position: absolute; top: 16px; right: 16px; width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }

  /* 2-col layout */
  .vx-bd-cols { display: grid; grid-template-columns: 60fr 40fr; gap: 20px; margin-bottom: 28px; }
  .vx-bd-panel { background: #FFFFFF; border: 1px solid #EDE8E1; border-radius: 16px; overflow: hidden; }
  .vx-bd-panel-header {
    padding: 18px 20px; border-bottom: 1px solid #EDE8E1;
    display: flex; align-items: center; justify-content: space-between;
  }
  .vx-bd-panel-title { font-size: 15px; font-weight: 700; color: #1A1A2E; }
  .vx-bd-search-input {
    padding: 9px 14px; background: #FAF7F4;
    border: 1.5px solid #EDE8E1; border-radius: 10px;
    font-family: 'Inter', sans-serif; font-size: 13px; color: #0F0F1A; outline: none;
    transition: border-color 0.2s;
  }
  .vx-bd-search-input:focus { border-color: #3D3535; }

  /* Table */
  .vx-bd-table { width: 100%; border-collapse: collapse; }
  .vx-bd-table th { padding: 12px 16px; font-size: 10px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #6C6C80; text-align: left; border-bottom: 1px solid #EDE8E1; background: #FAFAF9; }
  .vx-bd-table td { padding: 13px 16px; font-size: 13px; color: #1A1A2E; border-bottom: 1px solid #F5F0EB; }
  .vx-bd-table tr:hover td { background: #FAF7F4; }
  .vx-bd-badge {
    font-size: 9px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 3px 9px; border-radius: 99px;
  }
  .badge-active   { background: rgba(16,185,129,0.1); color: #10B981; }
  .badge-inactive { background: rgba(108,108,128,0.1); color: #6C6C80; }

  /* Transaction feed */
  .vx-bd-feed { padding: 4px 0; max-height: 320px; overflow-y: auto; }
  .vx-bd-feed-item {
    display: flex; align-items: center; gap: 12px;
    padding: 13px 20px; border-bottom: 1px solid #F5F0EB;
  }
  .vx-bd-feed-item:hover { background: #FAF7F4; }
  .vx-bd-feed-avatar {
    width: 36px; height: 36px; border-radius: 50%; background: #3D3535;
    color: #FFFFFF; font-size: 12px; font-weight: 700;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .vx-bd-feed-name { font-size: 13px; font-weight: 600; color: #1A1A2E; }
  .vx-bd-feed-time { font-size: 11px; color: #9CA3AF; }
  .vx-bd-feed-amount { margin-left: auto; font-size: 14px; font-weight: 800; }

  /* Alert table */
  .vx-bd-alert-table { width: 100%; border-collapse: collapse; }
  .vx-bd-alert-table th { padding: 12px 16px; font-size: 10px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #6C6C80; text-align: left; border-bottom: 1px solid #EDE8E1; background: #FAFAF9; }
  .vx-bd-alert-table td { padding: 13px 16px; font-size: 13px; color: #1A1A2E; border-bottom: 1px solid #F5F0EB; }
  .vx-bd-review-btn {
    padding: 6px 14px; border-radius: 8px;
    background: rgba(61,53,53,0.08); border: 1px solid rgba(61,53,53,0.15);
    font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600;
    color: #3D3535; cursor: pointer; transition: all 0.18s;
  }
  .vx-bd-review-btn:hover { background: #3D3535; color: #FFFFFF; }
  .vx-bd-review-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  @media (max-width: 1024px) {
    .vx-bd-stats { grid-template-columns: repeat(2, 1fr); }
    .vx-bd-cols { grid-template-columns: 1fr; }
  }
  @media (max-width: 768px) {
    .vx-bd-sidebar { display: none; }
    .vx-bd-main { margin-left: 0; padding: 20px; }
    .vx-bd-stats { grid-template-columns: 1fr 1fr; }
  }
`;

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { id: 'accounts', label: 'All Accounts', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
  { id: 'transactions', label: 'Transactions', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> },
  { id: 'alerts', label: 'Alerts', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
  { id: 'reports', label: 'Reports', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
];

export default function BankDashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [reviewedAlerts, setReviewedAlerts] = useState(new Set());
  const [selectedAccount, setSelectedAccount] = useState(null);

  const {
    accounts, allAccounts, transactions, stats, loading, error,
    search, setSearch, statusFilter, setStatusFilter,
    page, setPage, totalPages, filteredCount,
    toggleAccountStatus, refetch,
  } = useBankDashboard();

  const highValueTxns = transactions.filter(t => Math.abs(t.amount || 0) >= 1000);
  const flaggedCount = highValueTxns.filter(t => !reviewedAlerts.has(t.id)).length;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const markReviewed = (txnId) => {
    setReviewedAlerts(prev => {
      const next = new Set(prev);
      next.add(txnId);
      return next;
    });
    showToast('Marked as reviewed', 'success');
  };

  return (
    <>
      <style>{styles}</style>
      <div className="vx-bd">
        {/* Sidebar */}
        <aside className="vx-bd-sidebar">
          <div className="vx-bd-sidebar-logo">
            <div className="vx-bd-logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12L11 14L15 10M12 2L3 7V13C3 17.97 7.02 22.63 12 24C16.98 22.63 21 17.97 21 13V7L12 2Z" />
              </svg>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <span className="vx-bd-logo-vault">Vault</span>
                <span className="vx-bd-logo-x">X</span>
              </div>
              <span className="vx-bd-logo-sub">Exchange</span>
            </div>
          </div>

          <nav className="vx-bd-nav">
            {NAV_ITEMS.map(item => (
              <button key={item.id} className={`vx-bd-nav-item${activeNav === item.id ? ' active' : ''}`} onClick={() => setActiveNav(item.id)}>
                {item.icon} {item.label}
                {item.id === 'alerts' && flaggedCount > 0 && (
                  <span style={{ marginLeft: 'auto', background: '#E8580C', color: '#FFFFFF', fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 99 }}>{flaggedCount}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="vx-bd-user-badge">
            <div className="vx-bd-user-avatar">A</div>
            <div>
              <div className="vx-bd-user-name">Admin</div>
              <div className="vx-bd-user-role">Bank Employee</div>
            </div>
            <button className="vx-bd-logout" onClick={handleLogout} title="Logout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="vx-bd-main">
          <div className="vx-bd-page-header">
            <div className="vx-bd-page-title">Bank Dashboard</div>
            <div className="vx-bd-page-sub">Manage all accounts, transactions and alerts</div>
          </div>

          {/* Stats */}
          <div className="vx-bd-stats">
            <div className="vx-bd-stat">
              <div className="vx-bd-stat-icon" style={{ background: 'rgba(37,99,235,0.1)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div className="vx-bd-stat-label">Total Accounts</div>
              <div className="vx-bd-stat-value">{loading ? '—' : stats?.totalAccounts ?? 0}</div>
            </div>
            <div className="vx-bd-stat">
              <div className="vx-bd-stat-icon" style={{ background: 'rgba(249,199,79,0.12)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F9C74F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <div className="vx-bd-stat-label">Total Balance</div>
              <div className="vx-bd-stat-value" style={{ fontSize: 20, color: '#F9C74F' }}>
                {loading ? '—' : `₹${Number(stats?.totalBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
              </div>
            </div>
            <div className="vx-bd-stat">
              <div className="vx-bd-stat-icon" style={{ background: 'rgba(232,88,12,0.1)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8580C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
              </div>
              <div className="vx-bd-stat-label">Txns Today</div>
              <div className="vx-bd-stat-value">{loading ? '—' : stats?.todayTxns ?? 0}</div>
            </div>
            <div className="vx-bd-stat">
              <div className="vx-bd-stat-icon" style={{ background: 'rgba(232,88,12,0.1)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8580C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              </div>
              <div className="vx-bd-stat-label">Flagged Alerts</div>
              <div className="vx-bd-stat-value" style={{ color: '#E8580C' }}>{flaggedCount}</div>
            </div>
          </div>

          {/* 2 col */}
          <div className="vx-bd-cols">
            {/* Accounts table */}
            <div className="vx-bd-panel" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="vx-bd-panel-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="vx-bd-panel-title">All Accounts</span>
                  <button onClick={refetch} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
                    <RefreshCw size={14} color="#6C6C80" />
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input className="vx-bd-search-input" placeholder="Search accounts..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                  <select
                    value={statusFilter}
                    onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                    className="vx-bd-search-input"
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="ALL">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="FROZEN">Frozen</option>
                  </select>
                </div>
              </div>
              <div style={{ flex: 1, overflowX: 'auto' }}>
                <table className="vx-bd-table">
                  <thead>
                    <tr><th>Account No</th><th>Name</th><th>Balance</th><th>Status</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={5} style={{ textAlign: 'center', padding: 24, color: '#6C6C80' }}>Loading...</td></tr>
                    ) : accounts.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: 'center', padding: 24, color: '#6C6C80' }}>No accounts found</td></tr>
                    ) : (
                      accounts.map(a => (
                        <tr key={a.id || a.accountNumber}>
                          <td style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600 }}>{a.accountNumber}</td>
                          <td style={{ fontWeight: 600 }}>{a.holderName || a.name}</td>
                          <td style={{ fontWeight: 700, color: '#F9C74F' }}>₹{Number(a.balance || 0).toLocaleString('en-IN')}</td>
                          <td><span className={`vx-bd-badge ${a.status === 'ACTIVE' ? 'badge-active' : 'badge-inactive'}`}>{a.status}</span></td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button title="View Details" onClick={() => setSelectedAccount(a)}
                                style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #EDE8E1', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Eye size={14} color="#3D3535" />
                              </button>
                              <button
                                title={a.status === 'ACTIVE' ? 'Freeze Account' : 'Activate Account'}
                                onClick={() => toggleAccountStatus(a.id, a.status)}
                                style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid', borderColor: a.status === 'ACTIVE' ? '#FEE9DC' : '#E8F7F0', background: a.status === 'ACTIVE' ? '#FEE9DC' : '#E8F7F0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {a.status === 'ACTIVE'
                                  ? <XCircle size={14} color="#E8580C" />
                                  : <CheckCircle size={14} color="#10B981" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid #EDE8E1', background: '#FAFAF9' }}>
                  <span style={{ fontSize: 12, color: '#6C6C80' }}>Page {page} of {totalPages} ({filteredCount} results)</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                      style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #EDE8E1', background: 'white', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1, fontSize: 13 }}>
                      ← Prev
                    </button>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                      style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #EDE8E1', background: 'white', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1, fontSize: 13 }}>
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Recent transactions */}
            <div className="vx-bd-panel">
              <div className="vx-bd-panel-header">
                <span className="vx-bd-panel-title">Recent Transactions</span>
              </div>
              <div className="vx-bd-feed">
                {loading ? (
                  <div style={{ padding: 24, textAlign: 'center', color: '#6C6C80' }}>Loading...</div>
                ) : transactions.length === 0 ? (
                  <div style={{ padding: 24, textAlign: 'center', color: '#6C6C80' }}>No transactions found</div>
                ) : (
                  transactions.slice(0, 10).map((t, i) => {
                    const isCredit = t.type === 'DEPOSIT' || (t.type === 'CREDIT') || (t.amount > 0 && t.type !== 'WITHDRAW');
                    const amt = Math.abs(t.amount || 0);
                    const time = t.timestamp || t.createdAt;
                    const displayTitle = t.holderName || t.fromAccountName || t.toAccountName || 'Account Holder';
                    return (
                      <div key={t.id || i} className="vx-bd-feed-item">
                        <div className="vx-bd-feed-avatar" style={{ background: isCredit ? '#E8F7F0' : '#FEE9DC', color: isCredit ? '#10B981' : '#E8580C' }}>
                          {isCredit ? '↙' : '↗'}
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div className="vx-bd-feed-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayTitle}</div>
                          <div className="vx-bd-feed-time">
                            {t.type || 'TRANSFER'} · {time ? new Date(time).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : ''}
                          </div>
                        </div>
                        <div className="vx-bd-feed-amount" style={{ color: isCredit ? '#10B981' : '#1A1A2E' }}>
                          {isCredit ? '+' : '-'}₹{amt.toLocaleString('en-IN')}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Alert log */}
          <div className="vx-bd-panel">
            <div className="vx-bd-panel-header">
              <span className="vx-bd-panel-title">⚑ High-Value Alert Log (Threshold: ₹1,000)</span>
            </div>
            <table className="vx-bd-alert-table">
              <thead>
                <tr><th>Time</th><th>Account</th><th>Details</th><th>Amount</th><th>Type</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 24, color: '#6C6C80' }}>Loading alerts...</td></tr>
                ) : highValueTxns.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 24, color: '#6C6C80' }}>No high-value transactions found.</td></tr>
                ) : (
                  highValueTxns.map(t => {
                    const isReviewed = reviewedAlerts.has(t.id);
                    const isCredit = t.type === 'DEPOSIT' || t.amount > 0;
                    const timeStr = t.timestamp || t.createdAt;
                    return (
                      <tr key={t.id}>
                        <td style={{ fontSize: 12, color: '#6C6C80' }}>
                          {timeStr ? new Date(timeStr).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                        </td>
                        <td style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600 }}>
                          {t.toAccountNo || t.fromAccountNo || '—'}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{t.holderName || t.toAccountName || t.fromAccountName || t.description || 'Unknown'}</div>
                          <div style={{ fontSize: 11, color: '#6C6C80' }}>TXN: {t.id}</div>
                        </td>
                        <td style={{ fontWeight: 700, color: isCredit ? '#10B981' : '#E8580C' }}>
                          {isCredit ? '+' : '-'}₹{Math.abs(t.amount).toLocaleString('en-IN')}
                        </td>
                        <td>
                          <span className={`vx-bd-badge ${isCredit ? 'badge-active' : 'badge-inactive'}`}>
                            {t.type || (isCredit ? 'CREDIT' : 'DEBIT')}
                          </span>
                        </td>
                        <td>
                          <span className={`vx-bd-badge ${isReviewed ? 'badge-active' : 'badge-inactive'}`}>
                            {isReviewed ? 'REVIEWED' : 'PENDING'}
                          </span>
                        </td>
                        <td>
                          <button className="vx-bd-review-btn" disabled={isReviewed} onClick={() => markReviewed(t.id)}>
                            {isReviewed ? '✓ Done' : 'Mark Reviewed'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {selectedAccount && (
        <AccountDetailModal account={selectedAccount} onClose={() => setSelectedAccount(null)} />
      )}
      <ToastContainer />
    </>
  );
}
