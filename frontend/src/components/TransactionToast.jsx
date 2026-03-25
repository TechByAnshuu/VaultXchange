// src/components/TransactionToast.jsx
import React, { useEffect, useState } from 'react';

const toastStyles = `
  @keyframes slideInRight {
    from { transform: translateX(120%); opacity: 0; }
    to   { transform: translateX(0);    opacity: 1; }
  }
  @keyframes slideOutRight {
    from { transform: translateX(0);    opacity: 1; }
    to   { transform: translateX(120%); opacity: 0; }
  }
  @keyframes drainBar {
    from { width: 100%; }
    to   { width: 0%; }
  }

  .txn-toast {
    position: fixed;
    bottom: 28px; right: 28px;
    width: 320px;
    background: white;
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.14);
    border-left: 4px solid;
    display: flex; gap: 14px; align-items: flex-start;
    z-index: 9999;
    font-family: 'Inter', sans-serif;
    animation: slideInRight 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards;
  }
  .txn-toast.leaving {
    animation: slideOutRight 0.3s ease forwards;
  }
  .txn-toast--credit   { border-color: #10B981; }
  .txn-toast--debit    { border-color: #E8580C; }
  .txn-toast--transfer { border-color: #3D3535; }

  .txn-toast__icon {
    width: 40px; height: 40px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .txn-toast__body { flex: 1; min-width: 0; }
  .txn-toast__title  { font-size: 15px; font-weight: 600; color: #1A1A2E; margin: 0 0 2px; }
  .txn-toast__amount { font-size: 22px; font-weight: 800; margin: 2px 0; }
  .txn-toast__sub    { font-size: 12px; color: #6C6C80; margin: 0; line-height: 1.4; }
  .txn-toast__progress {
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 3px; border-radius: 0 0 20px 20px;
    background: #EDE8E1; overflow: hidden;
  }
  .txn-toast__progress-bar {
    height: 100%; animation: drainBar 4s linear forwards;
  }
  .txn-toast__close {
    position: absolute; top: 12px; right: 14px;
    background: none; border: none; cursor: pointer;
    color: #9CA3AF; font-size: 16px; line-height: 1; padding: 2px;
  }
  .txn-toast__close:hover { color: #3D3535; }

  @media (max-width: 768px) {
    .txn-toast {
      bottom: 0; left: 0; right: 0;
      width: auto; border-radius: 20px 20px 0 0;
      border-left: none; border-top: 4px solid;
    }
  }
`;

const TYPE_CONFIG = {
  credit: {
    iconBg: '#E8F7F0', iconColor: '#10B981', amountColor: '#10B981', barColor: '#10B981',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    )
  },
  debit: {
    iconBg: '#FEE9DC', iconColor: '#E8580C', amountColor: '#E8580C', barColor: '#E8580C',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8580C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="12 5 12 19"/><polyline points="19 12 12 19 5 12"/>
      </svg>
    )
  },
  transfer: {
    iconBg: 'rgba(61,53,53,0.1)', iconColor: '#3D3535', amountColor: '#3D3535', barColor: '#3D3535',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3D3535" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
        <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
      </svg>
    )
  }
};

// Global toast queue manager
let _showToast = null;
export function showTransactionToast(props) {
  if (_showToast) _showToast(props);
}

export default function TransactionToastContainer() {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const [leaving, setLeaving] = useState(false);

  // Register global handler
  useEffect(() => {
    _showToast = (props) => {
      setQueue(q => [...q, { ...props, _id: Date.now() + Math.random() }]);
    };
    return () => { _showToast = null; };
  }, []);

  // Process queue
  useEffect(() => {
    if (!current && queue.length > 0) {
      const [next, ...rest] = queue;
      setQueue(rest);
      setCurrent(next);
      setLeaving(false);
    }
  }, [current, queue]);

  // Auto-dismiss
  useEffect(() => {
    if (!current) return;
    const timer = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => setCurrent(null), 320);
    }, 4000);
    return () => clearTimeout(timer);
  }, [current]);

  if (!current) return <style>{toastStyles}</style>;

  const cfg = TYPE_CONFIG[current.type] || TYPE_CONFIG.credit;

  return (
    <>
      <style>{toastStyles}</style>
      <div className={`txn-toast txn-toast--${current.type}${leaving ? ' leaving' : ''}`} style={{ position: 'fixed' }}>
        <div className="txn-toast__icon" style={{ background: cfg.iconBg }}>
          {cfg.icon}
        </div>
        <div className="txn-toast__body">
          <p className="txn-toast__title">{current.title}</p>
          <p className="txn-toast__amount" style={{ color: cfg.amountColor }}>{current.amount}</p>
          <p className="txn-toast__sub">{current.sub}</p>
        </div>
        <button className="txn-toast__close" onClick={() => { setLeaving(true); setTimeout(() => setCurrent(null), 320); }}>✕</button>
        <div className="txn-toast__progress">
          <div className="txn-toast__progress-bar" style={{ background: cfg.barColor }} />
        </div>
      </div>
    </>
  );
}
