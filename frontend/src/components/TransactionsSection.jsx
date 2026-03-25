// src/components/TransactionsSection.jsx
import React, { useState } from 'react';

const styles = `
  @keyframes slideInDown {
    from { transform: translateY(-20px); opacity: 0; }
    to   { transform: translateY(0);     opacity: 1; }
  }
  @keyframes fadeHighlight {
    0%   { background: var(--hl-color, #E8F7F0); }
    100% { background: #FFFFFF; }
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .vx-txn-row--new {
    animation: slideInDown 0.4s ease forwards, fadeHighlight 2s ease 0.4s forwards;
  }
  .vx-txn-row--new-debit {
    --hl-color: #FEE9DC;
    animation: slideInDown 0.4s ease forwards, fadeHighlight 2s ease 0.4s forwards;
  }
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
  .vx-txn-right { text-align: right; flex-shrink: 0; }
  .vx-txn-amount { font-size: 15px; font-weight: 800; white-space: nowrap; }
  .vx-txn-badge {
    font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 3px 9px; border-radius: 99px; margin-top: 5px; display: inline-block;
  }
  .badge-completed { background: rgba(16,185,129,0.1); color: #10B981; }
  .badge-pending   { background: rgba(232,88,12,0.1); color: #E8580C; }
  .badge-failed    { background: rgba(107,114,128,0.1); color: #6B7280; }

  /* ── RICH DETAILS PANEL ── */
  .txn-details-panel {
    background: #FAF7F4; border-top: 1px solid #EDE8E1;
    border-radius: 0 0 14px 14px;
    padding: 20px 24px;
    animation: slideDown 0.25s ease forwards;
  }
  .txn-details-header {
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;
  }
  .txn-details-type-badge {
    padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;
    letter-spacing: 0.05em;
  }
  .txn-details-type-badge--CREDIT  { background: rgba(16,185,129,0.12); color: #10B981; }
  .txn-details-type-badge--DEBIT   { background: rgba(232,88,12,0.12);  color: #E8580C; }
  .txn-details-type-badge--TRANSFER { background: rgba(61,53,53,0.1);   color: #3D3535; }
  .txn-status-pill {
    background: #E8F7F0; color: #10B981; font-size: 10px; font-weight: 700;
    padding: 3px 10px; border-radius: 99px; letter-spacing: 0.06em;
  }
  .txn-details-amount {
    display: flex; align-items: baseline; gap: 12px;
    margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #EDE8E1;
  }
  .txn-details-amount-value { font-size: 28px; font-weight: 800; font-family: 'Inter', sans-serif; }
  .txn-details-amount-label { font-size: 12px; color: #6C6C80; font-family: 'Inter', sans-serif; }

  .txn-details-grid { display: flex; flex-direction: column; gap: 0; margin-bottom: 0; }
  .txn-detail-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 0; border-bottom: 1px solid #EDE8E1;
  }
  .txn-detail-row:last-child { border-bottom: none; }
  .txn-detail-label {
    font-size: 11px; font-family: 'Inter', sans-serif;
    text-transform: uppercase; letter-spacing: 0.6px; color: #6C6C80; flex-shrink: 0;
  }
  .txn-detail-value { font-size: 13px; font-weight: 500; color: #1A1A2E; font-family: 'Inter', sans-serif; text-align: right; }
  .txn-detail-value--mono { font-family: 'Courier New', monospace; font-size: 12px; }
  .txn-detail-value--bold { font-weight: 700; }
  .txn-detail-sub { display: block; font-size: 11px; color: #6C6C80; margin-top: 2px; }
  .txn-detail-free-badge {
    background: #E8F7F0; color: #10B981; font-size: 9px; font-weight: 700;
    padding: 2px 6px; border-radius: 10px; margin-left: 6px; letter-spacing: 0.5px;
  }
  .mode-chip {
    background: #EDE8E1; color: #3D3535; font-size: 10px; font-weight: 700;
    padding: 3px 8px; border-radius: 10px; letter-spacing: 0.5px; font-family: 'Inter', sans-serif;
  }
  .txn-details-actions { display: flex; gap: 10px; margin-top: 16px; border-top: 1px solid #EDE8E1; padding-top: 16px; }
  .txn-btn {
    flex: 1; height: 40px; border-radius: 10px;
    font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif;
    border: 1.5px solid #EDE8E1; background: white; color: #3D3535;
    transition: all 0.2s;
  }
  .txn-btn:hover { background: #FAF7F4; border-color: #3D3535; }
  .txn-btn--danger-ghost { color: #E8580C; border-color: #FEE9DC; }
  .txn-btn--danger-ghost:hover { background: #FEE9DC; }

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
  return <div className="vx-txn-icon" style={{ background: bg }}>{icons[type] || icons.SYSTEM}</div>;
}

const fmtAmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function DetailsPanel({ t }) {
  const typeDisplay = {
    CREDIT:   '↙ Money Received',
    DEBIT:    '↗ Money Sent',
    TRANSFER: '⇄ Transfer',
  }[t.type] || '⇄ Transfer';

  const amtColor = t.type === 'CREDIT' ? '#10B981' : '#E8580C';
  const sign     = t.type === 'CREDIT' ? '+' : '-';

  // Robust field resolution — backend rows vs local rows
  const senderName     = t.senderName     || (t.type === 'CREDIT' ? 'Bank / External'   : 'Self');
  const senderAccount  = t.senderAccount  || (t.type === 'CREDIT' ? '—'                 : t.accountId || '—');
  const receiverName   = t.receiverName   || (t.type === 'CREDIT' ? 'Self'              : 'Bank / External');
  const receiverAccount= t.receiverAccount|| (t.type === 'CREDIT' ? t.accountId || '—' : '—');
  const mode           = t.mode && t.mode !== 'SYSTEM' ? t.mode : (
    t.type === 'CREDIT' ? 'CASH DEPOSIT' : t.type === 'DEBIT' ? 'CASH WITHDRAWAL' : 'IMPS'
  );
  const charges        = 0;
  const txnId          = String(t.id || '').replace(/^LOCAL_TXN_/, 'TXN');
  const dateDisplay    = t.dateDisplay || t.date || '—';
  const timeDisplay    = t.timeDisplay || t.time || '—';
  const remarks        = t.remarks || '';

  const handleDownloadReceipt = () => {
    const divider = '─'.repeat(42);
    const receipt = [
      '╔══════════════════════════════════════════╗',
      '      VaultX Exchange — Official Receipt   ',
      '╚══════════════════════════════════════════╝',
      '',
      `  Transaction Type : ${
        t.type === 'CREDIT'   ? 'MONEY RECEIVED (CREDIT)' :
        t.type === 'DEBIT'    ? 'CASH WITHDRAWAL (DEBIT)' :
                                'FUND TRANSFER'
      }`,
      `  ${divider}`,
      `  Transaction ID   : #${txnId}`,
      `  Date             : ${dateDisplay}`,
      `  Time             : ${timeDisplay}`,
      `  ${divider}`,
      `  FROM`,
      `    Name           : ${senderName}`,
      `    Account No     : ${senderAccount}`,
      `  ${divider}`,
      `  TO`,
      `    Name           : ${receiverName}`,
      `    Account No     : ${receiverAccount}`,
      `  ${divider}`,
      `  Amount           : ${fmtAmt(t.amount)}`,
      `  Charges          : ₹0.00 (Waived)`,
      `  Net Amount       : ${fmtAmt(t.amount)}`,
      `  Transfer Mode    : ${mode}`,
      remarks ? `  Remarks          : ${remarks}` : '',
      `  ${divider}`,
      `  Status           : ✓ COMPLETED`,
      `  ${divider}`,
      '',
      '  This is a computer-generated receipt.',
      '  No signature required.',
      '  VaultX Exchange — Banking Simulation Platform',
      '  Powered by Infosys Springboard Internship 2026',
      '',
      '╔══════════════════════════════════════════╗',
      '      Thank you for banking with VaultX    ',
      '╚══════════════════════════════════════════╝',
    ].filter(l => l !== null).join('\n');

    const blob = new Blob([receipt], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `VaultX_Receipt_${txnId}_${dateDisplay.replace(/ /g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="txn-details-panel">
      {/* Header */}
      <div className="txn-details-header">
        <span className={`txn-details-type-badge txn-details-type-badge--${t.type}`}>
          {typeDisplay}
        </span>
        <span className="txn-status-pill">● COMPLETED</span>
      </div>

      {/* Amount Hero */}
      <div className="txn-details-amount">
        <span className="txn-details-amount-value" style={{ color: amtColor }}>
          {sign}{fmtAmt(t.amount)}
        </span>
        <span className="txn-details-amount-label">{dateDisplay} · {timeDisplay}</span>
      </div>

      {/* Details Grid */}
      <div className="txn-details-grid">
        <div className="txn-detail-row">
          <span className="txn-detail-label">Transaction ID</span>
          <span className="txn-detail-value txn-detail-value--mono">#{txnId}</span>
        </div>
        <div className="txn-detail-row">
          <span className="txn-detail-label">From</span>
          <div className="txn-detail-value">
            <strong>{senderName}</strong>
            <span className="txn-detail-sub">{senderAccount}</span>
          </div>
        </div>
        <div className="txn-detail-row">
          <span className="txn-detail-label">To</span>
          <div className="txn-detail-value">
            <strong>{receiverName}</strong>
            <span className="txn-detail-sub">{receiverAccount}</span>
          </div>
        </div>
        <div className="txn-detail-row">
          <span className="txn-detail-label">Transfer Mode</span>
          <span className="txn-detail-value"><span className="mode-chip">{mode}</span></span>
        </div>
        <div className="txn-detail-row">
          <span className="txn-detail-label">Charges</span>
          <span className="txn-detail-value">
            ₹0.00 <span className="txn-detail-free-badge">FREE</span>
          </span>
        </div>
        <div className="txn-detail-row">
          <span className="txn-detail-label">Net Amount</span>
          <span className="txn-detail-value txn-detail-value--bold">{fmtAmt(t.amount)}</span>
        </div>
        {remarks && (
          <div className="txn-detail-row">
            <span className="txn-detail-label">Remarks</span>
            <span className="txn-detail-value">{remarks}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="txn-details-actions">
        <button className="txn-btn" onClick={handleDownloadReceipt}>↓ Download Receipt</button>
        <button className="txn-btn txn-btn--danger-ghost">⚑ Report Issue</button>
      </div>
    </div>
  );
}

export default function TransactionsSection({ transactions = [] }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [datePill, setDatePill] = useState('This Month');
  const [expandedId, setExpandedId] = useState(null);

  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  const filtered = transactions.filter(t => {
    if (filter !== 'All' && t.type !== filter.toUpperCase()) return false;
    if (search && !t.title?.toLowerCase().includes(search.toLowerCase()) && !String(t.amount).includes(search)) return false;
    return true;
  });

  const totalCredited = transactions.filter(t => t.type === 'CREDIT').reduce((s, t) => s + Number(t.amount || 0), 0);
  const totalDebited  = transactions.filter(t => t.type !== 'CREDIT').reduce((s, t) => s + Number(t.amount || 0), 0);
  const netFlow = totalCredited - totalDebited;

  return (
    <>
      <style>{styles}</style>
      <section className="vx-txn">
        <div className="vx-txn-header">
          <h2 className="vx-txn-heading">Money In &amp; Out</h2>
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
              <div
                className={`vx-txn-row${t._isNew ? (t.type === 'CREDIT' ? ' vx-txn-row--new' : ' vx-txn-row--new-debit') : ''}`}
                onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}
                style={{ borderRadius: expandedId === t.id ? '14px 14px 0 0' : 14 }}
              >
                <TxnIcon type={t.type} />
                <div className="vx-txn-mid">
                  <div className="vx-txn-title">{t.title}</div>
                  <div className="vx-txn-sub">{t.subtitle} · {t.date || t.dateDisplay} {t.time || t.timeDisplay}</div>
                </div>
                <div className="vx-txn-right">
                  <div className="vx-txn-amount" style={{ color: t.type === 'CREDIT' ? '#10B981' : '#1A1A2E' }}>
                    {t.type === 'CREDIT' ? '+' : '-'}{fmt(t.amount)}
                  </div>
                  <span className={`vx-txn-badge badge-${(t.status || 'completed').toLowerCase()}`}>{t.status || 'COMPLETED'}</span>
                </div>
              </div>
              {expandedId === t.id && <DetailsPanel t={t} />}
            </div>
          ))}
        </div>

        <button className="vx-load-more">Load More Transactions</button>
      </section>
    </>
  );
}
