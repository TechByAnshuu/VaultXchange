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
    padding-top: 40px;
    padding-bottom: 40px;
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
    width: 100%; max-width: 500px; z-index: 10; position: relative; overflow: hidden;
    animation: vxFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
    border: 1px solid #EDE8E1;
  }

  @keyframes vxFadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .vx-card-bar { height: 6px; width: 100%; background: #E8580C; }
  .vx-card-body { padding: 40px 36px; }

  .vx-heading { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: #1A1A2E; margin-bottom: 8px; line-height: 1.2; }
  .vx-subtext { font-size: 14px; color: #6C6C80; margin-bottom: 32px; line-height: 1.5; }

  .vx-field { margin-bottom: 18px; }
  .vx-row { display: flex; gap: 16px; margin-bottom: 18px; }
  .vx-row > .vx-field { margin-bottom: 0; flex: 1; }

  .vx-label { display: block; font-size: 11px; font-weight: 800; color: #6C6C80; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.08em; }
  .vx-input {
    width: 100%; padding: 14px 16px; border-radius: 12px; border: 1.5px solid #EDE8E1;
    background: #FAF7F4; font-size: 15px; font-family: inherit; font-weight: 500;
    color: #1A1A2E; outline: none; transition: all 0.2s;
  }
  .vx-input:focus { border-color: #3D3535; background: #FFFFFF; box-shadow: 0 4px 12px rgba(61,53,53,0.06); }
  textarea.vx-input { resize: vertical; min-height: 80px; }
  select.vx-input { appearance: none; cursor: pointer; }

  .vx-btn {
    width: 100%; padding: 16px; border-radius: 14px; border: none;
    font-size: 15px; font-weight: 700; font-family: inherit; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all 0.2s; margin-top: 24px; background: #3D3535; color: #FFFFFF;
  }
  .vx-btn:hover { background: #2A2A2A; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(61,53,53,0.15); }
  .vx-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: none; }

  .vx-btn-outline {
    background: transparent; color: #3D3535; border: 2px solid #3D3535;
  }
  .vx-btn-outline:hover {
    background: #FAF7F4; color: #1A1A2E;
  }

  .vx-below { margin-top: 24px; font-size: 14px; color: #1A1A2E; z-index: 10; animation: vxFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both; }
  .vx-below-link { background: none; border: none; font-size: 14px; font-weight: 700; color: #E8580C; cursor: pointer; padding: 0; font-family: inherit; transition: opacity 0.2s; }
  .vx-below-link:hover { opacity: 0.75; }

  .vx-error { background: #FFF0F0; border: 1px solid #FFD6D6; color: #C9460A; padding: 14px 16px; border-radius: 12px; font-size: 13px; font-weight: 600; display: flex; align-items: flex-start; gap: 10px; margin-bottom: 24px; line-height: 1.4; }
  
  /* Save Credentials Card elements */
  .vx-cred-box { margin-top: 24px; border-radius: 16px; border: 1.5px solid #F9C74F; background: #FFFAF0; padding: 24px; }
  .vx-cred-title { font-size: 14px; font-weight: 800; color: #C9460A; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .vx-cred-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .vx-cred-row:last-child { margin-bottom: 0; }
  .vx-cred-label { font-size: 12px; font-weight: 700; color: #6C6C80; text-transform: uppercase; letter-spacing: 0.05em; }
  .vx-cred-val { font-family: monospace; font-size: 18px; font-weight: 800; color: #1A1A2E; letter-spacing: 2px; background: #FFFFFF; padding: 8px 12px; border-radius: 8px; border: 1px solid #EDE8E1; user-select: text; }
`;

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    holderName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    idType: 'AADHAR',
    idNumber: '',
    password: '',
    initialBalance: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Stores { accountNumber, plainTextPassword } after successful registration
  const [credentials, setCredentials] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.holderName || !formData.email || !formData.phone || formData.initialBalance === '' || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const resp = await createAccount({
        ...formData,
        initialBalance: parseFloat(formData.initialBalance)
      });
      console.log('Account created:', resp);
      // The API should now return accountNumber and plainTextPassword
      setCredentials({
        accountNumber: resp.accountNumber,
        password: resp.plainTextPassword
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create account.');
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    if (credentials) {
      // Pass the credentials to the Login screen via state so it can auto-fill
      navigate('/login', { 
        state: { 
          accountNumber: credentials.accountNumber, 
          password: credentials.password 
        } 
      });
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
            
            {credentials ? (
              // ── SUCCESS / CREDENTIALS STATE ──
              <>
                <h1 className="vx-heading">Account Created! 🎉</h1>
                <p className="vx-subtext">Your simulated bank account is now ready to use.</p>
                
                <div className="vx-cred-box">
                  <div className="vx-cred-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle></svg>
                    Save Your Credentials
                  </div>
                  <p style={{fontSize: 13, color: '#3D3535', marginBottom: 20, lineHeight: 1.5}}>
                    Please capture a screenshot or save these details immediately. VaultX does not store this plain-text password and you will not see it again.
                  </p>
                  
                  <div className="vx-cred-row">
                    <span className="vx-cred-label">Account No</span>
                    <span className="vx-cred-val">{credentials.accountNumber}</span>
                  </div>
                  <div className="vx-cred-row">
                    <span className="vx-cred-label">Password</span>
                    <span className="vx-cred-val" style={{color: '#E8580C'}}>{credentials.password}</span>
                  </div>
                </div>

                <button type="button" onClick={handleLoginRedirect} className="vx-btn" style={{marginTop: 32}}>
                  I've saved it — Go to Login
                </button>
              </>
            ) : (
              // ── REGISTRATION FORM ──
              <>
                <h1 className="vx-heading">Open an Account</h1>
                <p className="vx-subtext">Join VaultX Exchange and experience banking without boundaries.</p>

                {error && <div className="vx-error"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginTop: 2}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> {error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="vx-field">
                    <label className="vx-label">Full Name</label>
                    <input className="vx-input" type="text" placeholder="e.g. Alice Johnson" required
                      value={formData.holderName} onChange={e => setFormData({ ...formData, holderName: e.target.value })}
                    />
                  </div>
                  
                  <div className="vx-row">
                    <div className="vx-field">
                      <label className="vx-label">Email Address</label>
                      <input className="vx-input" type="email" placeholder="alice@example.com" required
                        value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="vx-field" style={{maxWidth: 160}}>
                      <label className="vx-label">Date of Birth</label>
                      <input className="vx-input" type="date" required
                        value={formData.dateOfBirth} onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="vx-field">
                    <label className="vx-label">Mobile Number</label>
                    <input className="vx-input" type="tel" maxLength="10" placeholder="10-digit number" required
                      value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  
                  <div className="vx-field">
                    <label className="vx-label">Residential Address</label>
                    <textarea className="vx-input" placeholder="Full address..." required
                      value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  
                  <div className="vx-row">
                    <div className="vx-field" style={{maxWidth: 120}}>
                      <label className="vx-label">ID Type</label>
                      <select className="vx-input" 
                        value={formData.idType} onChange={e => setFormData({ ...formData, idType: e.target.value })}>
                        <option value="AADHAR">Aadhar</option>
                        <option value="PAN">PAN</option>
                        <option value="PASSPORT">Passport</option>
                      </select>
                    </div>
                    <div className="vx-field">
                      <label className="vx-label">ID Number</label>
                      <input className="vx-input" type="text" placeholder="Enter ID number" required
                        value={formData.idNumber} onChange={e => setFormData({ ...formData, idNumber: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="vx-row">
                    <div className="vx-field">
                      <label className="vx-label">Initial Deposit (₹)</label>
                      <input className="vx-input" type="number" min="0" step="0.01" placeholder="0.00" required
                        value={formData.initialBalance} onChange={e => setFormData({ ...formData, initialBalance: e.target.value })}
                      />
                    </div>
                    <div className="vx-field">
                      <label className="vx-label">Create Password</label>
                      <input className="vx-input" type="password" placeholder="Secure password" required
                        value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="vx-btn">
                    {loading ? (
                      <><div style={{width:16,height:16,border:'2px solid #fff',borderTopColor:'transparent',borderRadius:'50%',animation:'vxSpin 0.6s linear infinite'}} /> Opening...</>
                    ) : 'Open Account'}
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
