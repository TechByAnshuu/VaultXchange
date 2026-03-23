import { useState } from 'react';
import { createAccount } from '../services/accountService';
import { useAccounts } from '../store/AccountContext';
import Alert from './Alert';
import { UserPlus, User, Mail, DollarSign } from 'lucide-react';

const AccountForm = () => {
  const { refreshAccounts } = useAccounts();
  const [formData, setFormData] = useState({ holderName: '', email: '', initialBalance: '' });
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createAccount({
        holderName: formData.holderName,
        email: formData.email,
        initialBalance: parseFloat(formData.initialBalance)
      });
      setNotification({ type: 'success', message: 'Account successfully created!' });
      setFormData({ holderName: '', email: '', initialBalance: '' });
      refreshAccounts();
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.response?.data?.error || 'Failed to create account. Check inputs.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(192,57,43,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <UserPlus size={20} color="var(--primary)" />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-navy)' }}>Open New Account</h2>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Fill in the details below</p>
        </div>
      </div>

      {/* Alert */}
      {notification && (
        <Alert
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* Full Name */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            <User size={13} /> Full Name
          </label>
          <input
            type="text"
            className="form-control"
            value={formData.holderName}
            onChange={(e) => setFormData({ ...formData, holderName: e.target.value })}
            required
            placeholder="e.g. Alice Johnson"
          />
        </div>

        {/* Email */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            <Mail size={13} /> Email Address
          </label>
          <input
            type="email"
            className="form-control"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            placeholder="alice@example.com"
          />
        </div>

        {/* Initial Deposit */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            <DollarSign size={13} /> Initial Deposit ($)
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9375rem' }}>$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              className="form-control"
              style={{ paddingLeft: '1.75rem' }}
              value={formData.initialBalance}
              onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value })}
              required
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary btn-full"
          style={{ marginTop: '0.5rem', padding: '0.875rem', fontSize: '0.9375rem' }}
          disabled={loading}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                <path d="M21 12a9 9 0 11-6.219-8.56" />
              </svg>
              Creating...
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
              <UserPlus size={16} /> Create Account
            </span>
          )}
        </button>

      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AccountForm;