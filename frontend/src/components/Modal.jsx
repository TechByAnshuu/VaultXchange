// src/components/Modal.jsx
import React, { useEffect } from 'react';

const modalStyles = `
  .vx-modal-overlay {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(26,26,46,0.45);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
    animation: vxOverlayIn 0.2s ease both;
  }
  @keyframes vxOverlayIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  .vx-modal {
    background: #FFFFFF;
    border-radius: 24px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.18);
    width: 100%; max-width: 560px;
    max-height: 90vh;
    overflow-y: auto;
    animation: vxModalUp 0.25s cubic-bezier(0.34,1.56,0.64,1) both;
    border: 1px solid #EDE8E1;
  }
  @keyframes vxModalUp {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .vx-modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 24px 28px 20px;
    border-bottom: 1px solid #EDE8E1;
    position: sticky; top: 0; background: #fff; z-index: 1;
    border-radius: 24px 24px 0 0;
  }
  .vx-modal-title {
    font-family: 'Inter', sans-serif;
    font-size: 18px; font-weight: 700; color: #1A1A2E;
  }
  .vx-modal-close {
    width: 36px; height: 36px;
    border: 1px solid #EDE8E1; border-radius: 10px;
    background: #FAF7F4; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.18s ease;
    color: #6C6C80;
  }
  .vx-modal-close:hover { background: #EDE8E1; color: #1A1A2E; }
  .vx-modal-body { padding: 24px 28px; }
  .vx-modal-footer {
    padding: 16px 28px 24px;
    border-top: 1px solid #EDE8E1;
    display: flex; gap: 12px; justify-content: flex-end;
  }
`;

export default function Modal({ isOpen, onClose, title, children, footer, maxWidth = '560px' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <style>{modalStyles}</style>
      <div className="vx-modal-overlay" onClick={onClose}>
        <div className="vx-modal" style={{ maxWidth }} onClick={e => e.stopPropagation()}>
          <div className="vx-modal-header">
            <span className="vx-modal-title">{title}</span>
            <button className="vx-modal-close" onClick={onClose} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="vx-modal-body">{children}</div>
          {footer && <div className="vx-modal-footer">{footer}</div>}
        </div>
      </div>
    </>
  );
}
