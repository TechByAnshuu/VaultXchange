// src/components/QuickActions.jsx
import React, { useState } from 'react';
import { showToast } from './Toast';

const styles = `
  .vx-qa { padding: 0 40px 40px; font-family: 'Inter', sans-serif; }
  .vx-section-heading {
    font-family: 'Playfair Display', serif;
    font-size: 28px; font-weight: 700; color: #1A1A2E; margin-bottom: 24px;
  }
  .vx-tiles-row {
    display: grid; grid-template-columns: repeat(6, 1fr); gap: 14px;
    margin-bottom: 32px;
  }
  .vx-tile {
    background: #FFFFFF; border: 1px solid #EDE8E1;
    border-radius: 20px; padding: 22px 14px;
    display: flex; flex-direction: column; align-items: center; gap: 12px;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    text-align: center;
  }
  .vx-tile:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 36px rgba(0,0,0,0.1);
    border-color: #3D3535;
  }
  .vx-tile-icon {
    width: 56px; height: 56px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .vx-tile-label {
    font-size: 12px; font-weight: 700; color: #1A1A2E; line-height: 1.3;
  }

  /* Transfer panel */
  .vx-transfer-panel {
    background: #FFFFFF; border-radius: 22px;
    border: 1px solid #EDE8E1;
    border-top: 4px solid #3D3535;
    padding: 32px;
  }
  .vx-transfer-title {
    font-size: 18px; font-weight: 700; color: #1A1A2E; margin-bottom: 28px;
    display: flex; align-items: center; gap: 10px;
  }
  .vx-transfer-form {
    display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
  }
  .vx-tf-group { display: flex; flex-direction: column; gap: 7px; }
  .vx-tf-label {
    font-size: 11px; font-weight: 700; letter-spacing: 0.07em;
    text-transform: uppercase; color: #6C6C80;
  }
  .vx-tf-input, .vx-tf-select {
    padding: 12px 15px; background: #FAF7F4;
    border: 1.5px solid #EDE8E1; border-radius: 12px;
    font-family: 'Inter', sans-serif; font-size: 14px; color: #0F0F1A;
    outline: none; width: 100%;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .vx-tf-input:focus, .vx-tf-select:focus {
    border-color: #3D3535; box-shadow: 0 0 0 3px rgba(61,53,53,0.07);
    background: #FFFFFF;
  }
  .vx-tf-amount { font-size: 28px; font-weight: 800; color: #F9C74F; }
  .vx-transfer-type-tabs {
    display: flex; gap: 8px; margin-top: 4px;
  }
  .vx-ttype-tab {
    flex: 1; padding: 9px 0; border-radius: 10px;
    font-size: 12px; font-weight: 700; cursor: pointer;
    border: 1.5px solid #EDE8E1; background: #FAF7F4; color: #6C6C80;
    transition: all 0.18s ease;
  }
  .vx-ttype-tab.active { background: #3D3535; color: #FFFFFF; border-color: #3D3535; }
  .vx-transfer-time-badge {
    font-size: 11px; font-weight: 600; color: #10B981;
    background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2);
    border-radius: 99px; padding: 4px 12px; display: inline-block; margin-top: 8px;
  }
  .vx-transfer-cta {
    grid-column: 1 / -1;
    width: 100%; height: 52px; border-radius: 14px;
    background: #3D3535; color: #FFFFFF; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 700;
    border: none; display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.18s ease;
    margin-top: 8px;
  }
  .vx-transfer-cta:hover {
    background: #2A2A2A; box-shadow: 0 8px 24px rgba(61,53,53,0.25);
    transform: translateY(-1px);
  }
  .vx-security-note {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    font-size: 12px; color: #6C6C80; margin-top: 14px;
  }

  @media (max-width: 900px) {
    .vx-qa { padding: 0 20px 32px; }
    .vx-tiles-row { grid-template-columns: repeat(3, 1fr); }
    .vx-transfer-form { grid-template-columns: 1fr; }
  }
  @media (max-width: 500px) {
    .vx-tiles-row { grid-template-columns: repeat(2, 1fr); }
  }
`;

const TILES = [
  { label: 'Bank Transfer', bg: '#3D3535', iconColor: 'white',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> },
  { label: 'Pay by UPI ID', bg: '#E8580C', iconColor: 'white',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> },
  { label: 'Recharge & Bills', bg: '#F9C74F', iconColor: '#92670A',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#92670A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
  { label: 'Pay by Mobile', bg: '#10B981', iconColor: 'white',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> },
  { label: 'Cashback & Offers', bg: '#7C3AED', iconColor: 'white',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7m0 0H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zm0 0h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg> },
  { label: 'Scan & Pay', bg: '#1A1A2E', iconColor: 'white',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
];

const TRANSFER_TIMES = { IMPS: 'Instant Transfer', NEFT: '2-Hour Settlement', RTGS: 'Same Day Settlement' };

export default function QuickActions() {
  const [transferType, setTransferType] = useState('IMPS');
  const [form, setForm] = useState({ to: '', name: '', bank: '', ifsc: '', amount: '', remarks: '' });

  const handleInput = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    if (!form.to || !form.amount) {
      showToast('Please fill in the required fields', 'error');
      return;
    }
    showToast(`₹${form.amount} transferred successfully!`, 'success', `via ${transferType} to ${form.to}`);
    setForm({ to: '', name: '', bank: '', ifsc: '', amount: '', remarks: '' });
  };

  return (
    <>
      <style>{styles}</style>
      <section className="vx-qa">
        <h2 className="vx-section-heading">What would you like to do?</h2>

        <div className="vx-tiles-row">
          {TILES.map((t) => (
            <div key={t.label} className="vx-tile">
              <div className="vx-tile-icon" style={{ background: t.bg }}>{t.icon}</div>
              <span className="vx-tile-label">{t.label}</span>
            </div>
          ))}
        </div>

        {/* Bank Transfer Panel */}
        <div className="vx-transfer-panel">
          <div className="vx-transfer-title">
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#3D3535', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {TILES[0].icon}
            </div>
            Bank Transfer
          </div>

          <div className="vx-transfer-form">
            {/* Left col */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="vx-tf-group">
                <label className="vx-tf-label">Transfer To</label>
                <input className="vx-tf-input" name="to" placeholder="Account number or UPI ID" value={form.to} onChange={handleInput} />
              </div>
              <div className="vx-tf-group">
                <label className="vx-tf-label">Beneficiary Name</label>
                <input className="vx-tf-input" name="name" placeholder="Auto-populated" value={form.to ? 'Henry Williams' : ''} readOnly style={{ color: form.to ? '#10B981' : '#9CA3AF' }} />
              </div>
              <div className="vx-tf-group">
                <label className="vx-tf-label">Bank Name</label>
                <select className="vx-tf-select" name="bank" value={form.bank} onChange={handleInput}>
                  <option value="">Select bank</option>
                  {['VaultX Internal', 'SBI', 'HDFC', 'ICICI', 'Axis'].map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="vx-tf-group">
                <label className="vx-tf-label">IFSC Code</label>
                <input className="vx-tf-input" name="ifsc" placeholder="e.g. VLTX0001234" value={form.ifsc} onChange={handleInput} />
              </div>
            </div>

            {/* Right col */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="vx-tf-group">
                <label className="vx-tf-label">Amount (₹)</label>
                <input className="vx-tf-input vx-tf-amount" name="amount" type="number" placeholder="0.00" value={form.amount} onChange={handleInput} />
              </div>
              <div className="vx-tf-group">
                <label className="vx-tf-label">Transfer Type</label>
                <div className="vx-transfer-type-tabs">
                  {['IMPS', 'NEFT', 'RTGS'].map(t => (
                    <button key={t} className={`vx-ttype-tab${transferType === t ? ' active' : ''}`} onClick={() => setTransferType(t)}>{t}</button>
                  ))}
                </div>
                <span className="vx-transfer-time-badge">⚡ {TRANSFER_TIMES[transferType]}</span>
              </div>
              <div className="vx-tf-group">
                <label className="vx-tf-label">Remarks (Optional)</label>
                <input className="vx-tf-input" name="remarks" placeholder="Add a note..." value={form.remarks} onChange={handleInput} />
              </div>
            </div>

            <button className="vx-transfer-cta" onClick={handleSubmit}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
              Transfer Money
            </button>
          </div>

          <div className="vx-security-note">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6C6C80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            256-bit encrypted · RBI compliant simulation
          </div>
        </div>
      </section>
    </>
  );
}
