// src/components/Toast.jsx
import React, { useEffect, useState } from 'react';

const toastStyles = `
  .vx-toast-container {
    position: fixed; bottom: 28px; right: 28px;
    z-index: 2000; display: flex; flex-direction: column; gap: 10px;
  }
  .vx-toast {
    display: flex; align-items: center; gap: 12px;
    background: #FFFFFF;
    border: 1px solid #EDE8E1;
    border-radius: 14px;
    padding: 14px 18px;
    min-width: 280px; max-width: 380px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    animation: vxToastIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
    transition: opacity 0.25s ease, transform 0.25s ease;
  }
  .vx-toast.leaving {
    opacity: 0; transform: translateX(20px);
  }
  @keyframes vxToastIn {
    from { opacity: 0; transform: translateX(20px) scale(0.95); }
    to   { opacity: 1; transform: translateX(0) scale(1); }
  }
  .vx-toast-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .vx-toast-icon.success { background: rgba(16,185,129,0.12); }
  .vx-toast-icon.error   { background: rgba(232,88,12,0.1); }
  .vx-toast-icon.info    { background: rgba(61,53,53,0.08); }
  .vx-toast-content { flex: 1; }
  .vx-toast-message { font-size: 14px; font-weight: 600; color: #1A1A2E; }
  .vx-toast-sub { font-size: 12px; color: #6C6C80; margin-top: 2px; }
  .vx-toast-close {
    background: none; border: none; cursor: pointer;
    color: #6C6C80; padding: 4px; border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    transition: color 0.18s;
  }
  .vx-toast-close:hover { color: #1A1A2E; }
  @media (max-width: 500px) {
    .vx-toast-container { bottom: 16px; right: 16px; left: 16px; }
    .vx-toast { min-width: unset; }
  }
`;

const icons = {
  success: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  error: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8580C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D3535" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

function ToastItem({ message, sub, type = 'success', onRemove }) {
  const [leaving, setLeaving] = useState(false);

  const handleClose = () => {
    setLeaving(true);
    setTimeout(onRemove, 250);
  };

  return (
    <div className={`vx-toast${leaving ? ' leaving' : ''}`}>
      <div className={`vx-toast-icon ${type}`}>{icons[type]}</div>
      <div className="vx-toast-content">
        <div className="vx-toast-message">{message}</div>
        {sub && <div className="vx-toast-sub">{sub}</div>}
      </div>
      <button className="vx-toast-close" onClick={handleClose}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

let toastQueue = [];
let toastSetters = [];

export function showToast(message, type = 'success', sub = '') {
  const id = Date.now();
  const toast = { id, message, type, sub };
  toastQueue = [...toastQueue, toast];
  toastSetters.forEach(fn => fn([...toastQueue]));
  setTimeout(() => {
    toastQueue = toastQueue.filter(t => t.id !== id);
    toastSetters.forEach(fn => fn([...toastQueue]));
  }, 4000);
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastSetters.push(setToasts);
    return () => { toastSetters = toastSetters.filter(fn => fn !== setToasts); };
  }, []);

  return (
    <>
      <style>{toastStyles}</style>
      <div className="vx-toast-container">
        {toasts.map(t => (
          <ToastItem key={t.id} {...t} onRemove={() => {
            toastQueue = toastQueue.filter(x => x.id !== t.id);
            setToasts([...toastQueue]);
          }} />
        ))}
      </div>
    </>
  );
}
