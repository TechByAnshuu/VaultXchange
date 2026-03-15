import { Link } from 'react-router-dom';
import { useAccounts } from '../store/AccountContext';
import { ChevronRight, CreditCard } from 'lucide-react';

const AccountList = () => {
  const { accounts, loading, error } = useAccounts();

  if (loading) return <div className="glass-card">Loading accounts...</div>;
  if (error) return <div className="glass-card" style={{ color: 'var(--danger)' }}>{error}</div>;
  if (!accounts || accounts.length === 0) return <div className="glass-card">No accounts found. Create one to get started!</div>;

  return (
    <div className="account-list">
      {accounts.map(acc => (
        <Link to={`/accounts/${acc.accountNumber}`} key={acc.id} style={{ textDecoration: 'none' }}>
          <div className="glass-card flex-between" style={{ marginBottom: '1rem', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '50%', color: 'var(--primary-color)' }}>
                <CreditCard size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)' }}>{acc.holderName}</h3>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Account: {acc.accountNumber}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Balance</div>
                <div style={{ fontWeight: '600', color: 'var(--success)', fontSize: '1.1rem' }}>
                  ${acc.balance.toFixed(2)}
                </div>
              </div>
              <ChevronRight color="var(--text-muted)" size={20} />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default AccountList;
