// src/components/AccountDetailModal.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const styles = `
  .adm-overlay {
    position: fixed; inset: 0; z-index: 2000;
    background: rgba(26,26,46,0.5); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center; padding: 16px;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .adm-modal {
    background: #F5F0EB; border-radius: 22px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.2);
    width: 100%; max-width: 640px; max-height: 90vh;
    overflow-y: auto; font-family: 'Inter', sans-serif;
    animation: slideUp 0.28s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .adm-header {
    position: sticky; top: 0; z-index: 10;
    background: #3D3535; padding: 20px 24px;
    border-radius: 22px 22px 0 0;
    display: flex; align-items: center; justify-content: space-between;
  }
  .adm-header-left { display: flex; flex-direction: column; gap: 4px; }
  .adm-header-title { font-size: 16px; font-weight: 700; color: #FFFFFF; }
  .adm-header-sub   { font-size: 12px; color: rgba(255,255,255,0.65); font-family: monospace; }
  .adm-close {
    width: 34px; height: 34px; border-radius: 10px;
    background: rgba(255,255,255,0.12); border: none; cursor: pointer;
    color: white; font-size: 18px; display: flex; align-items: center; justify-content: center;
    transition: background 0.18s;
  }
  .adm-close:hover { background: rgba(255,255,255,0.24); }
  .adm-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; }
  .adm-section {
    background: white; border-radius: 14px;
    border: 1px solid #EDE8E1; padding: 18px 20px;
  }
  .adm-section-title {
    font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: #6C6C80; margin-bottom: 14px;
    padding-bottom: 10px; border-bottom: 1px solid #EDE8E1;
  }
  .adm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .adm-grid--1 { grid-template-columns: 1fr; }
  .adm-field { display: flex; flex-direction: column; gap: 3px; }
  .adm-field-label { font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #9CA3AF; }
  .adm-field-value { font-size: 13px; font-weight: 600; color: #1A1A2E; }
  .adm-field-value--muted { color: #9CA3AF; font-weight: 400; }
  .adm-balance-hero {
    font-size: 32px; font-weight: 800; color: #F9C74F;
    letter-spacing: -1px;
  }
  .adm-status-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;
  }
  .adm-txn-row {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 0; border-bottom: 1px solid #EDE8E1;
  }
  .adm-txn-row:last-child { border-bottom: none; }
  .adm-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .adm-action-btn {
    padding: 11px 14px; border-radius: 12px; font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: 'Inter', sans-serif;
    border: 1.5px solid #EDE8E1; background: white; color: #3D3535;
    transition: all 0.18s;
  }
  .adm-action-btn:hover { border-color: #3D3535; background: #FAF7F4; }
  .adm-action-btn--danger { border-color: #FEE9DC; color: #E8580C; }
  .adm-action-btn--danger:hover { background: #FEE9DC; }
  .adm-action-btn--success { border-color: #D1FAE5; color: #10B981; }
  .adm-action-btn--success:hover { background: #E8F7F0; }
  .adm-spinner {
    display: flex; align-items: center; justify-content: center; padding: 40px;
  }
  .adm-spinner-circle {
    width: 36px; height: 36px; border-radius: 50%;
    border: 3px solid #EDE8E1; border-top-color: #3D3535;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const val = (v, fallback = 'Not provided') =>
  v || <span style={{ color: '#9CA3AF', fontWeight: 400 }}>{fallback}</span>;

const StatusBadge = ({ status }) => {
  const map = {
    ACTIVE:  { bg: '#E8F7F0', color: '#10B981' },
    FROZEN:  { bg: '#EDE8E1', color: '#3D3535' },
    PENDING: { bg: '#FEF9EC', color: '#92670A' },
  };
  const s = map[status] || map.PENDING;
  return (
    <span className="adm-status-badge" style={{ background: s.bg, color: s.color }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
      {status || 'UNKNOWN'}
    </span>
  );
};

export default function AccountDetailModal({ account, onClose }) {
  const [detail, setDetail]     = useState(account);
  const [txns, setTxns]         = useState([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!account?.id) return;
    setFetching(true);
    Promise.all([
      api.get(`/accounts/${account.accountNumber}`).then(r => setDetail(r.data)).catch(() => {}),
      api.get(`/transactions/history/${account.accountNumber}`).then(r => setTxns(r.data || [])).catch(() => {}),
    ]).finally(() => setFetching(false));
  }, [account?.id]);

  const acc = detail || account;
  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : null;

  return (
    <>
      <style>{styles}</style>
      <div className="adm-overlay" onClick={onClose}>
        <div className="adm-modal" onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className="adm-header">
            <div className="adm-header-left">
              <span className="adm-header-title">{acc.holderName || acc.name || 'Account Holder'}</span>
              <span className="adm-header-sub">Account #{acc.accountNumber}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <StatusBadge status={acc.status} />
              <button className="adm-close" onClick={onClose}>✕</button>
            </div>
          </div>

          <div className="adm-body">
            {fetching && (
              <div className="adm-spinner"><div className="adm-spinner-circle" /></div>
            )}

            {/* Balance & Summary */}
            <div className="adm-section">
              <div className="adm-section-title">💰 Balance Overview</div>
              <div className="adm-balance-hero">{fmt(acc.balance)}</div>
              <div style={{ fontSize: 12, color: '#6C6C80', marginTop: 4 }}>Current Available Balance</div>
              <div className="adm-grid" style={{ marginTop: 16 }}>
                <div className="adm-field">
                  <span className="adm-field-label">Account Type</span>
                  <span className="adm-field-value">{val(acc.accountType || acc.type, 'Savings')}</span>
                </div>
                <div className="adm-field">
                  <span className="adm-field-label">Account Opened</span>
                  <span className="adm-field-value">{val(fmtDate(acc.createdAt || acc.openedAt))}</span>
                </div>
                <div className="adm-field">
                  <span className="adm-field-label">Daily Transfer Limit</span>
                  <span className="adm-field-value">{val(acc.dailyLimit ? fmt(acc.dailyLimit) : null, '₹1,00,000')}</span>
                </div>
                <div className="adm-field">
                  <span className="adm-field-label">Minimum Balance</span>
                  <span className="adm-field-value">{val(acc.minBalance ? fmt(acc.minBalance) : null, '₹1,000')}</span>
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className="adm-section">
              <div className="adm-section-title">👤 Personal Details</div>
              <div className="adm-grid">
                <div className="adm-field">
                  <span className="adm-field-label">Full Name</span>
                  <span className="adm-field-value">{val(acc.holderName || acc.name)}</span>
                </div>
                <div className="adm-field">
                  <span className="adm-field-label">Email</span>
                  <span className="adm-field-value">{val(acc.email)}</span>
                </div>
                <div className="adm-field">
                  <span className="adm-field-label">Phone</span>
                  <span className="adm-field-value">{val(acc.mobileNumber || acc.phone)}</span>
                </div>
                <div className="adm-field">
                  <span className="adm-field-label">Date of Birth</span>
                  <span className="adm-field-value">{val(fmtDate(acc.dateOfBirth || acc.dob))}</span>
                </div>
                <div className="adm-field">
                  <span className="adm-field-label">Gender</span>
                  <span className="adm-field-value">{val(acc.gender)}</span>
                </div>
                <div className="adm-field">
                  <span className="adm-field-label">Occupation</span>
                  <span className="adm-field-value">{val(acc.occupation)}</span>
                </div>
                <div className="adm-field adm-grid--1" style={{ gridColumn: '1/-1' }}>
                  <span className="adm-field-label">Address</span>
                  <span className="adm-field-value">{val(acc.address)}</span>
                </div>
                <div className="adm-field">
                  <span className="adm-field-label">City</span>
                  <span className="adm-field-value">{val(acc.city)}</span>
                </div>
                <div className="adm-field">
                  <span className="adm-field-label">State / PIN</span>
                  <span className="adm-field-value">{val(acc.state)}{acc.pinCode ? ` — ${acc.pinCode}` : ''}</span>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="adm-section">
              <div className="adm-section-title">🏦 Account Details</div>
              <div className="adm-grid">
                <div className="adm-field">
                  <span className="adm-field-label">Account Number</span>
                  <span className="adm-field-value" style={{ fontFamily: 'monospace' }}>{val(acc.accountNumber)}</span>
                </div>
                <div className="adm-field">
                  <span className="adm-field-label">IFSC Code</span>
                  <span className="adm-field-value" style={{ fontFamily: 'monospace' }}>{val(acc.ifscCode || acc.ifsc, 'VLTX0001001')}</span>
                </div>
                <div className="adm-field">
                  <span className="adm-field-label">Branch</span>
                  <span className="adm-field-value">{val(acc.branch, 'VaultX Main Branch')}</span>
                </div>
                <div className="adm-field">
                  <span className="adm-field-label">Last Transaction</span>
                  <span className="adm-field-value">{val(txns.length > 0 ? fmtDate(txns[0]?.timestamp || txns[0]?.createdAt) : null)}</span>
                </div>
                <div className="adm-field">
                  <span className="adm-field-label">Nominee</span>
                  <span className="adm-field-value">{val(acc.nomineeName)}</span>
                </div>
                <div className="adm-field">
                  <span className="adm-field-label">Nominee Relation</span>
                  <span className="adm-field-value">{val(acc.nomineeRelation)}</span>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="adm-section">
              <div className="adm-section-title">📋 Recent Transactions ({txns.length})</div>
              {txns.length === 0 ? (
                <div style={{ color: '#9CA3AF', fontSize: 13, textAlign: 'center', padding: '12px 0' }}>
                  {fetching ? 'Loading...' : 'No transactions found'}
                </div>
              ) : (
                txns.slice(0, 5).map((t, i) => {
                  const isCredit = t.type === 'DEPOSIT' || t.amount > 0;
                  return (
                    <div className="adm-txn-row" key={t.id || i}>
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                        background: isCredit ? '#E8F7F0' : '#FEE9DC',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, color: isCredit ? '#10B981' : '#E8580C',
                      }}>
                        {isCredit ? '↙' : '↗'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A2E' }}>
                          {t.type === 'DEPOSIT' ? 'Deposit' : t.type === 'WITHDRAW' ? 'Withdrawal' : 'Transfer'}
                        </div>
                        <div style={{ fontSize: 11, color: '#6C6C80' }}>
                          {fmtDate(t.timestamp || t.createdAt)}
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, color: isCredit ? '#10B981' : '#E8580C', fontSize: 14 }}>
                        {isCredit ? '+' : '-'}₹{Math.abs(t.amount || 0).toLocaleString('en-IN')}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bank Actions */}
            <div className="adm-section">
              <div className="adm-section-title">⚙️ Bank Employee Actions</div>
              <div className="adm-actions">
                {acc.status === 'ACTIVE' ? (
                  <button className="adm-action-btn adm-action-btn--danger">
                    🔒 Freeze Account
                  </button>
                ) : (
                  <button className="adm-action-btn adm-action-btn--success">
                    ✓ Activate Account
                  </button>
                )}
                <button className="adm-action-btn adm-action-btn--danger">
                  ⚑ Flag for Review
                </button>
                <button className="adm-action-btn"
                  onClick={() => {
                    const text = [
                      '===== VAULTX ACCOUNT STATEMENT =====',
                      `Account No : ${acc.accountNumber}`,
                      `Holder     : ${acc.holderName || acc.name}`,
                      `Balance    : ₹${Number(acc.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
                      `Status     : ${acc.status}`,
                      '=====================================',
                      ...txns.map(t => `${fmtDate(t.timestamp)} | ${t.type} | ₹${t.amount}`),
                      '=====================================',
                    ].join('\n');
                    const blob = new Blob([text], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url; a.download = `Statement_${acc.accountNumber}.txt`; a.click();
                    URL.revokeObjectURL(url);
                  }}>
                  ↓ Download Statement
                </button>
                <button className="adm-action-btn">
                  📧 Send Alert
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
