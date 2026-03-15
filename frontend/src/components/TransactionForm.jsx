import { useState } from 'react';
import { deposit, withdraw, transfer } from '../services/transactionService';
import { useAccounts } from '../store/AccountContext';
import Alert from './Alert';

const TransactionForm = ({ account }) => {
  const { refreshAccounts, accounts } = useAccounts();
  const [activeTab, setActiveTab] = useState('DEPOSIT');
  const [amount, setAmount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [notification, setNotification] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification(null);
    try {
      const amtNum = parseFloat(amount);
      if (activeTab === 'DEPOSIT') {
        await deposit(account.accountNumber, amtNum);
      } else if (activeTab === 'WITHDRAW') {
        await withdraw(account.accountNumber, amtNum);
      } else if (activeTab === 'TRANSFER') {
        await transfer(account.accountNumber, toAccount, amtNum);
      }
      setNotification({ type: 'success', message: `${activeTab} of $${amtNum} successful!` });
      setAmount('');
      setToAccount('');
      refreshAccounts();
    } catch (err) {
      setNotification({ 
        type: 'error', 
        message: err.response?.data?.error || `Failed to process ${activeTab.toLowerCase()}` 
      });
    }
  };

  const tabs = ['DEPOSIT', 'WITHDRAW', 'TRANSFER'];

  return (
    <div className="glass-card">
      <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--text-main)' }}>Operations</h3>
      
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {tabs.map(tab => (
          <button
            key={tab}
            className={`btn ${activeTab === tab ? 'btn-primary' : ''}`}
            style={{ 
              flex: 1, 
              background: activeTab === tab ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
              border: activeTab === tab ? 'none' : '1px solid rgba(255,255,255,0.1)'
            }}
            onClick={() => { setActiveTab(tab); setNotification(null); }}
          >
            {tab}
          </button>
        ))}
      </div>

      {notification && (
        <Alert 
          type={notification.type} 
          message={notification.message} 
          onClose={() => setNotification(null)}
          style={{ marginBottom: '1rem' }}
        />
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Amount ($)</label>
          <input 
            type="number" 
            step="0.01" 
            min="0.01"
            className="form-control" 
            value={amount} 
            onChange={e => setAmount(e.target.value)}
            required
            placeholder="0.00"
          />
        </div>

        {activeTab === 'TRANSFER' && (
          <div className="form-group">
            <label>Destination Account Number</label>
            <select 
              className="form-control" 
              value={toAccount} 
              onChange={e => setToAccount(e.target.value)}
              required
            >
              <option value="">Select Account...</option>
              {accounts.filter(a => a.accountNumber !== account.accountNumber).map(a => (
                <option key={a.accountNumber} value={a.accountNumber}>
                  {a.holderName} ({a.accountNumber})
                </option>
              ))}
            </select>
          </div>
        )}

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Execute {activeTab}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
