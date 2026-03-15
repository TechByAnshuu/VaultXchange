import { useState } from 'react';
import { createAccount } from '../services/accountService';
import { useAccounts } from '../store/AccountContext';
import Alert from './Alert';
import { UserPlus } from 'lucide-react';

const AccountForm = () => {
  const { refreshAccounts } = useAccounts();
  const [formData, setFormData] = useState({ holderName: '', email: '', initialBalance: '' });
  const [notification, setNotification] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAccount({
        holderName: formData.holderName,
        email: formData.email,
        initialBalance: parseFloat(formData.initialBalance)
      });
      setNotification({ type: 'success', message: 'Account successfully created!' });
      setFormData({ holderName: '', email: '', initialBalance: '' });
      refreshAccounts(); // Update the global list
    } catch (error) {
      setNotification({ 
        type: 'error', 
        message: error.response?.data?.error || 'Failed to create account. Check inputs.' 
      });
    }
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <UserPlus color="var(--primary-color)" />
        <h2 style={{ margin: 0 }}>Open New Account</h2>
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
          <label>Full Name</label>
          <input 
            type="text" 
            className="form-control" 
            value={formData.holderName}
            onChange={(e) => setFormData({...formData, holderName: e.target.value})}
            required
            placeholder="e.g. Alice Johnson"
          />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            className="form-control" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            placeholder="alice@example.com"
          />
        </div>
        <div className="form-group">
          <label>Initial Deposit ($)</label>
          <input 
            type="number" 
            step="0.01"
            min="0"
            className="form-control" 
            value={formData.initialBalance}
            onChange={(e) => setFormData({...formData, initialBalance: e.target.value})}
            required
            placeholder="0.00"
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Create Account
        </button>
      </form>
    </div>
  );
};

export default AccountForm;
