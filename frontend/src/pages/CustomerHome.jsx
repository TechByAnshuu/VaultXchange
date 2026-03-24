// src/pages/CustomerHome.jsx
import React, { useState } from 'react';
import CustomerNavbar from '../components/CustomerNavbar';
import CustomerFooter from '../components/CustomerFooter';
import AccountOverview from '../components/AccountOverview';
import QuickActions from '../components/QuickActions';
import TransactionsSection from '../components/TransactionsSection';
import CashbackOffers from '../components/CashbackOffers';
import ActivityCentre from '../components/ActivityCentre';
import ToastContainer from '../components/Toast';
import { accounts, transactions, currentUser } from '../data/mockData';

const homeStyles = `
  .vx-home { background: #F5F0EB; min-height: 100vh; font-family: 'Inter', sans-serif; }
  .vx-home-body { padding-top: 64px; }
  .vx-section-divider { height: 1px; background: #EDE8E1; margin: 0 40px; }
  @media (max-width: 768px) {
    .vx-section-divider { margin: 0 20px; }
  }
`;

export default function CustomerHome() {
  const [activeAccountId, setActiveAccountId] = useState(accounts[0]?.id);
  const [activeTab, setActiveTab] = useState('Home');

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('vx_user')) || currentUser; }
    catch { return currentUser; }
  })();

  return (
    <>
      <style>{homeStyles}</style>
      <div className="vx-home">
        <CustomerNavbar
          activeTab={activeTab}
          userName={user.name || currentUser.name}
          unreadCount={2}
          onTabChange={setActiveTab}
        />
        <div className="vx-home-body">
          <AccountOverview
            accounts={accounts}
            activeAccountId={activeAccountId}
            onSwitchAccount={setActiveAccountId}
          />
          <div className="vx-section-divider" />
          <QuickActions />
          <div className="vx-section-divider" />
          <TransactionsSection transactions={transactions} />
          <div className="vx-section-divider" />
          <CashbackOffers />
          <div className="vx-section-divider" />
          <ActivityCentre />
          <CustomerFooter />
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
