// src/components/CashbackOffers.jsx
import React from 'react';

const styles = `
  .vx-cb { padding: 0 40px 40px; font-family: 'Inter', sans-serif; }
  .vx-cb-chip {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 10px; font-weight: 800; letter-spacing: 0.18em;
    text-transform: uppercase; color: #92670A;
    background: rgba(249,199,79,0.15); border: 1px solid rgba(249,199,79,0.3);
    padding: 5px 12px; border-radius: 99px; margin-bottom: 12px;
  }
  .vx-cb-heading { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; color: #1A1A2E; margin-bottom: 28px; }

  /* Reward stat cards */
  .vx-cb-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px; }
  .vx-cb-stat {
    background: #FFFFFF; border: 1px solid #EDE8E1; border-radius: 18px; padding: 20px;
    display: flex; align-items: center; gap: 16px;
  }
  .vx-cb-stat-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .vx-cb-stat-label { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #6C6C80; margin-bottom: 4px; }
  .vx-cb-stat-value { font-size: 24px; font-weight: 800; }

  /* Offer cards */
  .vx-offers-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px; }
  .vx-offer-card {
    background: #FFFFFF; border: 1px solid #EDE8E1; border-radius: 18px; padding: 20px;
    position: relative; overflow: hidden;
    transition: box-shadow 0.18s ease, transform 0.18s ease;
    border-left-width: 4px;
  }
  .vx-offer-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.08); transform: translateY(-2px); }
  .vx-offer-badge {
    position: absolute; top: 16px; right: 16px;
    font-size: 9px; font-weight: 800; letter-spacing: 0.12em;
    text-transform: uppercase; padding: 4px 10px; border-radius: 99px;
    background: rgba(249,199,79,0.15); color: #92670A;
    border: 1px solid rgba(249,199,79,0.3);
  }
  .vx-offer-cat { font-size: 15px; font-weight: 700; color: #1A1A2E; margin-bottom: 6px; }
  .vx-offer-desc { font-size: 13px; color: #6C6C80; line-height: 1.5; margin-bottom: 12px; }
  .vx-offer-expiry { font-size: 11px; color: #9CA3AF; margin-bottom: 14px; }
  .vx-offer-cta {
    padding: 9px 18px; border-radius: 10px;
    border: 1.5px solid #3D3535; background: transparent; color: #3D3535;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700;
    cursor: pointer; transition: all 0.18s ease;
  }
  .vx-offer-cta:hover { background: #3D3535; color: #FFFFFF; }

  /* Cashback Table */
  .vx-cb-table { background: #FFFFFF; border: 1px solid #EDE8E1; border-radius: 18px; overflow: hidden; }
  .vx-cb-table table { width: 100%; border-collapse: collapse; }
  .vx-cb-table th {
    padding: 14px 20px; font-size: 10px; font-weight: 800; letter-spacing: 0.1em;
    text-transform: uppercase; color: #6C6C80; text-align: left;
    border-bottom: 1px solid #EDE8E1; background: #FAFAF9;
  }
  .vx-cb-table td { padding: 14px 20px; font-size: 13px; color: #1A1A2E; }
  .vx-cb-table tr:nth-child(even) td { background: #FAF7F4; }
  .vx-cb-status {
    font-size: 9px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 4px 10px; border-radius: 99px;
  }
  .status-credited { background: rgba(16,185,129,0.1); color: #10B981; }
  .status-pending  { background: rgba(232,88,12,0.1); color: #E8580C; }
  .status-expired  { background: rgba(108,108,128,0.1); color: #6C6C80; }
  .vx-cb-footer {
    display: flex; justify-content: flex-end; padding: 16px 20px;
    border-top: 1px solid #EDE8E1;
  }
  .vx-view-all {
    background: none; border: none; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 700;
    color: #3D3535; display: flex; align-items: center; gap: 5px;
    transition: opacity 0.18s;
  }
  .vx-view-all:hover { opacity: 0.7; }

  @media (max-width: 768px) {
    .vx-cb { padding: 0 20px 32px; }
    .vx-cb-stats { grid-template-columns: 1fr; }
    .vx-offers-grid { grid-template-columns: 1fr; }
  }
`;

const STATS = [
  { label: 'Total Cashback Earned', value: '₹2,847', color: '#F9C74F', bg: 'rgba(249,199,79,0.12)',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F9C74F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg> },
  { label: 'Pending Cashback', value: '₹340', color: '#E8580C', bg: 'rgba(232,88,12,0.1)',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E8580C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
  { label: 'Coins Balance', value: '12,450 pts', color: '#7C3AED', bg: 'rgba(124,58,237,0.1)',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
];

const OFFERS = [
  { cat: 'Electricity Bills', badge: '10% CASHBACK', desc: 'On electricity bill payments above ₹500', expiry: 'Valid till 31 Mar 2026', border: '#F9C74F' },
  { cat: 'Mobile Recharge', badge: 'FLAT ₹50 OFF', desc: 'On Jio/Airtel prepaid recharges above ₹199', expiry: 'Valid till 30 Apr 2026', border: '#E8580C' },
  { cat: 'Online Shopping', badge: '5% CASHBACK', desc: 'On Amazon & Flipkart purchases above ₹999', expiry: 'Valid till 15 Apr 2026', border: '#7C3AED' },
  { cat: 'Fuel Payments', badge: '1% CASHBACK', desc: 'On fuel payments at partner stations', expiry: 'Valid till 28 Feb 2026', border: '#10B981' },
];

const HISTORY = [
  { date: '24 Mar 2026', desc: 'Electricity Bill Cashback', amount: '₹120', status: 'CREDITED' },
  { date: '20 Mar 2026', desc: 'Mobile Recharge Cashback', amount: '₹25', status: 'CREDITED' },
  { date: '15 Mar 2026', desc: 'Shopping Cashback', amount: '₹195', status: 'PENDING' },
  { date: '01 Mar 2026', desc: 'Fuel Payment Cashback', amount: '₹50', status: 'CREDITED' },
  { date: '20 Feb 2026', desc: 'Expired Offer Reward', amount: '₹75', status: 'EXPIRED' },
];

export default function CashbackOffers() {
  return (
    <>
      <style>{styles}</style>
      <section className="vx-cb">
        <div className="vx-cb-chip">⭐ Cashback &amp; Offers</div>
        <h2 className="vx-cb-heading">Your Rewards</h2>

        <div className="vx-cb-stats">
          {STATS.map(s => (
            <div key={s.label} className="vx-cb-stat">
              <div className="vx-cb-stat-icon" style={{ background: s.bg }}>{s.icon}</div>
              <div>
                <div className="vx-cb-stat-label">{s.label}</div>
                <div className="vx-cb-stat-value" style={{ color: s.color }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="vx-offers-grid">
          {OFFERS.map(o => (
            <div key={o.cat} className="vx-offer-card" style={{ borderLeftColor: o.border }}>
              <span className="vx-offer-badge">{o.badge}</span>
              <div className="vx-offer-cat">{o.cat}</div>
              <div className="vx-offer-desc">{o.desc}</div>
              <div className="vx-offer-expiry">🗓 {o.expiry}</div>
              <button className="vx-offer-cta">Avail Offer</button>
            </div>
          ))}
        </div>

        <div className="vx-cb-table">
          <table>
            <thead>
              <tr><th>Date</th><th>Description</th><th>Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              {HISTORY.map((h, i) => (
                <tr key={i}>
                  <td style={{ color: '#6C6C80' }}>{h.date}</td>
                  <td>{h.desc}</td>
                  <td style={{ fontWeight: 700 }}>{h.amount}</td>
                  <td><span className={`vx-cb-status status-${h.status.toLowerCase()}`}>{h.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="vx-cb-footer">
            <button className="vx-view-all">View All Rewards →</button>
          </div>
        </div>
      </section>
    </>
  );
}
