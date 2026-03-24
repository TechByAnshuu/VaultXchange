// src/components/TransactionsSection.jsx
import React, { useState } from 'react';

const styles = `
  .vx-txn { padding: 0 40px 40px; font-family: 'Inter', sans-serif; }
  .vx-txn-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
  .vx-txn-heading { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; color: #1A1A2E; }
  .vx-date-pills { display: flex; gap: 6px; }
  .vx-date-pill {
    padding: 7px 14px; border-radius: 99px; font-size: 12px; font-weight: 600; cursor: pointer;
    border: 1.5px solid #EDE8E1; background: #FAF7F4; color: #6C6C80;
    transition: all 0.18s ease;
  }
  .vx-date-pill.active { background: #3D3535; color: #FFFFFF; border-color: #3D3535; }

  /* Summary */
  .vx-txn-summary {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;
  }
  .vx-summary-card {
    background: #FFFFFF; border: 1px solid #EDE8E1; border-radius: 16px; padding: 16px 20px;
  }
  .vx-summary-label { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #6C6C80; margin-bottom: 6px; }
  .vx-summary-value { font-size: 22px; font-weight: 800; }

  /* Filters */
  .vx-filter-bar { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
  .vx-filter-search {
    flex: 1; min-width: 200px; padding: 11px 15px;
    background: #FFFFFF; border: 1.5px solid #EDE8E1; border-radius: 12px;
    font-family: 'Inter', sans-serif; font-size: 14px; color: #0F0F1A;
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .vx-filter-search:focus { border-color: #3D3535; box-shadow: 0 0 0 3px rgba(61,53,53,0.07); }
  .vx-filter-type { display: flex; gap: 6px; }
  .vx-ftype-btn {
    padding: 10px 14px; border-radius: 10px; font-size: 12px; font-weight: 600; cursor: pointer;
    border: 1.5px solid #EDE8E1; background: #FAF7F4; color: #6C6C80;
    transition: all 0.18s ease;
  }
  .vx-ftype-btn.active { background: #3D3535; color: #FFFFFF; border-color: #3D3535; }

  /* Transaction rows */
  .vx-txn-list { display: flex; flex-direction: column; gap: 10px; }
  .vx-txn-row {
    background: #FFFFFF; border: 1px solid #EDE8E1; border-radius: 14px;
    padding: 16px 20px; display: flex; align-items: center; gap: 16px;
    cursor: pointer; transition: box-shadow 0.2s ease, border-color 0.2s ease;
  }
  .vx-txn-row:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.07); border-color: #D8D3CC; }
  .vx-txn-icon {
    width: 46px; height: 46px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .vx-txn-mid { flex: 1; min-width: 0; }
  .vx-txn-title { font-size: 14px; font-weight: 600; color: #1A1A2E; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .vx-txn-sub { font-size: 12px; color: #6C6C80; margin-top: 2px; }
  .vx-txn-ref { font-size: 10px; color: #9CA3AF; font-family: 'Courier New', monospace; margin-top: 3px; }
  .vx-txn-right { text-align: right; flex-shrink: 0; }
  .vx-txn-amount { font-size: 15px; font-weight: 800; white-space: nowrap; }
  .vx-txn-badge {
    font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 3px 9px; border-radius: 99px; margin-top: 5px; display: inline-block;
  }
  .badge-completed { background: rgba(16,185,129,0.1); color: #10B981; }
  .badge-pending   { background: rgba(232,88,12,0.1); color: #E8580C; }
  .badge-failed    { background: rgba(107,114,128,0.1); color: #6B7280; }

  /* Expanded row */
  .vx-txn-expand {
    background: #FAF7F4; border-radius: 0 0 14px 14px;
    padding: 20px; margin-top: -12px;
    border: 1px solid #EDE8E1; border-top: none;
    display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
  }
  .vx-txn-expand-item label { font-size: 10px; color: #6C6C80; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; display: block; margin-bottom: 3px; }
  .vx-txn-expand-item span  { font-size: 13px; color: #1A1A2E; font-weight: 600; }
  .vx-expand-actions { grid-column: 1/-1; display: flex; gap: 10px; margin-top: 8px; }
  .vx-expand-btn {
    padding: 9px 18px; border-radius: 10px;
    font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.18s;
  }
  .vx-expand-btn-outline { border: 1.5px solid #EDE8E1; background: #FFFFFF; color: #3D3535; }
  .vx-expand-btn-outline:hover { border-color: #3D3535; }
  .vx-expand-btn-ghost { border: none; background: none; color: #E8580C; }

  .vx-load-more {
    display: block; margin: 24px auto 0; padding: 12px 32px;
    border: 1.5px solid #EDE8E1; border-radius: 12px;
    background: #FAF7F4; color: #3D3535; font-family: 'Inter', sans-serif;
    font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.18s;
  }
  .vx-load-more:hover { background: #EDE8E1; border-color: #D0CCC6; }

  @media (max-width: 768px) {
    .vx-txn { padding: 0 20px 32px; }
    .vx-txn-summary { grid-template-columns: 1fr; }
    .vx-filter-type { display: none; }
    .vx-txn-expand { grid-template-columns: 1fr; }
  }
`;

const TYPE_COLORS = { CREDIT: '#10B981', DEBIT: '#3D3535', TRANSFER: '#E8580C', SYSTEM: '#7C3AED' };
const TYPE_BG = { CREDIT: 'rgba(16,185,129,0.1)', DEBIT: 'rgba(61,53,53,0.08)', TRANSFER: 'rgba(232,88,12,0.1)', SYSTEM: 'rgba(124,58,237,0.1)' };

function TxnIcon({ type }) {
  const color = TYPE_COLORS[type];
  const bg = TYPE_BG[type];
  const icons = {
    CREDIT: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
    DEBIT:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
    TRANSFER: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>,
    SYSTEM: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/></svg>,
  };
  return <div className="vx-txn-icon" style={{ background: bg }}>{icons[type]}</div>;
}

export default function TransactionsSection({ transactions = [] }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [datePill, setDatePill] = useState('This Month');
  const [expandedId, setExpandedId] = useState(null);

  const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

  const filtered = transactions.filter(t => {
    if (filter !== 'All' && t.type !== filter.toUpperCase()) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !String(t.amount).includes(search)) return false;
    return true;
  });

  const totalCredited = transactions.filter(t => t.type === 'CREDIT').reduce((s, t) => s + t.amount, 0);
  const totalDebited  = transactions.filter(t => t.type !== 'CREDIT').reduce((s, t) => s + t.amount, 0);
  const netFlow = totalCredited - totalDebited;

  return (
    <>
      <style>{styles}</style>
      <section className="vx-txn">
        <div className="vx-txn-header">
          <h2 className="vx-txn-heading">Money In & Out</h2>
          <div className="vx-date-pills">
            {['This Week', 'This Month', 'Custom'].map(p => (
              <button key={p} className={`vx-date-pill${datePill === p ? ' active' : ''}`} onClick={() => setDatePill(p)}>{p}</button>
            ))}
          </div>
        </div>

        <div className="vx-txn-summary">
          <div className="vx-summary-card">
            <div className="vx-summary-label">Total Credited</div>
            <div className="vx-summary-value" style={{ color: '#10B981' }}>{fmt(totalCredited)}</div>
          </div>
          <div className="vx-summary-card">
            <div className="vx-summary-label">Total Debited</div>
            <div className="vx-summary-value" style={{ color: '#3D3535' }}>{fmt(totalDebited)}</div>
          </div>
          <div className="vx-summary-card">
            <div className="vx-summary-label">Net Flow</div>
            <div className="vx-summary-value" style={{ color: netFlow >= 0 ? '#F9C74F' : '#E8580C' }}>{netFlow >= 0 ? '+' : ''}{fmt(netFlow)}</div>
          </div>
        </div>

        <div className="vx-filter-bar">
          <input className="vx-filter-search" placeholder="Search by name or amount..." value={search} onChange={e => setSearch(e.target.value)} />
          <div className="vx-filter-type">
            {['All', 'Credit', 'Debit', 'Transfer'].map(f => (
              <button key={f} className={`vx-ftype-btn${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
        </div>

        <div className="vx-txn-list">
          {filtered.map(t => (
            <div key={t.id}>
              <div className="vx-txn-row" onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}>
                <TxnIcon type={t.type} />
                <div className="vx-txn-mid">
                  <div className="vx-txn-title">{t.title}</div>
                  <div className="vx-txn-sub">{t.subtitle} · {t.date} {t.time}</div>
                  <div className="vx-txn-ref">{t.reference}</div>
                </div>
                <div className="vx-txn-right">
                  <div className="vx-txn-amount" style={{ color: t.type === 'CREDIT' ? '#10B981' : '#1A1A2E' }}>
                    {t.type === 'CREDIT' ? '+' : '-'}{fmt(t.amount)}
                  </div>
                  <span className={`vx-txn-badge badge-${t.status.toLowerCase()}`}>{t.status}</span>
                </div>
              </div>
              {expandedId === t.id && (
                <div className="vx-txn-expand">
                  <div className="vx-txn-expand-item"><label>Transaction Mode</label><span>{t.mode}</span></div>
                  <div className="vx-txn-expand-item"><label>Charges</label><span>{t.charges === 0 ? 'Free' : fmt(t.charges)}</span></div>
                  <div className="vx-txn-expand-item"><label>Reference</label><span style={{ fontFamily: 'monospace' }}>{t.reference}</span></div>
                  <div className="vx-txn-expand-item"><label>Status</label><span className={`vx-txn-badge badge-${t.status.toLowerCase()}`}>{t.status}</span></div>
                  <div className="vx-expand-actions">
                    <button className="vx-expand-btn vx-expand-btn-outline">⬇ Download Receipt</button>
                    <button className="vx-expand-btn vx-expand-btn-ghost">Report Issue</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <button className="vx-load-more">Load More Transactions</button>
      </section>
    </>
  );
}
