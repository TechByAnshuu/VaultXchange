import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAccount } from '../services/accountService';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');

  .vx-page {
    min-height: 100vh;
    background-color: #F5F0EB;
    color: #1A1A2E;
    font-family: 'DM Sans', sans-serif;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    position: relative; overflow: hidden;
    padding: 20px;
  }
  .vx-blob {
    position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.6; z-index: 0; pointer-events: none;
  }
  .vx-blob-1 { width: 400px; height: 400px; background: #E8580C; top: -100px; right: -100px; animation: vxSpin 20s linear infinite; }
  .vx-blob-2 { width: 350px; height: 350px; background: #F9C74F; bottom: -50px; left: -100px; animation: vxSpin 25s linear infinite reverse; }
  .vx-blob-3 { width: 300px; height: 300px; background: #3D3535; top: 40%; left: 30%; opacity: 0.2; }

  @keyframes vxSpin { to { transform: rotate(360deg); } }

  .vx-logo {
    display: flex; align-items: center; gap: 10px; margin-bottom: 28px;
    z-index: 10; cursor: pointer; transition: opacity 0.2s;
  }
  .vx-logo:hover { opacity: 0.8; }
  .vx-logo-icon {
    width: 32px; height: 32px; border-radius: 10px; background: #3D3535;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .vx-logo-texts { display: flex; flex-direction: column; line-height: 1; }
  .vx-logo-wordmark { display: flex; align-items: baseline; }
  .vx-logo-vault { font-size: 20px; font-weight: 900; font-style: italic; color: #1A1A2E; }
  .vx-logo-x { font-size: 20px; font-weight: 900; font-style: italic; color: #3D3535; }
  .vx-logo-sub { font-size: 7px; font-weight: 900; letter-spacing: 0.3em; color: #6C6C80; margin-top: 2px; text-transform: uppercase; }

  .vx-card {
    background: #FFFFFF; border-radius: 24px; box-shadow: 0 24px 80px rgba(0,0,0,0.06);
    width: 100%; max-width: 440px; z-index: 10; position: relative; overflow: hidden;
    animation: vxFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
    border: 1px solid #EDE8E1;
  }

  @keyframes vxFadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .vx-card-bar { height: 6px; width: 100%; background: #E8580C; }
  .vx-card-body { padding: 40px 32px; }

  .vx-heading { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: #1A1A2E; margin-bottom: 8px; line-height: 1.2; }
  .vx-subtext { font-size: 14px; color: #6C6C80; margin-bottom: 32px; line-height: 1.5; }

  .vx-field { margin-bottom: 20px; }
  .vx-label { display: block; font-size: 12px; font-weight: 700; color: #3D3535; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; }
  .vx-input {
    width: 100%; padding: 14px 16px; border-radius: 12px; border: 1.5px solid #EDE8E1;
    background: #FAF7F4; font-size: 15px; font-family: inherit; font-weight: 500;
    color: #1A1A2E; outline: none; transition: all 0.2s;
  }
  .vx-input:focus { border-color: #3D3535; background: #FFFFFF; box-shadow: 0 4px 12px rgba(61,53,53,0.06); }

  .vx-btn {
    width: 100%; padding: 16px; border-radius: 14px; border: none;
    font-size: 15px; font-weight: 700; font-family: inherit; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all 0.2s; margin-top: 10px; background: #3D3535; color: #FFFFFF;
  }
  .vx-btn:hover { background: #2A2A2A; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(61,53,53,0.15); }
  .vx-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: none; }

  .vx-below { margin-top: 24px; font-size: 14px; color: #1A1A2E; z-index: 10; animation: vxFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both; }
  .vx-below-link { background: none; border: none; font-size: 14px; font-weight: 700; color: #E8580C; cursor: pointer; padding: 0; font-family: inherit; transition: opacity 0.2s; }
  .vx-below-link:hover { opacity: 0.75; }

  .vx-error { background: #FFF0F0; border: 1px solid #FFD6D6; color: #C9460A; padding: 14px 16px; border-radius: 12px; font-size: 13px; font-weight: 600; display: flex; align-items: flex-start; gap: 10px; margin-bottom: 24px; line-height: 1.4; }
  .vx-success { background: #F0FDF4; border: 1px solid #BBF7D0; color: #15803D; padding: 16px; border-radius: 12px; font-size: 14px; font-weight: 600; text-align: center; margin-bottom: 24px; line-height: 1.5; }
`;

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ holderName: '', email: '', initialBalance: '' });
  const [error, setError] = useState('');
  const [successAcc, setSuccessAcc] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.holderName || !formData.email || formData.initialBalance === '') {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const resp = await createAccount({
        holderName: formData.holderName,
        email: formData.email,
        initialBalance: parseFloat(formData.initialBalance)
      });
      setSuccessAcc(resp.accountNumber);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    if (successAcc) {
      // simulate auto-login setup or pass the account over
      localStorage.setItem('vx_role', 'customer');
      localStorage.setItem('vx_user', JSON.stringify({ name: formData.holderName, account: successAcc }));
      navigate('/customer/home');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="vx-page">
        <div className="vx-blob vx-blob-1" />
        <div className="vx-blob vx-blob-2" />
        <div className="vx-blob vx-blob-3" />

        <div className="vx-logo" onClick={() => navigate('/')}>
          <div className="vx-logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 12L11 14L15 10M12 2L3 7V13C3 17.97 7.02 22.63 12 24C16.98 22.63 21 17.97 21 13V7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div className="vx-logo-texts">
            <div className="vx-logo-wordmark">
              <span className="vx-logo-vault">Vault</span><span className="vx-logo-x">X</span>
            </div>
            <span className="vx-logo-sub">Exchange</span>
          </div>
        </div>

        <div className="vx-card">
          <div className="vx-card-bar" />
          <div className="vx-card-body">
            
            {successAcc ? (
              <>
                <div className="vx-success">
                  <div style={{ marginBottom: 12 }}>🎉 Your account is ready!</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#166534', fontFamily: 'monospace', letterSpacing: 2 }}>
                    {successAcc}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500, marginTop: 8 }}>This is your new Account Number. Use it to log in.</div>
                </div>
                <button type="button" onClick={handleLoginRedirect} className="vx-btn">
                  Continue to Dashboard →
                </button>
              </>
            ) : (
              <>
                <h1 className="vx-heading">Open an Account</h1>
                <p className="vx-subtext">Join VaultX Exchange and experience banking without boundaries.</p>

                {error && <div className="vx-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="vx-field">
                    <label className="vx-label">Full Name</label>
                    <input className="vx-input" type="text" placeholder="e.g. Alice Johnson"
                      value={formData.holderName} onChange={e => setFormData({ ...formData, holderName: e.target.value })}
                    />
                  </div>
                  <div className="vx-field">
                    <label className="vx-label">Email Address</label>
                    <input className="vx-input" type="email" placeholder="alice@example.com"
                      value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="vx-field">
                    <label className="vx-label">Initial Deposit (₹)</label>
                    <input className="vx-input" type="number" min="0" step="0.01" placeholder="0.00"
                      value={formData.initialBalance} onChange={e => setFormData({ ...formData, initialBalance: e.target.value })}
                    />
                  </div>

                  <button type="submit" disabled={loading} className="vx-btn">
                    {loading ? 'Opening Account...' : 'Open Account'}
                  </button>
                </form>
              </>
            )}

          </div>
        </div>

        <div className="vx-below">
          Already a customer?{' '}
          <button type="button" onClick={() => navigate('/login')} className="vx-below-link">Log in here →</button>
        </div>
      </div>
    </>
  );
}
