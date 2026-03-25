// src/pages/CustomerHome.jsx
import React, { useState, useRef } from 'react';
import CustomerNavbar from '../components/CustomerNavbar';
import CustomerFooter from '../components/CustomerFooter';
import AccountOverview from '../components/AccountOverview';
import QuickActions from '../components/QuickActions';
import TransactionsSection from '../components/TransactionsSection';
import CashbackOffers from '../components/CashbackOffers';
import ActivityCentre from '../components/ActivityCentre';
import ToastContainer from '../components/Toast';
import TransactionModal from '../components/TransactionModal';
import TransactionToastContainer, { showTransactionToast } from '../components/TransactionToast';
import { getTransactionHistory } from '../services/transactionService';
import { currentUser } from '../data/mockData';

const homeStyles = `
  .vx-home { background: #F5F0EB; min-height: 100vh; font-family: 'Inter', sans-serif; }
  .vx-home-body { padding-top: 64px; }
  .vx-section-divider { height: 1px; background: #EDE8E1; margin: 0 40px; }
  @media (max-width: 768px) {
    .vx-section-divider { margin: 0 20px; }
  }
`;

const fmt = (n) =>
  `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function CustomerHome() {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [bankTransactions, setBankTransactions] = useState([]);
  const [activeAccountId, setActiveAccountId] = useState(null);
  const [activeTab, setActiveTab] = useState('Home');
  const [modalType, setModalType] = useState(null);
  const [loading, setLoading] = useState(true);

  // Local balance override — applied on top of fetched data for instant UI updates
  const [balanceDelta, setBalanceDelta] = useState(0);
  // Pill state  { sign: '+' | '-', amount: number } | null
  const [balancePill, setBalancePill] = useState(null);
  // Local new transactions prepended
  const [localTxns, setLocalTxns] = useState([]);

  React.useEffect(() => {
    fetchData();
  }, [activeAccountId]);

  const fetchData = async () => {
    try {
      const u = JSON.parse(localStorage.getItem('vx_user')) || currentUser;
      const acc = await import('../services/accountService').then(m => m.getAccountDetails(u.account));
      const accs = acc ? [acc] : [];
      if (accs && accs.length > 0) {
        const mappedAccs = accs.map(a => ({
          ...a,
          type: a.status === 'ACTIVE' ? 'SAVINGS' : 'CURRENT',
          maskedNumber: `**** **** **** ${a.accountNumber.slice(-4)}`
        }));
        setBankAccounts(mappedAccs);
        // Reset delta on fresh fetch (backend is now the source of truth)
        setBalanceDelta(0);

        const activeId = activeAccountId || mappedAccs[0].id;
        if (!activeAccountId) setActiveAccountId(activeId);

        const currentAcc = mappedAccs.find(a => a.id === activeId) || mappedAccs[0];

        try {
          const txns = await getTransactionHistory(currentAcc.accountNumber);
          const mappedTxns = txns.map(t => {
            const isCredit = t.type === 'DEPOSIT' || (t.type === 'TRANSFER' && t.toAccountNumber === currentAcc.accountNumber);
            let sub = 'Bank Transaction';
            if (t.type === 'DEPOSIT') sub = `Deposit to ${currentAcc.accountNumber}`;
            else if (t.type === 'WITHDRAW') sub = `Withdrawal from ${currentAcc.accountNumber}`;
            else if (t.type === 'TRANSFER') {
              if (isCredit) sub = `From ${t.fromAccountName ? t.fromAccountName + ' (' + t.fromAccountNumber + ')' : t.fromAccountNumber}`;
              else sub = `To ${t.toAccountName ? t.toAccountName + ' (' + t.toAccountNumber + ')' : t.toAccountNumber}`;
            }
            return {
              id: t.id,
              type: isCredit ? 'CREDIT' : 'DEBIT',
              title: t.type === 'DEPOSIT' ? 'Deposit' : t.type === 'WITHDRAW' ? 'Withdrawal' : 'Transfer',
              subtitle: sub,
              amount: t.amount,
              date: new Date(t.timestamp).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
              time: new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              mode: 'SYSTEM', status: 'COMPLETED', accountId: currentAcc.id,
              _fromBackend: true,
            };
          });
          setBankTransactions(mappedTxns);
          setLocalTxns([]); // backend refresh clears local prepends (they're now in the list)
        } catch (e) {
          console.error('No transactions or history error', e);
        }
      }
    } catch (err) {
      console.error('Failed to load banking data', err);
    } finally {
      setLoading(false);
    }
  };

  // Called by TransactionModal when a transaction completes
  const handleBalanceChange = ({ type, amount, toAccountNo, recipientName }) => {
    const isCredit = type === 'credit';
    const delta = isCredit ? amount : -amount;
    setBalanceDelta(prev => prev + delta);

    // Show floating pill
    setBalancePill({ sign: isCredit ? '+' : '-', amount });
    setTimeout(() => setBalancePill(null), 3200);

    // Prepend local transaction
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const activeAcc2 = bankAccounts.find(a => a.id === activeAccountId) || bankAccounts[0];
    const accNo = activeAcc2?.accountNumber || '';
    const holderName = activeAcc2?.holderName || activeAcc2?.name || 'Account Holder';

    let subTxt = '';
    let titleTxt = '';
    let senderName = '', senderAccount = '', receiverName = '', receiverAccount = '', mode = '';

    if (type === 'credit') {
      titleTxt = 'Add Money';
      subTxt = `Deposit to ${accNo}`;
      senderName = 'Self Deposit'; senderAccount = accNo;
      receiverName = holderName;   receiverAccount = accNo;
      mode = 'CASH DEPOSIT';
    } else if (type === 'debit') {
      titleTxt = 'Withdrawal';
      subTxt = `Withdrawal from ${accNo}`;
      senderName = holderName;      senderAccount = accNo;
      receiverName = 'ATM / Branch Withdrawal'; receiverAccount = 'N/A';
      mode = 'CASH WITHDRAWAL';
    } else {
      titleTxt = recipientName ? `Transfer to ${recipientName}` : 'Transfer';
      subTxt = `To ${recipientName || toAccountNo || ''} (${toAccountNo || ''})`;
      senderName = holderName;          senderAccount = accNo;
      receiverName = recipientName || 'Beneficiary'; receiverAccount = toAccountNo || '—';
      mode = 'IMPS';
    }

    const txnId = `TXN${Date.now().toString().slice(-10)}`;
    const newTxn = {
      id: txnId,
      type: isCredit ? 'CREDIT' : 'DEBIT',
      title: titleTxt, subtitle: subTxt,
      amount, date: dateStr, time: timeStr,
      dateDisplay: dateStr, timeDisplay: timeStr,
      senderName, senderAccount, receiverName, receiverAccount,
      mode, status: 'COMPLETED',
      charges: 0, remarks: '',
      _isNew: true,
    };
    setLocalTxns(prev => [newTxn, ...prev]);


    // Compute new balance for toast
    const activeAcc = bankAccounts.find(a => a.id === activeAccountId) || bankAccounts[0];
    const currentBal = activeAcc ? activeAcc.balance + balanceDelta : 0;
    const newBal = currentBal + delta;

    // Fire toast
    if (type === 'credit') {
      showTransactionToast({
        type: 'credit',
        title: 'Money Added Successfully!',
        amount: `+${fmt(amount)}`,
        sub: `New balance: ${fmt(newBal)}`,
      });
    } else if (type === 'debit') {
      showTransactionToast({
        type: 'debit',
        title: 'Withdrawal Successful',
        amount: `-${fmt(amount)}`,
        sub: `Remaining balance: ${fmt(newBal)}`,
      });
    } else {
      showTransactionToast({
        type: 'transfer',
        title: 'Transfer Complete',
        amount: `-${fmt(amount)}`,
        sub: recipientName ? `To ${recipientName}${toAccountNo ? ' · ' + toAccountNo : ''}` : `Account ${toAccountNo || ''}`,
      });
    }
  };

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('vx_user')) || currentUser; }
    catch { return currentUser; }
  })();

  // Build accounts with local delta applied
  const displayAccounts = bankAccounts.map(a =>
    a.id === activeAccountId
      ? { ...a, balance: a.balance + balanceDelta }
      : a
  );

  // Merged transactions (local first, then backend)
  const allTransactions = [...localTxns, ...bankTransactions];

  return (
    <>
      <style>{homeStyles}</style>
      <div className="vx-home">
        <CustomerNavbar
          activeTab={activeTab}
          userName={bankAccounts.length > 0 ? (bankAccounts.find(a => a.id === activeAccountId) || bankAccounts[0]).holderName : 'Loading...'}
          unreadCount={2}
          onTabChange={setActiveTab}
        />
        <div className="vx-home-body">
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#6C6C80' }}>Loading your bank details...</div>
          ) : bankAccounts.length > 0 ? (
            <>
              <AccountOverview
                accounts={displayAccounts}
                transactions={allTransactions}
                activeAccountId={activeAccountId}
                onSwitchAccount={setActiveAccountId}
                onActionClick={setModalType}
                balancePill={balancePill}
              />
              <div className="vx-section-divider" />
              <TransactionsSection transactions={allTransactions} />
            </>
          ) : (
            <div style={{ padding: '60px', textAlign: 'center', color: '#6C6C80' }}>
              No accounts found. Please contact the bank administrator.
            </div>
          )}
          <div className="vx-section-divider" />
          <QuickActions />
          <div className="vx-section-divider" />
          <CashbackOffers />
          <div className="vx-section-divider" />
          <ActivityCentre />
          <CustomerFooter />
        </div>
        <ToastContainer />
        <TransactionToastContainer />

        {/* Dynamic Modals */}
        <TransactionModal
          isOpen={!!modalType}
          type={modalType}
          activeAccount={displayAccounts.find(a => a.id === activeAccountId) || displayAccounts[0]}
          onClose={() => setModalType(null)}
          onComplete={fetchData}
          onBalanceChange={handleBalanceChange}
        />
      </div>
    </>
  );
}
