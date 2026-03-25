// src/pages/Dashboard.jsx
import { useState } from 'react';
import { useBankDashboard } from '../hooks/useBankDashboard';
import AccountDetailModal from '../components/AccountDetailModal';
import {
  Wallet, Users, ArrowLeftRight, AlertTriangle,
  LayoutDashboard, Search, Eye, RefreshCw, CheckCircle, XCircle,
} from 'lucide-react';

/* ── Status Badge ─────────────────────── */
const StatusBadge = ({ status }) => {
  const map = {
    ACTIVE:  { bg: '#E8F7F0', color: '#10B981' },
    FROZEN:  { bg: '#EDE8E1', color: '#3D3535' },
    PENDING: { bg: '#FEF9EC', color: '#92670A' },
  };
  const s = map[status] || map.PENDING;
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 20, padding: '3px 10px',
                   fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color }} />
      {status || 'UNKNOWN'}
    </span>
  );
};

/* ── Error State ──────────────────────── */
const ErrorState = ({ message, onRetry }) => (
  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
    <AlertTriangle size={40} color="#E8580C" style={{ marginBottom: 12 }} />
    <p style={{ color: '#1A1A2E', fontWeight: 600, marginBottom: 8 }}>Failed to load dashboard data</p>
    <p style={{ color: '#6C6C80', fontSize: 13, marginBottom: 16 }}>{message}</p>
    <button onClick={onRetry} style={{ background: '#3D3535', color: 'white', border: 'none', borderRadius: 10, padding: '10px 24px', cursor: 'pointer', fontSize: 14 }}>
      Try Again
    </button>
  </div>
);

/* ── Dashboard ────────────────────────── */
const Dashboard = () => {
  const {
    accounts, allAccounts, transactions, stats, loading, error,
    search, setSearch, statusFilter, setStatusFilter,
    page, setPage, totalPages, filteredCount,
    toggleAccountStatus, refetch,
  } = useBankDashboard();

  const [selectedAccount, setSelectedAccount] = useState(null);

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const fmtINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  const statCards = [
    {
      label: 'Total Accounts',
      value: loading ? '—' : stats?.totalAccounts ?? 0,
      icon: <Users size={20} color="var(--primary)" />,
      iconBg: 'rgba(61,53,53,0.08)', valueColor: 'var(--primary)', border: 'rgba(61,53,53,0.2)',
    },
    {
      label: 'Total Balance',
      value: loading ? '—' : fmtINR(stats?.totalBalance),
      icon: <Wallet size={20} color="var(--gold)" />,
      iconBg: 'rgba(249,199,79,0.12)', valueColor: 'var(--gold)', border: 'rgba(249,199,79,0.3)',
    },
    {
      label: "Today's Transactions",
      value: loading ? '—' : stats?.todayTxns ?? 0,
      icon: <ArrowLeftRight size={20} color="var(--orange)" />,
      iconBg: 'rgba(232,88,12,0.1)', valueColor: 'var(--orange)', border: 'rgba(232,88,12,0.2)',
    },
    {
      label: 'Flagged (≥₹1,000)',
      value: loading ? '—' : stats?.flaggedTxns ?? 0,
      icon: <AlertTriangle size={20} color="#EF4444" />,
      iconBg: 'rgba(239,68,68,0.1)', valueColor: '#EF4444', border: 'rgba(239,68,68,0.2)',
    },
  ];

  return (
    <div className="page-enter">

      {/* Page Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(61,53,53,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LayoutDashboard size={18} color="var(--primary)" />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.625rem', fontWeight: 700, color: 'var(--text-navy)' }}>
              Bank Dashboard
            </h2>
          </div>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
            Live view — {allAccounts.length} real account{allAccounts.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <button onClick={refetch}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: '1.5px solid #EDE8E1', background: 'white', color: '#3D3535', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.18s' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#3D3535'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#EDE8E1'}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {statCards.map(s => (
          <div key={s.label} className="stat-card" style={{ borderTop: `3px solid ${s.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
              <span className="stat-label">{s.label}</span>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: s.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {loading ? <div className="skeleton" style={{ width: 20, height: 20, borderRadius: 4 }} /> : s.icon}
              </div>
            </div>
            {loading
              ? <div className="skeleton skeleton-title" style={{ width: '70%', marginBottom: 0 }} />
              : <div className="stat-value" style={{ color: s.valueColor, fontSize: '1.5rem' }}>{s.value}</div>
            }
          </div>
        ))}
      </div>

      <div className="divider" />

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>

        {/* LEFT — All Accounts Table */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-navy)' }}>
              All Customer Accounts
            </h3>
            <span className="badge badge-active">{allAccounts.length} Total</span>
          </div>

          {/* Search + Filter */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6C6C80' }} />
              <input
                type="text"
                placeholder="Search by name, account no, email..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                style={{ width: '100%', paddingLeft: 34, paddingRight: 12, height: 38, border: '1px solid #EDE8E1', borderRadius: 10, fontSize: 13, background: 'white', color: '#1A1A2E', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              style={{ height: 38, border: '1px solid #EDE8E1', borderRadius: 10, padding: '0 12px', fontSize: 13, background: 'white', color: '#1A1A2E', cursor: 'pointer' }}
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="FROZEN">Frozen</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>

          {/* Table */}
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #EDE8E1', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#FAF7F4', borderBottom: '1px solid #EDE8E1' }}>
                  {['Account No', 'Holder Name', 'Email', 'Balance', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#6C6C80', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array(5).fill(0).map((_, i) => (
                    <tr key={i}>
                      {Array(6).fill(0).map((_, j) => (
                        <td key={j} style={{ padding: '12px 14px' }}>
                          <div className="skeleton" style={{ height: 14, borderRadius: 4, width: j === 2 ? '80%' : '60%' }} />
                        </td>
                      ))}
                    </tr>
                  ))
                  : accounts.map((acc, i) => (
                    <tr key={acc.id || acc.accountNumber}
                      style={{ borderBottom: '1px solid #EDE8E1', background: i % 2 === 0 ? 'white' : '#FAF7F4' }}
                    >
                      <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: 12, color: '#1A1A2E', fontWeight: 600 }}>
                        {acc.accountNumber}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 600, color: '#1A1A2E' }}>{acc.holderName || acc.name}</div>
                        <div style={{ fontSize: 11, color: '#6C6C80' }}>{acc.accountType || 'Savings'}</div>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#6C6C80', fontSize: 12 }}>{acc.email || '—'}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--gold)' }}>
                        {fmtINR(acc.balance)}
                      </td>
                      <td style={{ padding: '12px 14px' }}><StatusBadge status={acc.status} /></td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button title="View Details" onClick={() => setSelectedAccount(acc)}
                            style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #EDE8E1', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Eye size={14} color="#3D3535" />
                          </button>
                          <button
                            title={acc.status === 'ACTIVE' ? 'Freeze Account' : 'Activate Account'}
                            onClick={() => toggleAccountStatus(acc.id, acc.status)}
                            style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid', borderColor: acc.status === 'ACTIVE' ? '#FEE9DC' : '#E8F7F0', background: acc.status === 'ACTIVE' ? '#FEE9DC' : '#E8F7F0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {acc.status === 'ACTIVE'
                              ? <XCircle size={14} color="#E8580C" />
                              : <CheckCircle size={14} color="#10B981" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderTop: '1px solid #EDE8E1', background: '#FAF7F4' }}>
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
        </div>

        {/* RIGHT — Live Transaction Feed */}
        <div style={{ position: 'sticky', top: 88 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-navy)' }}>
              Live Transaction Feed
            </h3>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#10B981', fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', animation: 'pulse 2s infinite' }} />
              LIVE
            </span>
          </div>

          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #EDE8E1', overflow: 'hidden', maxHeight: 480, overflowY: 'auto' }}>
            {loading
              ? Array(6).fill(0).map((_, i) => (
                <div key={i} style={{ padding: '12px 16px', borderBottom: '1px solid #EDE8E1', display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%' }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ height: 12, width: '70%', borderRadius: 4, marginBottom: 6 }} />
                    <div className="skeleton" style={{ height: 10, width: '50%', borderRadius: 4 }} />
                  </div>
                </div>
              ))
              : transactions.length === 0
                ? <div style={{ padding: 24, textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>No transactions available</div>
                : transactions.slice(0, 20).map((t, i) => {
                  const isCredit = t.type === 'DEPOSIT' || (t.type === 'CREDIT') || (t.amount > 0 && t.type !== 'WITHDRAW');
                  const amt = Math.abs(t.amount || 0);
                  const time = t.timestamp || t.createdAt;
                  return (
                    <div key={t.id || i} style={{ padding: '12px 16px', borderBottom: '1px solid #EDE8E1', display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, background: isCredit ? '#E8F7F0' : '#FEE9DC', color: isCredit ? '#10B981' : '#E8580C' }}>
                        {isCredit ? '↙' : '↗'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A2E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {t.holderName || t.fromAccountName || t.toAccountName || 'Account Holder'}
                        </div>
                        <div style={{ fontSize: 11, color: '#6C6C80' }}>
                          {t.type || 'TRANSFER'} · {time ? new Date(time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'}
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: isCredit ? '#10B981' : '#E8580C' }}>
                        {isCredit ? '+' : '-'}₹{amt.toLocaleString('en-IN')}
                      </div>
                    </div>
                  );
                })
            }
          </div>
        </div>

      </div>

      {/* Account Detail Modal */}
      {selectedAccount && (
        <AccountDetailModal account={selectedAccount} onClose={() => setSelectedAccount(null)} />
      )}
    </div>
  );
};

export default Dashboard;