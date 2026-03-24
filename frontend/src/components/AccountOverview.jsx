// src/components/AccountOverview.jsx
import React, { useState } from 'react';

const styles = `
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

const fmt = (n) => `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

export default function AccountOverview({ accounts = [], activeAccountId, onSwitchAccount }) {
  const active = accounts.find(a => a.id === activeAccountId) || accounts[0];
  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

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
          <div className="vx-balance-amount">{fmt(active.balance)}</div>
          <div className="vx-card-divider" />
          <div className="vx-card-bottom">
            <span className="vx-card-number">{active.maskedNumber}</span>
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
                <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div className="vx-stat-label">Month Spent</div>
            <div className="vx-stat-value" style={{ color: '#E8580C' }}>$5,828</div>
            <div className="vx-stat-sub">March 2026</div>
          </div>

          {/* Cashback */}
          <div className="vx-stat-card">
            <div className="vx-stat-icon" style={{ background: 'rgba(16,185,129,0.1)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7m0 0H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zm0 0h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
              </svg>
            </div>
            <div className="vx-stat-label">Cashback Earned</div>
            <div className="vx-stat-value" style={{ color: '#10B981' }}>$195</div>
            <div className="vx-stat-sub">This month</div>
          </div>

          {/* Account switcher */}
          <div className="vx-stat-card full">
            <div className="vx-switcher-label">Switch Account</div>
            <div className="vx-switcher-pills">
              {accounts.map(a => (
                <button
                  key={a.id}
                  className={`vx-switcher-pill${a.id === active.id ? ' active' : ''}`}
                  onClick={() => onSwitchAccount?.(a.id)}
                >
                  {a.type} ···{a.accountNumber.slice(-4)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
