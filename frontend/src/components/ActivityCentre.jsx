// src/components/ActivityCentre.jsx
import React, { useState } from 'react';
import Modal from './Modal';
import { showToast } from './Toast';

const styles = `
  .vx-ac { padding: 0 40px 40px; font-family: 'Inter', sans-serif; }
  .vx-ac-chip {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 10px; font-weight: 800; letter-spacing: 0.18em;
    text-transform: uppercase; color: #3D3535;
    background: rgba(61,53,53,0.07); border: 1px solid rgba(61,53,53,0.15);
    padding: 5px 12px; border-radius: 99px; margin-bottom: 12px;
  }
  .vx-ac-heading { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; color: #1A1A2E; margin-bottom: 28px; }
  .vx-ac-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
  .vx-ac-card {
    background: #FFFFFF; border: 1px solid #EDE8E1; border-radius: 20px;
    padding: 28px 24px; cursor: pointer;
    transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
    display: flex; flex-direction: column; gap: 14px;
  }
  .vx-ac-card:hover { box-shadow: 0 10px 32px rgba(0,0,0,0.09); transform: translateY(-3px); border-color: #D0CCC6; }
  .vx-ac-icon { width: 52px; height: 52px; border-radius: 15px; display: flex; align-items: center; justify-content: center; }
  .vx-ac-card-title { font-size: 16px; font-weight: 700; color: #1A1A2E; }
  .vx-ac-card-desc { font-size: 13px; color: #6C6C80; line-height: 1.5; }
  .vx-ac-arrow { color: #6C6C80; margin-top: auto; }

  /* Modal content styles */
  .vx-modal-section-title { font-size: 13px; font-weight: 700; color: #1A1A2E; margin-bottom: 10px; }
  .vx-modal-label { font-size: 11px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; color: #6C6C80; display: block; margin-bottom: 7px; }
  .vx-modal-input, .vx-modal-select {
    width: 100%; padding: 11px 14px; background: #FAF7F4;
    border: 1.5px solid #EDE8E1; border-radius: 11px;
    font-family: 'Inter', sans-serif; font-size: 14px; color: #0F0F1A;
    outline: none; transition: border-color 0.2s; margin-bottom: 16px;
  }
  .vx-modal-input:focus, .vx-modal-select:focus { border-color: #3D3535; background: #FFFFFF; }
  .vx-format-tabs { display: flex; gap: 8px; margin-bottom: 20px; }
  .vx-format-tab {
    flex: 1; padding: 10px 0; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer;
    border: 1.5px solid #EDE8E1; background: #FAF7F4; color: #6C6C80; transition: all 0.18s;
  }
  .vx-format-tab.active { background: #3D3535; color: #FFFFFF; border-color: #3D3535; }
  .vx-modal-cta {
    width: 100%; padding: 13px; border-radius: 12px;
    background: #3D3535; color: #FFFFFF; border: none;
    font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer;
    transition: background 0.18s;
  }
  .vx-modal-cta:hover { background: #2A2A2A; }
  .vx-modal-cta.orange { background: #E8580C; }
  .vx-modal-cta.orange:hover { background: #C9460A; }
  .vx-progress-bar { height: 8px; background: #EDE8E1; border-radius: 99px; overflow: hidden; margin: 8px 0 4px; }
  .vx-progress-fill { height: 100%; background: #3D3535; border-radius: 99px; width: 50%; }
  .vx-passbook-header {
    display: flex; justify-content: space-between; align-items: center;
    padding-bottom: 16px; border-bottom: 2px solid #EDE8E1; margin-bottom: 16px;
  }
  .vx-passbook-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .vx-passbook-table th { padding: 10px 12px; background: #FAF7F4; font-size: 10px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #6C6C80; text-align: left; border-bottom: 1px solid #EDE8E1; }
  .vx-passbook-table td { padding: 10px 12px; border-bottom: 1px solid #F5F0EB; }
  .vx-passbook-table tr:nth-child(even) td { background: #FAF7F4; }
  .vx-nominee-note { font-size: 12px; color: #6C6C80; margin-top: 12px; padding: 12px; background: #FAF7F4; border-radius: 10px; }

  @media (max-width: 768px) {
    .vx-ac { padding: 0 20px 32px; }
    .vx-ac-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 500px) {
    .vx-ac-grid { grid-template-columns: 1fr; }
  }
`;

const CARDS = [
  {
    id: 'statement', title: 'Account Statement', desc: 'Download detailed transaction history',
    bg: '#3D3535', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  },
  {
    id: 'chequebook', title: 'Cheque Book', desc: 'Request or track your cheque book',
    bg: '#E8580C', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  },
  {
    id: 'passbook', title: 'Passbook', desc: 'View & download your passbook',
    bg: '#F9C74F', iconColor: '#92670A',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#92670A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  },
  {
    id: 'nominee', title: 'Nominee Details', desc: 'Add or update account nominee',
    bg: '#7C3AED', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
  {
    id: 'offers', title: 'Bank Offers & Upgrades', desc: 'Loans, upgrades & exclusive benefits',
    bg: '#10B981', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  },
];

function StatementModal({ onClose }) {
  const [format, setFormat] = useState('PDF');
  return (
    <Modal isOpen onClose={onClose} title="Account Statement">
      <label className="vx-modal-label">From Date</label>
      <input className="vx-modal-input" type="date" />
      <label className="vx-modal-label">To Date</label>
      <input className="vx-modal-input" type="date" />
      <label className="vx-modal-label">Format</label>
      <div className="vx-format-tabs">
        {['PDF', 'Excel', 'CSV'].map(f => <button key={f} className={`vx-format-tab${format === f ? ' active' : ''}`} onClick={() => setFormat(f)}>{f}</button>)}
      </div>
      <button className="vx-modal-cta" onClick={() => { showToast('Statement downloaded!', 'success'); onClose(); }}>Generate Statement</button>
    </Modal>
  );
}

function ChequebookModal({ onClose }) {
  return (
    <Modal isOpen onClose={onClose} title="Cheque Book">
      <div className="vx-modal-section-title">Current Status</div>
      <p style={{ fontSize: 14, color: '#6C6C80', marginBottom: 8 }}>25 leaves remaining</p>
      <div className="vx-progress-bar"><div className="vx-progress-fill" /></div>
      <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 20 }}>50% used</p>
      <label className="vx-modal-label">Request New Cheque Book</label>
      <select className="vx-modal-select">
        <option>25 leaves</option><option>50 leaves</option><option>100 leaves</option>
      </select>
      <label className="vx-modal-label">Delivery Address</label>
      <input className="vx-modal-input" defaultValue="123, Main Street, Mumbai, MH - 400001" />
      <button className="vx-modal-cta orange" onClick={() => { showToast('Cheque book requested!', 'success'); onClose(); }}>Request Cheque Book</button>
    </Modal>
  );
}

function PassbookModal({ onClose }) {
  const rows = [
    { date: '24 Mar', narration: 'Credit - UPI', debit: '-', credit: '₹5,000', balance: '₹12,345' },
    { date: '23 Mar', narration: 'Electricity Bill', debit: '₹1,200', credit: '-', balance: '₹7,345' },
    { date: '21 Mar', narration: 'Salary Credit', debit: '-', credit: '₹75,000', balance: '₹8,545' },
  ];
  return (
    <Modal isOpen onClose={onClose} title="Passbook" maxWidth="640px">
      <div className="vx-passbook-header">
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#1A1A2E' }}>Alice Johnson</div>
          <div style={{ fontSize: 12, color: '#6C6C80' }}>AC: **** 1851 · IFSC: VLTX0001234</div>
        </div>
        <span style={{ fontSize: 11, color: '#10B981', fontWeight: 700, background: 'rgba(16,185,129,0.1)', padding: '4px 12px', borderRadius: 99, border: '1px solid rgba(16,185,129,0.2)' }}>● ACTIVE</span>
      </div>
      <table className="vx-passbook-table">
        <thead><tr><th>Date</th><th>Narration</th><th>Debit</th><th>Credit</th><th>Balance</th></tr></thead>
        <tbody>
          {rows.map((r, i) => <tr key={i}><td style={{ color: '#6C6C80' }}>{r.date}</td><td>{r.narration}</td><td style={{ color: '#E8580C' }}>{r.debit}</td><td style={{ color: '#10B981' }}>{r.credit}</td><td style={{ fontWeight: 700 }}>{r.balance}</td></tr>)}
        </tbody>
      </table>
      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button className="vx-modal-cta" style={{ flex: 1 }} onClick={() => { showToast('Passbook downloaded!', 'success'); onClose(); }}>Download PDF</button>
        <button className="vx-modal-cta" style={{ flex: 1, background: '#FAF7F4', color: '#3D3535', border: '1.5px solid #EDE8E1' }} onClick={() => showToast('Printing...', 'info')}>Print</button>
      </div>
    </Modal>
  );
}

function NomineeModal({ onClose }) {
  return (
    <Modal isOpen onClose={onClose} title="Nominee Details">
      <label className="vx-modal-label">Full Name</label>
      <input className="vx-modal-input" placeholder="Nominee full name" />
      <label className="vx-modal-label">Date of Birth</label>
      <input className="vx-modal-input" type="date" />
      <label className="vx-modal-label">Relationship</label>
      <select className="vx-modal-select">
        {['Spouse', 'Child', 'Parent', 'Sibling', 'Other'].map(r => <option key={r}>{r}</option>)}
      </select>
      <label className="vx-modal-label">% Share of Assets</label>
      <input className="vx-modal-input" type="number" placeholder="e.g. 100" min="0" max="100" />
      <button className="vx-modal-cta" onClick={() => { showToast('Nominee saved successfully!', 'success'); onClose(); }}>Save Nominee</button>
      <p className="vx-nominee-note">ℹ️ Nominee details are for simulation purposes only and have no legal standing.</p>
    </Modal>
  );
}

function OffersModal({ onClose }) {
  const [tab, setTab] = useState('Upgrade');
  return (
    <Modal isOpen onClose={onClose} title="Bank Offers & Upgrades" maxWidth="600px">
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['Upgrade', 'Loans', 'Insurance', 'Investments'].map(t => (
          <button key={t} className={`vx-format-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)} style={{ flex: 1 }}>{t}</button>
        ))}
      </div>
      {tab === 'Upgrade' && (
        <>
          <div style={{ background: '#FAF7F4', border: '1px solid #EDE8E1', borderRadius: 14, padding: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <strong style={{ fontSize: 14 }}>Savings Premium</strong>
              <span style={{ fontSize: 11, color: '#E8580C', fontWeight: 700, background: 'rgba(232,88,12,0.1)', padding: '3px 10px', borderRadius: 99 }}>₹500/yr</span>
            </div>
            <ul style={{ fontSize: 13, color: '#6C6C80', paddingLeft: 16, lineHeight: 1.8 }}>
              <li>Higher daily transfer limits</li><li>Priority support</li><li>Free cheque books</li>
            </ul>
            <button className="vx-modal-cta" style={{ marginTop: 12 }} onClick={() => showToast('Upgrade request submitted!', 'success')}>Upgrade Now</button>
          </div>
          <div style={{ background: '#FAF7F4', border: '1px solid #EDE8E1', borderRadius: 14, padding: 16 }}>
            <strong style={{ fontSize: 14 }}>Salary Account (Zero Balance)</strong>
            <p style={{ fontSize: 13, color: '#6C6C80', marginTop: 6 }}>No minimum balance required. Free cheque books. Salary credit benefits.</p>
            <button className="vx-modal-cta" style={{ marginTop: 12, background: '#FAF7F4', color: '#3D3535', border: '1.5px solid #EDE8E1' }} onClick={() => showToast('Application submitted!', 'info')}>Apply Now</button>
          </div>
        </>
      )}
      {tab === 'Loans' && (
        <div style={{ background: '#FAF7F4', border: '1px solid #EDE8E1', borderRadius: 14, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Pre-approved Personal Loan</strong>
              <p style={{ fontSize: 13, color: '#6C6C80', marginTop: 4 }}>₹2,00,000 at 10.5% p.a. — Up to 60 months</p>
            </div>
            <span style={{ fontSize: 10, fontWeight: 800, color: '#10B981', background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: 99 }}>PRE-APPROVED</span>
          </div>
          <button className="vx-modal-cta" style={{ marginTop: 16 }} onClick={() => showToast('Loan application submitted!', 'success')}>Apply Now</button>
        </div>
      )}
      {(tab === 'Insurance' || tab === 'Investments') && (
        <p style={{ color: '#6C6C80', textAlign: 'center', padding: '32px 0', fontSize: 14 }}>Coming soon — {tab} offerings will be available shortly.</p>
      )}
    </Modal>
  );
}

export default function ActivityCentre() {
  const [activeModal, setActiveModal] = useState(null);
  const close = () => setActiveModal(null);

  return (
    <>
      <style>{styles}</style>
      <section className="vx-ac">
        <div className="vx-ac-chip">⚙ Activity Centre</div>
        <h2 className="vx-ac-heading">Manage Your Account</h2>
        <div className="vx-ac-grid">
          {CARDS.map(c => (
            <div key={c.id} className="vx-ac-card" onClick={() => setActiveModal(c.id)}>
              <div className="vx-ac-icon" style={{ background: c.bg }}>{c.icon}</div>
              <div>
                <div className="vx-ac-card-title">{c.title}</div>
                <div className="vx-ac-card-desc">{c.desc}</div>
              </div>
              <div className="vx-ac-arrow">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </section>

      {activeModal === 'statement'   && <StatementModal   onClose={close} />}
      {activeModal === 'chequebook'  && <ChequebookModal  onClose={close} />}
      {activeModal === 'passbook'    && <PassbookModal    onClose={close} />}
      {activeModal === 'nominee'     && <NomineeModal     onClose={close} />}
      {activeModal === 'offers'      && <OffersModal      onClose={close} />}
    </>
  );
}
