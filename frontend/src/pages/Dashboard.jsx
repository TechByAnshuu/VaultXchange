import AccountList from '../components/AccountList';
import AccountForm from '../components/AccountForm';
import { useAccounts } from '../store/AccountContext';
import { Wallet, Users, TrendingUp, TrendingDown, LayoutDashboard } from 'lucide-react';

const Dashboard = () => {
  const { accounts, loading } = useAccounts();

  // ── Compute stats from accounts ─────────────
  const totalBalance = accounts?.reduce((sum, acc) => sum + (acc.balance || 0), 0) || 0;
  const totalAccounts = accounts?.length || 0;
  const highestBalance = accounts?.length
    ? Math.max(...accounts.map(a => a.balance || 0))
    : 0;
  const lowestBalance = accounts?.length
    ? Math.min(...accounts.map(a => a.balance || 0))
    : 0;

  const stats = [
    {
      label: 'Total Balance',
      value: `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <Wallet size={20} color="var(--gold)" />,
      iconBg: 'rgba(249,199,79,0.12)',
      valueColor: 'var(--gold)',
      border: 'rgba(249,199,79,0.3)',
    },
    {
      label: 'Active Accounts',
      value: totalAccounts,
      icon: <Users size={20} color="var(--primary)" />,
      iconBg: 'rgba(192,57,43,0.08)',
      valueColor: 'var(--primary)',
      border: 'rgba(192,57,43,0.2)',
    },
    {
      label: 'Highest Balance',
      value: `$${highestBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <TrendingUp size={20} color="var(--success)" />,
      iconBg: 'rgba(16,185,129,0.1)',
      valueColor: 'var(--success)',
      border: 'rgba(16,185,129,0.2)',
    },
    {
      label: 'Lowest Balance',
      value: `$${lowestBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <TrendingDown size={20} color="var(--orange)" />,
      iconBg: 'rgba(232,88,12,0.1)',
      valueColor: 'var(--orange)',
      border: 'rgba(232,88,12,0.2)',
    },
  ];

  return (
    <div className="page-enter">

      {/* ── Page Header ───────────────────────── */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(192,57,43,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LayoutDashboard size={18} color="var(--primary)" />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.625rem', fontWeight: 700, color: 'var(--text-navy)' }}>
            Dashboard
          </h2>
        </div>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9375rem', paddingLeft: '0.25rem' }}>
          Manage all bank accounts across VaultX Exchange.
        </p>
      </div>

      {/* ── Stats Cards Row ───────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        {stats.map((s) => (
          <div
            key={s.label}
            className="stat-card"
            style={{ borderTop: `3px solid ${s.border}` }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
              <span className="stat-label">{s.label}</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: s.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {loading
                  ? <div className="skeleton" style={{ width: '20px', height: '20px', borderRadius: '4px' }} />
                  : s.icon
                }
              </div>
            </div>
            {loading
              ? <div className="skeleton skeleton-title" style={{ width: '70%', marginBottom: 0 }} />
              : <div className="stat-value" style={{ color: s.valueColor, fontSize: '1.5rem' }}>{s.value}</div>
            }
          </div>
        ))}
      </div>

      {/* ── Divider ───────────────────────────── */}
      <div className="divider" />

      {/* ── Main Content Grid ─────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '2rem',
        alignItems: 'start',
      }}>

        {/* Left — Account List */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-navy)' }}>
                Active Accounts
              </h3>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                {totalAccounts} account{totalAccounts !== 1 ? 's' : ''} registered
              </p>
            </div>
            {totalAccounts > 0 && (
              <span className="badge badge-active">
                {totalAccounts} Active
              </span>
            )}
          </div>
          <AccountList />
        </div>

        {/* Right — Create Account Form */}
        <div style={{ position: 'sticky', top: '88px' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-navy)' }}>
              Open New Account
            </h3>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Add a new account to the simulation
            </p>
          </div>
          <AccountForm />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;