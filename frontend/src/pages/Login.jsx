import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────────────────
   VaultX Exchange — LoginPage.jsx
   Single card · role toggle at top · dynamic form below
───────────────────────────────────────────────────────────────────── */

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #F5F0EB;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  /* ── page shell ── */
  .vx-page {
    min-height: 100vh;
    background: #F5F0EB;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px 16px;
    position: relative;
    overflow: hidden;
  }

  /* ── background blobs ── */
  .vx-blob {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }
  .vx-blob-1 {
    width: 480px; height: 480px;
    background: radial-gradient(circle, rgba(232,88,12,0.07) 0%, transparent 68%);
    top: -140px; right: -90px;
  }
  .vx-blob-2 {
    width: 380px; height: 380px;
    background: radial-gradient(circle, rgba(61,53,53,0.06) 0%, transparent 68%);
    bottom: -90px; left: -70px;
  }
  .vx-blob-3 {
    width: 200px; height: 200px;
    background: radial-gradient(circle, rgba(249,199,79,0.09) 0%, transparent 68%);
    bottom: 20%; right: 10%;
  }

  /* ── logo ── */
  .vx-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 28px;
    position: relative; z-index: 1;
    animation: vxFadeDown 0.45s ease both;
  }
  .vx-logo-icon {
    width: 42px; height: 42px;
    border-radius: 12px;
    background: #3D3535;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 20px rgba(61,53,53,0.26);
    flex-shrink: 0;
  }
  .vx-logo-texts { display: flex; flex-direction: column; line-height: 1; }
  .vx-logo-wordmark {
    display: flex; align-items: baseline;
    font-family: 'Playfair Display', serif;
    font-style: italic; font-weight: 700;
  }
  .vx-logo-vault { color: #1A1A2E; font-size: 21px; }
  .vx-logo-x     { color: #3D3535; font-size: 26px; }
  .vx-logo-sub   {
    font-size: 7px; font-weight: 800;
    letter-spacing: 0.38em; color: #6C6C80;
    text-transform: uppercase; margin-top: 3px;
  }

  /* ── card ── */
  .vx-card {
    position: relative; z-index: 1;
    width: 100%; max-width: 440px;
    background: #FFFFFF;
    border-radius: 26px;
    border: 1px solid #EDE8E1;
    box-shadow: 0 16px 56px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.04);
    overflow: hidden;
    animation: vxFadeUp 0.42s ease both;
    animation-delay: 0.08s;
  }

  /* top accent bar — transitions color on role change */
  .vx-card-bar {
    height: 4px;
    width: 100%;
    transition: background 0.3s ease;
  }
  .vx-card-bar-customer  { background: #3D3535; }
  .vx-card-bar-employee  { background: #E8580C; }

  .vx-card-body { padding: 36px 36px 32px; }

  /* ── role toggle ── */
  .vx-toggle-wrap {
    display: flex;
    background: #FAF7F4;
    border: 1px solid #EDE8E1;
    border-radius: 12px;
    padding: 4px;
    gap: 4px;
    margin-bottom: 32px;
  }

  .vx-toggle-btn {
    flex: 1;
    padding: 10px 0;
    border: none;
    border-radius: 9px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.22s ease, color 0.22s ease, box-shadow 0.22s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    white-space: nowrap;
  }

  .vx-toggle-btn-inactive {
    background: transparent;
    color: #6C6C80;
  }
  .vx-toggle-btn-inactive:hover { color: #1A1A2E; }

  .vx-toggle-btn-customer {
    background: #3D3535;
    color: #FFFFFF;
    box-shadow: 0 2px 8px rgba(61,53,53,0.2);
  }
  .vx-toggle-btn-employee {
    background: #E8580C;
    color: #FFFFFF;
    box-shadow: 0 2px 8px rgba(232,88,12,0.22);
  }

  /* ── staff chip ── */
  .vx-staff-chip {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 10px; font-weight: 800; letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #92670A;
    background: rgba(249,199,79,0.15);
    border: 1px solid rgba(249,199,79,0.32);
    padding: 4px 11px; border-radius: 99px;
    margin-bottom: 14px;
  }

  /* ── headings ── */
  .vx-heading {
    font-family: 'Playfair Display', serif;
    font-size: 27px; font-weight: 700;
    color: #1A1A2E; margin-bottom: 5px;
    line-height: 1.2;
  }
  .vx-subtext {
    font-size: 14px; color: #6C6C80;
    margin-bottom: 28px; line-height: 1.5;
  }

  /* ── form fields ── */
  .vx-field { margin-bottom: 16px; }

  .vx-label {
    display: block;
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.07em; text-transform: uppercase;
    color: #6C6C80; margin-bottom: 7px;
  }

  .vx-input {
    width: 100%;
    padding: 12px 15px;
    background: #FAF7F4;
    border: 1.5px solid #EDE8E1;
    border-radius: 11px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px; color: #0F0F1A;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }
  .vx-input::placeholder { color: #9CA3AF; }

  .vx-input:focus {
    background: #FFFFFF;
    border-color: #3D3535;
    box-shadow: 0 0 0 3px rgba(61,53,53,0.08);
  }
  .vx-input-emp:focus {
    border-color: #E8580C;
    box-shadow: 0 0 0 3px rgba(232,88,12,0.09);
  }

  /* ── forgot row ── */
  .vx-forgot-row {
    display: flex;
    justify-content: flex-end;
    margin-top: -6px;
    margin-bottom: 22px;
  }
  .vx-forgot {
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 600;
    color: #E8580C;
    padding: 0;
    transition: opacity 0.18s;
  }
  .vx-forgot:hover { opacity: 0.7; }

  /* ── error ── */
  .vx-error {
    display: flex; align-items: center; gap: 8px;
    background: rgba(232,88,12,0.07);
    border: 1px solid rgba(232,88,12,0.22);
    border-radius: 10px;
    padding: 11px 14px;
    font-size: 13px; font-weight: 600; color: #C9460A;
    margin-bottom: 16px;
    animation: vxShake 0.35s ease both;
  }

  /* ── submit button ── */
  .vx-btn {
    width: 100%;
    padding: 14px;
    border: none; border-radius: 13px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px; font-weight: 700;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.18s ease;
  }
  .vx-btn:active  { transform: translateY(0) !important; }
  .vx-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none !important; }

  .vx-btn-charcoal {
    background: #3D3535; color: #FFFFFF;
    box-shadow: 0 5px 18px rgba(61,53,53,0.22);
  }
  .vx-btn-charcoal:hover:not(:disabled) {
    background: #2A2A2A;
    box-shadow: 0 8px 26px rgba(61,53,53,0.28);
    transform: translateY(-1px);
  }

  .vx-btn-orange {
    background: #E8580C; color: #FFFFFF;
    box-shadow: 0 5px 18px rgba(232,88,12,0.24);
  }
  .vx-btn-orange:hover:not(:disabled) {
    background: #C9460A;
    box-shadow: 0 8px 26px rgba(232,88,12,0.3);
    transform: translateY(-1px);
  }

  /* ── spinner ── */
  .vx-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #FFFFFF;
    border-radius: 50%;
    animation: vxSpin 0.65s linear infinite;
    flex-shrink: 0;
  }

  /* ── below card link ── */
  .vx-below {
    position: relative; z-index: 1;
    margin-top: 20px;
    font-size: 14px; color: #6C6C80;
    text-align: center;
    animation: vxFadeUp 0.42s ease both;
    animation-delay: 0.18s;
    min-height: 22px;
  }
  .vx-below-link {
    color: #E8580C; font-weight: 700;
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    padding: 0; transition: opacity 0.18s;
  }
  .vx-below-link:hover { opacity: 0.75; }

  /* ── animations ── */
  @keyframes vxFadeDown {
    from { opacity: 0; transform: translateY(-14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes vxFadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes vxSpin {
    to { transform: rotate(360deg); }
  }
  @keyframes vxShake {
    0%,100% { transform: translateX(0); }
    25%      { transform: translateX(-5px); }
    75%      { transform: translateX(5px); }
  }

  /* ── mobile ── */
  @media (max-width: 500px) {
    .vx-card-body { padding: 28px 20px 24px; }
    .vx-heading    { font-size: 23px; }
    .vx-toggle-btn { font-size: 12px; padding: 9px 0; }
  }
`;

/* ── Icons ─────────────────────────────────────────────────────────── */
const ShieldSvg = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12L11 14L15 10M12 2L3 7V13C3 17.97 7.02 22.63 12 24C16.98 22.63 21 17.97 21 13V7L12 2Z" />
  </svg>
);

const UserSvg = ({ color = 'white', size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const BuildingSvg = ({ color = 'white', size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ArrowSvg = ({ size = 15, color = 'white' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const AlertSvg = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="#C9460A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const StarSvg = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="#F9C74F" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

/* ─── LoginPage ─────────────────────────────────────────────────────── */
export default function LoginPage() {
  const navigate = useNavigate();

  /* role: 'customer' | 'employee' */
  const [role, setRole]       = useState('customer');
  const [account, setAccount] = useState('');
  const [empId, setEmpId]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  /* reset form state whenever role switches */
  const switchRole = (r) => {
    setRole(r);
    setError('');
    setAccount('');
    setEmpId('');
    setPassword('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (role === 'customer') {
      if (!account.trim() || !password.trim()) return;
      setLoading(true);
      setTimeout(() => {
        localStorage.setItem('vx_role', 'customer');
        localStorage.setItem('vx_user', JSON.stringify({ name: 'Alice Johnson', account }));
        navigate('/customer/home');
      }, 850);
    } else {
      if (!empId.trim() || !password.trim()) return;
      if (empId === 'admin' && password === 'admin123') {
        setLoading(true);
        setTimeout(() => {
          localStorage.setItem('vx_role', 'employee');
          localStorage.setItem('vx_user', JSON.stringify({ name: 'Admin', role: 'Executive Staff' }));
          navigate('/bank/dashboard');
        }, 850);
      } else {
        setError('Invalid Employee ID or Password. Use admin / admin123');
      }
    }
  };

  const isCustomer = role === 'customer';
  const canSubmit  = isCustomer
    ? account.trim() && password.trim()
    : empId.trim() && password.trim();

  return (
    <>
      <style>{STYLES}</style>

      <div className="vx-page">
        {/* blobs */}
        <div className="vx-blob vx-blob-1" />
        <div className="vx-blob vx-blob-2" />
        <div className="vx-blob vx-blob-3" />

        {/* logo */}
        <div className="vx-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer', transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.8'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          <div className="vx-logo-icon"><ShieldSvg /></div>
          <div className="vx-logo-texts">
            <div className="vx-logo-wordmark">
              <span className="vx-logo-vault">Vault</span>
              <span className="vx-logo-x">X</span>
            </div>
            <span className="vx-logo-sub">Exchange</span>
          </div>
        </div>

        {/* card */}
        <div className="vx-card">
          {/* top accent bar */}
          <div className={`vx-card-bar ${isCustomer ? 'vx-card-bar-customer' : 'vx-card-bar-employee'}`} />

          <div className="vx-card-body">

            {/* ── role toggle ── */}
            <div className="vx-toggle-wrap">
              <button
                type="button"
                className={`vx-toggle-btn ${isCustomer ? 'vx-toggle-btn-customer' : 'vx-toggle-btn-inactive'}`}
                onClick={() => switchRole('customer')}
              >
                <UserSvg color={isCustomer ? 'white' : '#6C6C80'} />
                Customer
              </button>
              <button
                type="button"
                className={`vx-toggle-btn ${!isCustomer ? 'vx-toggle-btn-employee' : 'vx-toggle-btn-inactive'}`}
                onClick={() => switchRole('employee')}
              >
                <BuildingSvg color={!isCustomer ? 'white' : '#6C6C80'} />
                Bank Employee
              </button>
            </div>

            {/* ── dynamic heading ── */}
            {!isCustomer && (
              <div className="vx-staff-chip">
                <StarSvg /> Staff Portal
              </div>
            )}

            <h1 className="vx-heading">
              {isCustomer ? 'Welcome Back' : 'Executive Access'}
            </h1>
            <p className="vx-subtext">
              {isCustomer
                ? 'Access your personal account and manage your finances'
                : 'Sign in with your employee credentials to continue'}
            </p>

            {/* ── error ── */}
            {error && (
              <div className="vx-error">
                <AlertSvg /> {error}
              </div>
            )}

            {/* ── form ── */}
            <form onSubmit={handleSubmit}>

              {/* customer: account number | employee: employee ID */}
              <div className="vx-field">
                <label className="vx-label">
                  {isCustomer ? 'Account Number' : 'Employee ID'}
                </label>
                <input
                  className={`vx-input${!isCustomer ? ' vx-input-emp' : ''}`}
                  type="text"
                  placeholder={isCustomer ? 'e.g. 4397185195' : 'Enter employee ID'}
                  value={isCustomer ? account : empId}
                  onChange={e => isCustomer ? setAccount(e.target.value) : setEmpId(e.target.value)}
                  autoComplete="username"
                />
              </div>

              {/* password */}
              <div className="vx-field">
                <label className="vx-label">Password</label>
                <input
                  className={`vx-input${!isCustomer ? ' vx-input-emp' : ''}`}
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              {/* forgot — only for customer */}
              {isCustomer && (
                <div className="vx-forgot-row">
                  <button type="button" className="vx-forgot">Forgot PIN?</button>
                </div>
              )}

              {/* submit */}
              <button
                type="submit"
                disabled={loading || !canSubmit}
                className={`vx-btn ${isCustomer ? 'vx-btn-charcoal' : 'vx-btn-orange'}`}
                style={{ marginTop: isCustomer ? 0 : 20 }}
              >
                {loading
                  ? <><div className="vx-spinner" /> {isCustomer ? 'Signing in…' : 'Verifying…'}</>
                  : <>{isCustomer ? 'Access My Account' : 'Access Portal'} <ArrowSvg /></>
                }
              </button>

            </form>
          </div>
        </div>

        {/* below-card text */}
        <div className="vx-below">
          {isCustomer ? (
            <>New customer?{' '}
              <button type="button" className="vx-below-link" onClick={() => navigate('/register')}>Open an account →</button>
            </>
          ) : (
            <span style={{ color: '#6C6C80', fontSize: 13 }}>
              Forgot credentials? Contact your IT administrator
            </span>
          )}
        </div>

      </div>
    </>
  );
}
