import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAccounts } from '../store/AccountContext';
import { ChevronRight, CreditCard, Search, Wallet } from 'lucide-react';

const AccountList = () => {
  const { accounts, loading, error } = useAccounts();
  const [search, setSearch] = useState('');

  // ── Loading skeletons ──────────────────────
  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {[1, 2, 3].map(i => (
        <div key={i} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton skeleton-text" style={{ width: '40%' }} />
            <div className="skeleton skeleton-text" style={{ width: '60%', marginBottom: 0 }} />
          </div>
          <div className="skeleton" style={{ width: '72px', height: '28px', borderRadius: '6px' }} />
        </div>
      ))}
    </div>
  );

  // ── Error state ────────────────────────────
  if (error) return (
    <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(192,57,43,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
        <CreditCard size={22} color="var(--primary)" />
      </div>
      <p style={{ color: 'var(--danger)', fontWeight: 500, margin: 0 }}>{error}</p>
    </div>
  );

  // ── Filter accounts ────────────────────────
  const filtered = (accounts || []).filter(acc =>
    acc.holderName.toLowerCase().includes(search.toLowerCase()) ||
    acc.accountNumber.includes(search)
  );

  // ── Empty state ────────────────────────────
  const isEmpty = !accounts || accounts.length === 0;

  return (
    <div>

      {/* Search bar — only show if there are accounts */}
      {!isEmpty && (
        <div className="search-wrapper" style={{ marginBottom: '1rem' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or account number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Empty state */}
      {isEmpty ? (
        <div className="glass-card empty-state">
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(192,57,43,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Wallet size={26} color="var(--primary)" />
          </div>
          <h3>No accounts yet</h3>
          <p>Create your first account using the form to get started.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card empty-state">
          <p style={{ margin: 0 }}>No accounts match "<strong>{search}</strong>"</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map(acc => (
            <Link
              to={`/accounts/${acc.accountNumber}`}
              key={acc.id}
              style={{ textDecoration: 'none' }}
            >
              <div
                className="glass-card flex-between"
                style={{ padding: '1.125rem 1.25rem', cursor: 'pointer', marginBottom: 0 }}
              >
                {/* Left — icon + info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: 'rgba(192,57,43,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <CreditCard size={20} color="var(--primary)" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-navy)' }}>
                      {acc.holderName}
                    </h3>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontFamily: 'monospace', letterSpacing: '0.03em' }}>
                      {acc.accountNumber}
                    </span>
                  </div>
                </div>

                {/* Right — balance + arrow */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Balance</div>
                    <div style={{ fontWeight: 700, color: 'var(--success)', fontSize: '1rem' }}>
                      ${acc.balance.toFixed(2)}
                    </div>
                  </div>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'var(--bg-off-white)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid var(--border)'
                  }}>
                    <ChevronRight size={15} color="var(--text-muted)" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Count footer */}
      {!isEmpty && filtered.length > 0 && (
        <p style={{ margin: '0.75rem 0 0', fontSize: '0.8125rem', color: 'var(--text-muted)', textAlign: 'right' }}>
          Showing {filtered.length} of {accounts.length} account{accounts.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};

export default AccountList;