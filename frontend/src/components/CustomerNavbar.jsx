// src/components/CustomerNavbar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const navStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,700&display=swap');
  .vx-navbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 900;
    height: 64px;
    background: #FFFFFF;
    border-bottom: 1px solid #EDE8E1;
    display: flex; align-items: center;
    padding: 0 32px;
    gap: 32px;
    font-family: 'Inter', sans-serif;
    transition: box-shadow 0.25s ease;
  }
  .vx-navbar.scrolled {
    box-shadow: 0 4px 24px rgba(0,0,0,0.07);
  }

  /* Logo */
  .vx-nav-logo {
    display: flex; align-items: center; gap: 10px;
    text-decoration: none; flex-shrink: 0; cursor: pointer;
  }
  .vx-nav-logo-icon {
    width: 38px; height: 38px; border-radius: 11px;
    background: #3D3535; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 14px rgba(61,53,53,0.22); flex-shrink: 0;
  }
  .vx-nav-logo-texts { display: flex; flex-direction: column; line-height: 1; }
  .vx-nav-logo-word {
    display: flex; align-items: baseline;
    font-family: 'Playfair Display', serif; font-style: italic; font-weight: 700;
  }
  .vx-nav-vault { color: #1A1A2E; font-size: 18px; }
  .vx-nav-x     { color: #3D3535; font-size: 22px; }
  .vx-nav-sub   {
    font-size: 6.5px; font-weight: 800; letter-spacing: 0.38em;
    color: #6C6C80; text-transform: uppercase; margin-top: 2px;
    font-family: 'Inter', sans-serif;
  }

  /* Center tabs */
  .vx-nav-tabs {
    display: flex; align-items: center; gap: 4px; flex: 1; justify-content: center;
  }
  .vx-nav-tab {
    padding: 8px 16px;
    background: none; border: none; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
    color: #6C6C80; border-radius: 10px;
    transition: all 0.18s ease; position: relative;
    white-space: nowrap;
  }
  .vx-nav-tab::after {
    content: ''; position: absolute; bottom: -1px; left: 16px; right: 16px;
    height: 2px; background: #3D3535; border-radius: 2px;
    transform: scaleX(0); transition: transform 0.2s ease;
  }
  .vx-nav-tab:hover { color: #1A1A2E; }
  .vx-nav-tab.active { color: #3D3535; }
  .vx-nav-tab.active::after { transform: scaleX(1); }

  /* Right cluster */
  .vx-nav-right {
    display: flex; align-items: center; gap: 12px; flex-shrink: 0;
  }
  .vx-nav-bell {
    position: relative; width: 40px; height: 40px;
    border: 1px solid #EDE8E1; border-radius: 11px;
    background: #FAF7F4; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.18s ease; color: #6C6C80;
  }
  .vx-nav-bell:hover { background: #EDE8E1; color: #1A1A2E; }
  .vx-nav-bell-badge {
    position: absolute; top: 8px; right: 8px;
    width: 8px; height: 8px; border-radius: 50%;
    background: #E8580C; border: 2px solid #FFFFFF;
  }
  .vx-nav-user {
    display: flex; align-items: center; gap: 10px; cursor: default;
  }
  .vx-nav-avatar {
    width: 38px; height: 38px; border-radius: 50%;
    background: #3D3535; color: #FFFFFF;
    font-size: 14px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .vx-nav-user-name {
    font-size: 14px; font-weight: 600; color: #1A1A2E; display: block;
  }
  .vx-nav-user-sub {
    font-size: 11px; color: #6C6C80;
  }
  .vx-nav-logout {
    padding: 8px 14px;
    border: 1px solid #EDE8E1; border-radius: 10px;
    background: #FAF7F4; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
    color: #6C6C80; transition: all 0.18s ease;
    display: flex; align-items: center; gap: 6px;
    white-space: nowrap;
  }
  .vx-nav-logout:hover { background: #EDE8E1; color: #1A1A2E; border-color: #D0CCC6; }

  /* Mobile hamburger */
  .vx-nav-hamburger {
    display: none; width: 40px; height: 40px;
    border: 1px solid #EDE8E1; border-radius: 11px;
    background: #FAF7F4; cursor: pointer;
    align-items: center; justify-content: center; color: #3D3535;
    margin-left: auto;
  }

  /* Mobile drawer */
  .vx-nav-drawer-overlay {
    position: fixed; inset: 0; z-index: 950;
    background: rgba(26,26,46,0.35);
    animation: vxFadeIn 0.2s ease both;
  }
  @keyframes vxFadeIn { from { opacity: 0; } to { opacity: 1; } }
  .vx-nav-drawer {
    position: fixed; top: 0; right: 0; bottom: 0;
    width: 280px; background: #FFFFFF; z-index: 960;
    padding: 24px 20px;
    box-shadow: -8px 0 40px rgba(0,0,0,0.12);
    animation: vxDrawerIn 0.25s cubic-bezier(0.34,1.2,0.64,1) both;
    display: flex; flex-direction: column; gap: 8px;
    font-family: 'Inter', sans-serif;
  }
  @keyframes vxDrawerIn {
    from { transform: translateX(100%); } to { transform: translateX(0); }
  }
  .vx-drawer-tab {
    padding: 12px 16px; border-radius: 12px;
    background: none; border: none; cursor: pointer;
    font-size: 15px; font-weight: 600; color: #6C6C80;
    text-align: left; transition: all 0.18s ease;
  }
  .vx-drawer-tab.active, .vx-drawer-tab:hover { background: #FAF7F4; color: #3D3535; }

  @media (max-width: 768px) {
    .vx-nav-tabs, .vx-nav-user, .vx-nav-bell, .vx-nav-logout { display: none; }
    .vx-nav-hamburger { display: flex; }
    .vx-navbar { padding: 0 20px; }
  }
`;

const TABS = ['Home', 'Accounts', 'Payments', 'Activity'];

export default function CustomerNavbar({ activeTab = 'Home', userName = 'Alice Johnson', unreadCount = 2, onTabChange }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('vx_role');
    localStorage.removeItem('vx_user');
    navigate('/login');
  };

  const handleTab = (tab) => {
    onTabChange?.(tab);
    setDrawerOpen(false);
  };

  return (
    <>
      <style>{navStyles}</style>
      <nav className={`vx-navbar${scrolled ? ' scrolled' : ''}`}>
        {/* Logo */}
        <div className="vx-nav-logo" onClick={() => navigate('/customer/home')}>
          <div className="vx-nav-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12L11 14L15 10M12 2L3 7V13C3 17.97 7.02 22.63 12 24C16.98 22.63 21 17.97 21 13V7L12 2Z" />
            </svg>
          </div>
          <div className="vx-nav-logo-texts">
            <div className="vx-nav-logo-word">
              <span className="vx-nav-vault">Vault</span>
              <span className="vx-nav-x">X</span>
            </div>
            <span className="vx-nav-sub">Exchange</span>
          </div>
        </div>

        {/* Center tabs */}
        <div className="vx-nav-tabs">
          {TABS.map(tab => (
            <button key={tab} className={`vx-nav-tab${activeTab === tab ? ' active' : ''}`} onClick={() => handleTab(tab)}>
              {tab}
            </button>
          ))}
        </div>

        {/* Right */}
        <div className="vx-nav-right">
          <button className="vx-nav-bell" aria-label="Notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && <span className="vx-nav-bell-badge" />}
          </button>
          <div className="vx-nav-user">
            <div className="vx-nav-avatar">{initials}</div>
            <div>
              <span className="vx-nav-user-name">{userName}</span>
              <span className="vx-nav-user-sub">Personal Account</span>
            </div>
          </div>
          <button className="vx-nav-logout" onClick={handleLogout}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <button className="vx-nav-hamburger" onClick={() => setDrawerOpen(true)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </nav>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <>
          <div className="vx-nav-drawer-overlay" onClick={() => setDrawerOpen(false)} />
          <div className="vx-nav-drawer">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontWeight: 700, color: '#1A1A2E', fontSize: 16 }}>Menu</span>
              <button onClick={() => setDrawerOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6C6C80' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            {TABS.map(tab => (
              <button key={tab} className={`vx-drawer-tab${activeTab === tab ? ' active' : ''}`} onClick={() => handleTab(tab)}>
                {tab}
              </button>
            ))}
            <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #EDE8E1' }}>
              <button className="vx-drawer-tab" style={{ width: '100%', color: '#E8580C' }} onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
