// src/components/TransactionModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { deposit, withdraw, transfer } from '../services/transactionService';

const modalStyles = `
  @keyframes spinLoader {
    to { transform: rotate(360deg); }
  }
  @keyframes drawCircle {
    to { stroke-dashoffset: 0; }
  }
  @keyframes drawCheck {
    to { stroke-dashoffset: 0; }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .txm-loader-wrap {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 18px; padding: 48px 0; font-family: 'Inter', sans-serif;
  }
  .txm-spinner {
    width: 48px; height: 48px; border-radius: 50%;
    border: 4px solid #EDE8E1; border-top-color: #3D3535;
    animation: spinLoader 0.85s linear infinite;
  }
  .txm-loader-text { font-size: 14px; color: #6C6C80; font-weight: 500; }

  /* Receipt */
  .txm-receipt {
    display: flex; flex-direction: column; align-items: center;
    gap: 0; padding: 8px 0 0; font-family: 'Inter', sans-serif;
    animation: fadeInUp 0.4s ease forwards;
  }
  .txm-receipt-check { margin-bottom: 16px; }
  .txm-receipt-title {
    font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700;
    color: #1A1A2E; margin-bottom: 14px; text-align: center;
  }
  .txm-receipt-amount-box {
    background: #FAF7F4; border-radius: 14px; padding: 14px 32px;
    text-align: center; margin-bottom: 20px; width: 100%;
  }
  .txm-receipt-amount-label { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #6C6C80; margin-bottom: 4px; }
  .txm-receipt-amount-val { font-size: 28px; font-weight: 800; color: #3D3535; }

  .txm-details-card {
    background: #FAF7F4; border-radius: 14px; padding: 16px; width: 100%;
    display: flex; flex-direction: column; gap: 0; margin-bottom: 20px;
  }
  .txm-detail-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 0; border-bottom: 1px solid #EDE8E1;
  }
  .txm-detail-row:last-child { border-bottom: none; }
  .txm-detail-label { font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #6C6C80; }
  .txm-detail-val   { font-size: 13px; font-weight: 600; color: #1A1A2E; text-align: right; max-width: 55%; }
  .txm-status-badge {
    display: inline-block; padding: 3px 10px; border-radius: 99px;
    background: #E8F7F0; color: #10B981; font-size: 10px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
  }

  .txm-receipt-actions {
    display: flex; gap: 12px; width: 100%;
  }
  .txm-btn-ghost {
    flex: 1; padding: 13px; border-radius: 12px;
    border: 1.5px solid #EDE8E1; background: #EDE8E1; color: #3D3535;
    font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer;
    transition: all 0.18s ease;
  }
  .txm-btn-ghost:hover { background: #D8D3CC; border-color: #D8D3CC; }
  .txm-btn-primary {
    flex: 1; padding: 13px; border-radius: 12px;
    border: none; background: #3D3535; color: #FFFFFF;
    font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer;
    transition: all 0.18s ease;
  }
  .txm-btn-primary:hover { background: #2A2A2A; }

  .txm-input-err {
    border-color: #E8580C !important;
    box-shadow: 0 0 0 3px rgba(232,88,12,0.12) !important;
  }
  .txm-err-text {
    font-size: 12px; color: #E8580C; font-weight: 600; margin-top: 4px;
  }
`;

function AnimatedCheck() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64">
      <circle
        cx="32" cy="32" r="28"
        fill="none" stroke="#10B981" strokeWidth="3.5"
        strokeDasharray="176" strokeDashoffset="176"
        style={{ animation: 'drawCircle 0.5s ease forwards' }}
      />
      <polyline
        points="20,33 28,41 45,24"
        fill="none" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="50" strokeDashoffset="50"
        style={{ animation: 'drawCheck 0.4s ease 0.45s forwards' }}
      />
    </svg>
  );
}

function downloadReceipt({ txnId, recipientName, accountNo, amount, dateStr }) {
  const text = [
    '===== VaultX TRANSFER RECEIPT =====',
    `Transaction ID : ${txnId}`,
    `Date & Time    : ${dateStr}`,
    `Recipient      : ${recipientName}`,
    `Account No     : ${accountNo}`,
    `Amount         : ₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    'Mode           : IMPS',
    'Status         : COMPLETED',
    '====================================',
  ].join('\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `VaultX_${txnId}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function TransactionModal({ isOpen, onClose, type, activeAccount, onComplete, onBalanceChange }) {
  const [amount, setAmount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [amountErr, setAmountErr] = useState(false);

  // Transfer success flow state: 'form' | 'processing' | 'receipt'
  const [transferStep, setTransferStep] = useState('form');
  const [receiptData, setReceiptData] = useState(null);

  // Reset on open/type change
  useEffect(() => {
    if (isOpen) {
      setAmount(''); setToAccount('');
      setError(''); setAmountErr(false);
      setTransferStep('form'); setReceiptData(null);
    }
  }, [isOpen, type]);

  if (!isOpen) return null;

  const fmt = (n) => `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAmountErr(false);
    const amt = parseFloat(amount);

    if (!amt || amt <= 0) {
      setAmountErr(true);
      setError('Please enter a valid amount.');
      return;
    }

    // Withdraw client-side validation
    if (type === 'withdraw' && activeAccount && amt > activeAccount.balance) {
      setAmountErr(true);
      setError(`⚠ Insufficient funds. Available: ${fmt(activeAccount.balance)}`);
      return;
    }

    // Transfer
    if (type === 'transfer') {
      if (!toAccount.trim()) {
        setError('Please enter a recipient account number.');
        return;
      }

      // Show spinner immediately
      setTransferStep('processing');

      try {
        // Run API call + minimum 1.5s spinner delay in parallel
        await Promise.all([
          transfer(activeAccount.accountNumber, toAccount, amt),
          new Promise(res => setTimeout(res, 1500)),
        ]);

        const txnId = `#TXN${Date.now().toString().slice(-10)}`;
        const now = new Date();
        const dateStr = now.toLocaleString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit', hour12: true
        });
        const recipientName = 'Henry Bugtest';

        setReceiptData({ txnId, dateStr, recipientName, accountNo: toAccount, amount: amt });
        setTransferStep('receipt');

        onComplete?.();
        onBalanceChange?.({ type: 'debit', amount: amt });
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Transfer failed';
        setError(msg);
        setTransferStep('form');
      }
      return;
    }

    // Deposit / Withdraw
    setLoading(true);
    try {
      if (type === 'deposit') {
        await deposit(activeAccount.accountNumber, amt);
        onBalanceChange?.({ type: 'credit', amount: amt });
      } else if (type === 'withdraw') {
        await withdraw(activeAccount.accountNumber, amt);
        onBalanceChange?.({ type: 'debit', amount: amt });
      }
      onComplete?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTransferDone = () => {
    onClose();
  };

  const titles = { deposit: 'Add Money', withdraw: 'Withdraw Funds', transfer: 'Transfer Money' };
  const title = transferStep === 'receipt' ? null : (titles[type] || 'Transaction');

  // Render transfer receipt screen
  if (type === 'transfer' && transferStep === 'processing') {
    return (
      <Modal isOpen={isOpen} onClose={null} title="Transfer Money">
        <style>{modalStyles}</style>
        <div className="txm-loader-wrap">
          <div className="txm-spinner" />
          <span className="txm-loader-text">Processing transfer...</span>
        </div>
      </Modal>
    );
  }

  if (type === 'transfer' && transferStep === 'receipt' && receiptData) {
    const { txnId, dateStr, recipientName, accountNo, amount: amt } = receiptData;
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="">
        <style>{modalStyles}</style>
        <div className="txm-receipt">
          <div className="txm-receipt-check"><AnimatedCheck /></div>
          <div className="txm-receipt-title">Transfer Successful</div>

          <div className="txm-receipt-amount-box">
            <div className="txm-receipt-amount-label">Amount Transferred</div>
            <div className="txm-receipt-amount-val">
              {`₹${Number(amt).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
            </div>
          </div>

          <div className="txm-details-card">
            {[
              ['Recipient Name', recipientName],
              ['Account No', accountNo],
              ['Transaction ID', txnId],
              ['Date & Time', dateStr],
              ['Transfer Mode', 'IMPS — Instant'],
              ['Status', <span className="txm-status-badge">● COMPLETED</span>],
            ].map(([label, val]) => (
              <div className="txm-detail-row" key={label}>
                <span className="txm-detail-label">{label}</span>
                <span className="txm-detail-val">{val}</span>
              </div>
            ))}
          </div>

          <div className="txm-receipt-actions">
            <button
              className="txm-btn-ghost"
              onClick={() => downloadReceipt({ txnId, recipientName, accountNo, amount: amt, dateStr })}
            >
              ↓ Download Receipt
            </button>
            <button className="txm-btn-primary" onClick={handleTransferDone}>
              Done
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  // Default: form view (deposit / withdraw / transfer form)
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <style>{modalStyles}</style>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {error && !amountErr && (
          <div style={{ color: '#E8580C', fontSize: 13, fontWeight: 600 }}>{error}</div>
        )}

        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6C6C80', marginBottom: 6, textTransform: 'uppercase' }}>
            Amount (₹)
          </label>
          <input
            type="number" step="0.01" min="0" placeholder="0.00"
            value={amount} onChange={e => { setAmount(e.target.value); setAmountErr(false); setError(''); }}
            className={amountErr ? 'txm-input-err' : ''}
            style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #EDE8E1', outline: 'none', background: '#FAF7F4', fontSize: 16, fontWeight: 600, boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s' }}
          />
          {amountErr && <div className="txm-err-text">{error}</div>}
        </div>

        {type === 'transfer' && (
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6C6C80', marginBottom: 6, textTransform: 'uppercase' }}>
              To Account Number
            </label>
            <input
              type="text" placeholder="Enter recipient account number"
              value={toAccount} onChange={e => setToAccount(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #EDE8E1', outline: 'none', background: '#FAF7F4', fontSize: 16, fontWeight: 600, boxSizing: 'border-box' }}
            />
            {error && !amountErr && (
              <div className="txm-err-text">{error}</div>
            )}
          </div>
        )}

        <button
          type="submit" disabled={loading}
          style={{
            marginTop: 8, width: '100%', padding: '14px', borderRadius: 12, border: 'none',
            background: '#3D3535', color: '#FFFFFF', fontSize: 15, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
            fontFamily: 'Inter, sans-serif'
          }}
        >
          {loading ? 'Processing...' : `Confirm ${titles[type] || ''}`}
        </button>
      </form>
    </Modal>
  );
}
