import { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight, Filter } from 'lucide-react';

const TYPE_CONFIG = {
  DEPOSIT: { label: 'Deposit', badgeClass: 'badge-deposit', Icon: ArrowDownLeft, credit: true },
  WITHDRAW: { label: 'Withdraw', badgeClass: 'badge-withdraw', Icon: ArrowUpRight, credit: false },
  TRANSFER: { label: 'Transfer', badgeClass: 'badge-transfer', Icon: ArrowLeftRight, credit: null },
};

const TransactionList = ({ transactions, currentAccountNumber }) => {
  const [filter, setFilter] = useState('ALL');

  // ── Empty state ────────────────────────────
  if (!transactions || transactions.length === 0) {
    return (
      <div className="glass-card empty-state">
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(192,57,43,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
          <ArrowLeftRight size={22} color="var(--primary)" />
        </div>
        <h3>No transactions yet</h3>
        <p>Your transaction history will appear here once you make a deposit, withdrawal, or transfer.</p>
      </div>
    );
  }

  // ── Filter logic ───────────────────────────
  const filtered = filter === 'ALL'
    ? transactions
    : transactions.filter(tx => tx.type === filter);

  // ── Credit/debit logic per transaction ────
  const isCredit = (tx) => {
    if (tx.type === 'DEPOSIT') return true;
    if (tx.type === 'WITHDRAW') return false;
    if (tx.type === 'TRANSFER') return tx.toAccountNumber === currentAccountNumber;
    return false;
  };

  const formatDate = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      + ' · '
      + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const filters = ['ALL', 'DEPOSIT', 'WITHDRAW', 'TRANSFER'];

  return (
    <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-navy)' }}>
            Transaction History
          </h3>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            {transactions.length} total transaction{transactions.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-off-white)', borderRadius: '8px', padding: '3px', border: '1px solid var(--border)' }}>
          <Filter size={14} color="var(--text-muted)" style={{ alignSelf: 'center', marginLeft: '6px' }} />
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.375rem 0.75rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.15s ease',
                background: filter === f ? 'var(--bg-white)' : 'transparent',
                color: filter === f ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: filter === f ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase() + 's'}
            </button>
          ))}
        </div>
      </div>

      {/* No results for filter */}
      {filtered.length === 0 ? (
        <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No {filter.toLowerCase()} transactions found.
        </div>
      ) : (
        <div>
          {filtered.map((tx, idx) => {
            const credit = isCredit(tx);
            const cfg = TYPE_CONFIG[tx.type] || TYPE_CONFIG.TRANSFER;
            const { Icon } = cfg;

            return (
              <div
                key={tx.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.5rem',
                  borderBottom: idx < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                  transition: 'background 0.15s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-off-white)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Icon */}
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: credit
                    ? 'rgba(16,185,129,0.1)'
                    : tx.type === 'TRANSFER'
                      ? 'rgba(37,99,235,0.08)'
                      : 'rgba(192,57,43,0.08)',
                }}>
                  <Icon
                    size={18}
                    color={credit ? 'var(--success)' : tx.type === 'TRANSFER' ? '#2563EB' : 'var(--primary)'}
                  />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-navy)' }}>
                      {cfg.label}
                    </span>
                    <span className={`badge ${cfg.badgeClass}`}>{cfg.label}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {formatDate(tx.timestamp)}
                  </div>
                  {tx.type === 'TRANSFER' && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'monospace' }}>
                      {credit
                        ? `↙ From: ${tx.fromAccountNumber}`
                        : `↗ To: ${tx.toAccountNumber}`}
                    </div>
                  )}
                </div>

                {/* Amount */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: credit ? 'var(--success)' : tx.type === 'TRANSFER' ? '#2563EB' : 'var(--primary)',
                  }}>
                    {credit ? '+' : '-'}${tx.amount.toFixed(2)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer count */}
      {filtered.length > 0 && filter !== 'ALL' && (
        <div style={{ padding: '0.75rem 1.5rem', borderTop: '1px solid var(--border)', background: 'var(--bg-off-white)', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Showing {filtered.length} of {transactions.length} transactions
        </div>
      )}

    </div>
  );
};

export default TransactionList;