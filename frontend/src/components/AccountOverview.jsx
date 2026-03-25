// src/components/AccountOverview.jsx
import React, { useState } from 'react';

const styles = `
  @keyframes floatUp {
    0%   { opacity: 0; transform: translateY(0px); }
    20%  { opacity: 1; transform: translateY(-8px); }
    80%  { opacity: 1; transform: translateY(-16px); }
    100% { opacity: 0; transform: translateY(-28px); }
  }
  .vx-balance-pill {
    position: absolute; top: -32px; right: 0;
    padding: 4px 12px; border-radius: 20px;
    font-size: 12px; font-weight: 700; color: #FFFFFF;
    animation: floatUp 2.8s ease forwards;
    pointer-events: none; white-space: nowrap;
    z-index: 10;
  }
  .vx-balance-pill--credit { background: #10B981; }
  .vx-balance-pill--debit  { background: #E8580C; }
  .vx-overview {
    padding: 32px 40px;
    display: flex;
    gap: 28px;
    align-items: flex-start;
    font-family: 'Inter', sans-serif;
  }

  /* ── Bank Card ── */
  .vx-bank-card {
    width: 420px; flex-shrink: 0;
    background: #3D3535;
    border-radius: 24px;
    padding: 28px;
    position: relative; overflow: hidden;
    cursor: default;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    transform: rotate(-1deg);
    box-shadow: 0 20px 60px rgba(61,53,53,0.35);
  }
  .vx-bank-card:hover {
    transform: rotate(0deg);
    box-shadow: 0 28px 70px rgba(61,53,53,0.4);
  }
  .vx-bank-card::before {
    content: '';
    position: absolute; top: -60px; right: -60px;
    width: 200px; height: 200px; border-radius: 50%;
    background: rgba(255,255,255,0.04);
  }
  .vx-bank-card::after {
    content: '';
    position: absolute; bottom: -40px; left: -40px;
    width: 160px; height: 160px; border-radius: 50%;
    background: rgba(255,255,255,0.03);
  }

  .vx-card-top-row {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 36px;
  }
  .vx-card-type-label {
    display: flex; align-items: center; gap: 8px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.15em;
    text-transform: uppercase; color: rgba(255,255,255,0.55);
  }
  .vx-card-type-dot {
    width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.4);
  }
  .vx-mastercard {
    display: flex; align-items: center;
  }
  .vx-mc-circle {
    width: 32px; height: 32px; border-radius: 50%; opacity: 0.85;
  }
  .vx-mc-left  { background: #3D3535; border: 2px solid rgba(255,255,255,0.3); }
  .vx-mc-right { background: #E8580C; margin-left: -14px; }

  .vx-balance-label {
    font-size: 9px; font-weight: 800; letter-spacing: 0.25em;
    text-transform: uppercase; color: rgba(255,255,255,0.45);
    margin-bottom: 6px;
  }
  .vx-balance-amount {
    font-size: 42px; font-weight: 800; color: #F9C74F;
    letter-spacing: -1px; line-height: 1;
    margin-bottom: 24px;
  }
  .vx-card-divider {
    height: 1px; background: rgba(255,255,255,0.1); margin-bottom: 20px;
  }
  .vx-card-bottom {
    display: flex; justify-content: space-between; align-items: flex-end;
  }
  .vx-card-number {
    font-size: 14px; color: rgba(255,255,255,0.75);
    font-family: 'Courier New', monospace; letter-spacing: 0.08em;
  }
  .vx-card-holder-name {
    font-size: 12px; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: rgba(255,255,255,0.75);
    text-align: right;
  }
  .vx-card-badges {
    display: flex; justify-content: space-between; margin-top: 16px;
  }
  .vx-card-badge {
    font-size: 9px; font-weight: 800; letter-spacing: 0.2em;
    text-transform: uppercase; padding: 4px 10px; border-radius: 99px;
  }
  .vx-card-badge-savings {
    background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.7);
    border: 1px solid rgba(255,255,255,0.15);
  }
  .vx-card-badge-active {
    background: rgba(16,185,129,0.2); color: #10B981;
    border: 1px solid rgba(16,185,129,0.3);
  }

  /* ── Stat Cards ── */
  .vx-stat-grid {
    flex: 1; display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .vx-stat-card {
    background: #FFFFFF; border: 1px solid #EDE8E1;
    border-radius: 18px; padding: 20px;
    position: relative; transition: box-shadow 0.18s ease;
  }
  .vx-stat-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.07); }
  .vx-stat-card.full { grid-column: 1 / -1; }
  .vx-stat-icon {
    width: 38px; height: 38px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    position: absolute; top: 16px; right: 16px;
    flex-shrink: 0;
  }
  .vx-stat-label {
    font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: #6C6C80; margin-bottom: 8px;
  }
  .vx-stat-value {
    font-size: 26px; font-weight: 800; letter-spacing: -0.5px;
    line-height: 1;
  }
  .vx-stat-sub {
    font-size: 12px; color: #6C6C80; margin-top: 4px;
  }

  /* Quick Actions Block */
  .vx-quick-actions-card {
    background: #FFFFFF; border: 1px solid #EDE8E1;
    border-radius: 18px; padding: 20px;
  }
  .vx-qa-btn {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; padding: 12px 16px; border-radius: 12px;
    background: #FAF7F4; border: 1.5px solid #EDE8E1;
    font-size: 14px; font-weight: 700; color: #1A1A2E;
    margin-bottom: 8px; cursor: pointer; transition: all 0.18s;
  }
  .vx-qa-btn:hover { border-color: #3D3535; background: #FFFFFF; }
  .vx-qa-btn:last-child { margin-bottom: 0; }
  .vx-qa-icon {
    width: 28px; height: 28px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
  }

  /* Account switcher pills */
  .vx-switcher-label {
    font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; color: #6C6C80; margin-bottom: 12px;
  }
  .vx-switcher-pills {
    display: flex; flex-wrap: wrap; gap: 8px;
  }
  .vx-switcher-pill {
    padding: 8px 14px; border-radius: 12px;
    font-size: 12px; font-weight: 600;
    cursor: pointer; transition: all 0.18s ease;
    border: 1.5px solid #EDE8E1; background: #FAF7F4; color: #6C6C80;
  }
  .vx-switcher-pill:hover { border-color: #3D3535; color: #3D3535; }
  .vx-switcher-pill.active {
    background: #3D3535; color: #FFFFFF; border-color: #3D3535;
  }

  @media (max-width: 960px) {
    .vx-overview { flex-direction: column; padding: 24px 20px; }
    .vx-bank-card { width: 100%; max-width: 420px; }
    .vx-stat-grid { grid-template-columns: 1fr 1fr; width: 100%; }
  }
  @media (max-width: 500px) {
    .vx-balance-amount { font-size: 34px; }
    .vx-stat-value { font-size: 22px; }
  }
`;

const fmt = (n) => `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function AccountOverview({ accounts = [], transactions = [], activeAccountId, onSwitchAccount, onActionClick, balancePill }) {
  const [showAccNo, setShowAccNo] = useState(false);

  const active = accounts.find(a => a.id === activeAccountId) || accounts[0];
  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

  const currentMonth = new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' });
  const monthSpent = transactions.reduce((sum, t) => {
    if (t.type === 'DEBIT') return sum + Number(t.amount);
    return sum;
  }, 0);

  if (!active) return null;

  return (
    <>
      <style>{styles}</style>
      <section className="vx-overview">
        {/* Bank Card */}
        <div className="vx-bank-card">
          <div className="vx-card-top-row">
            <div className="vx-card-type-label">
              <div className="vx-card-type-dot" />
              {active.type} ACCOUNT
            </div>
            <div className="vx-mastercard">
              <div className="vx-mc-circle vx-mc-left" />
              <div className="vx-mc-circle vx-mc-right" />
            </div>
          </div>
          <div className="vx-balance-label">Available Balance</div>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {balancePill && (
              <span
                className={`vx-balance-pill vx-balance-pill--${balancePill.sign === '+' ? 'credit' : 'debit'}`}
              >
                {balancePill.sign}{fmt(balancePill.amount)}
              </span>
            )}
            <div className="vx-balance-amount"
              style={{ color: balancePill ? (balancePill.sign === '+' ? '#10B981' : '#E8580C') : '#F9C74F',
                       transition: 'color 0.5s ease' }}>
              {fmt(active.balance)}
            </div>
          </div>
          <div className="vx-card-divider" />
          <div className="vx-card-bottom">
            <span className="vx-card-number" onClick={() => setShowAccNo(!showAccNo)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              {showAccNo ? active.accountNumber : active.maskedNumber}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {showAccNo ? (
                  <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </>
                ) : (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                )}
              </svg>
            </span>
            <span className="vx-card-holder-name">{active.holderName}</span>
          </div>
          <div className="vx-card-badges">
            <span className="vx-card-badge vx-card-badge-savings">{active.type}</span>
            <span className="vx-card-badge vx-card-badge-active">● ACTIVE</span>
          </div>
        </div>

        {/* Stat grid */}
        <div className="vx-stat-grid">
          {/* Total Balance */}
          <div className="vx-stat-card">
            <div className="vx-stat-icon" style={{ background: 'rgba(249,199,79,0.12)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F9C74F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <div className="vx-stat-label">Total Balance</div>
            <div className="vx-stat-value" style={{ color: '#F9C74F' }}>{fmt(totalBalance)}</div>
            <div className="vx-stat-sub">Across {accounts.length} accounts</div>
          </div>

          {/* This Month Spent */}
          <div className="vx-stat-card">
            <div className="vx-stat-icon" style={{ background: 'rgba(232,88,12,0.1)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8580C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>
              </svg>
            </div>
            <div className="vx-stat-label">Month Spent</div>
            <div className="vx-stat-value" style={{ color: '#E8580C' }}>{fmt(monthSpent)}</div>
            <div className="vx-stat-sub">{currentMonth}</div>
          </div>

          {/* Add Money Card */}
          <div className="vx-stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="vx-stat-label" style={{ marginBottom: 12 }}>Deposit Funds</div>
            <button className="vx-qa-btn" onClick={() => onActionClick?.('deposit')} style={{ marginBottom: 0, padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="vx-qa-icon" style={{ background: 'rgba(16,185,129,0.1)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </div>
                Add Money
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6C6C80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>

          {/* Quick Actions (Withdraw/Transfer) */}
          <div className="vx-quick-actions-card">
            <div className="vx-stat-label" style={{ marginBottom: 12 }}>Quick Actions</div>
            <button className="vx-qa-btn" onClick={() => onActionClick?.('withdraw')} style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="vx-qa-icon" style={{ background: 'rgba(232,88,12,0.08)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E8580C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </div>
                Withdraw
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6C6C80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
            <button className="vx-qa-btn" onClick={() => onActionClick?.('transfer')} style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="vx-qa-icon" style={{ background: 'rgba(61,53,53,0.08)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3D3535" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                </div>
                Transfer
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6C6C80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>


        </div>
      </section>
    </>
  );
}
