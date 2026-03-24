// src/components/CustomerFooter.jsx
import React from 'react';

const footerStyles = `
  .vx-footer {
    background: #EDE8E1;
    font-family: 'Inter', sans-serif;
    margin-top: 60px;
  }
  .vx-footer-top {
    padding: 48px 80px;
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1fr;
    gap: 40px;
  }
  .vx-footer-brand-tagline {
    font-size: 13px; color: #6C6C80; line-height: 1.6; margin: 12px 0 20px;
  }
  .vx-footer-socials { display: flex; gap: 8px; }
  .vx-footer-social-btn {
    width: 34px; height: 34px; border-radius: 10px;
    background: #FFFFFF; border: 1px solid #D8D3CC;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.18s ease; color: #6C6C80;
  }
  .vx-footer-social-btn:hover { background: #3D3535; color: #FFFFFF; border-color: #3D3535; }
  .vx-footer-col-title {
    font-size: 11px; font-weight: 800; letter-spacing: 0.12em;
    text-transform: uppercase; color: #1A1A2E; margin-bottom: 16px;
  }
  .vx-footer-links { display: flex; flex-direction: column; gap: 10px; }
  .vx-footer-link {
    font-size: 14px; color: #6C6C80; cursor: pointer;
    transition: color 0.18s ease; text-decoration: none; background: none; border: none;
    text-align: left; padding: 0;
  }
  .vx-footer-link:hover { color: #3D3535; }
  .vx-footer-bottom {
    border-top: 1px solid #D8D3CC;
    padding: 20px 80px;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 8px;
  }
  .vx-footer-bottom-text { font-size: 12px; color: #6C6C80; }
  .vx-footer-logo-row {
    display: flex; align-items: center; gap: 10px; margin-bottom: 0;
  }
  .vx-footer-logo-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: #3D3535; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 3px 10px rgba(61,53,53,0.2); flex-shrink: 0;
  }
  .vx-footer-logo-word {
    font-family: 'Playfair Display', serif; font-style: italic; font-weight: 700;
    display: flex; align-items: baseline;
  }
  .vx-footer-vault { color: #1A1A2E; font-size: 17px; }
  .vx-footer-x     { color: #3D3535; font-size: 21px; }
  .vx-footer-sub   {
    font-size: 6px; font-weight: 800; letter-spacing: 0.35em;
    color: #6C6C80; text-transform: uppercase; display: block; margin-top: 2px;
    font-family: 'Inter', sans-serif;
  }

  @media (max-width: 900px) {
    .vx-footer-top { grid-template-columns: 1fr 1fr; padding: 32px 24px; }
    .vx-footer-bottom { padding: 16px 24px; flex-direction: column; text-align: center; }
  }
  @media (max-width: 500px) {
    .vx-footer-top { grid-template-columns: 1fr; padding: 24px 20px; }
  }
`;

const ACCOUNT_LINKS = ['Dashboard', 'Account Statement', 'Cheque Book', 'Passbook', 'Nominee Details'];
const SERVICE_LINKS = ['Bank Transfer', 'UPI Payments', 'Recharge & Bills', 'Cashback & Offers', 'Pay by Mobile'];
const SUPPORT_LINKS = ['Help Center', 'Contact Us', 'Report an Issue', 'Privacy Policy', 'Terms of Service'];

export default function CustomerFooter() {
  return (
    <>
      <style>{footerStyles}</style>
      <footer className="vx-footer">
        <div className="vx-footer-top">
          {/* Brand col */}
          <div>
            <div className="vx-footer-logo-row">
              <div className="vx-footer-logo-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12L11 14L15 10M12 2L3 7V13C3 17.97 7.02 22.63 12 24C16.98 22.63 21 17.97 21 13V7L12 2Z" />
                </svg>
              </div>
              <div>
                <div className="vx-footer-logo-word">
                  <span className="vx-footer-vault">Vault</span>
                  <span className="vx-footer-x">X</span>
                </div>
                <span className="vx-footer-sub">Exchange</span>
              </div>
            </div>
            <p className="vx-footer-brand-tagline">Your trusted banking simulation platform. Built for modern financial experiences.</p>
            <div className="vx-footer-socials">
              {/* Twitter */}
              <button className="vx-footer-social-btn" aria-label="Twitter">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.56.36a9 9 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.11 0a4.54 4.54 0 0 0-4.54 4.54c0 .36.04.71.11 1.04A12.87 12.87 0 0 1 2 1.64a4.54 4.54 0 0 0 1.4 6.06 4.5 4.5 0 0 1-2.05-.57v.06a4.54 4.54 0 0 0 3.64 4.45 4.56 4.56 0 0 1-2.05.08 4.54 4.54 0 0 0 4.24 3.15A9.1 9.1 0 0 1 1 19.54 12.82 12.82 0 0 0 8 21.5c8.34 0 12.9-6.91 12.9-12.9 0-.2 0-.39-.01-.58A9.22 9.22 0 0 0 23 3z"/>
                </svg>
              </button>
              {/* LinkedIn */}
              <button className="vx-footer-social-btn" aria-label="LinkedIn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                </svg>
              </button>
              {/* GitHub */}
              <button className="vx-footer-social-btn" aria-label="GitHub">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Account links */}
          <div>
            <p className="vx-footer-col-title">Account</p>
            <div className="vx-footer-links">
              {ACCOUNT_LINKS.map(l => <button key={l} className="vx-footer-link">{l}</button>)}
            </div>
          </div>

          {/* Services links */}
          <div>
            <p className="vx-footer-col-title">Services</p>
            <div className="vx-footer-links">
              {SERVICE_LINKS.map(l => <button key={l} className="vx-footer-link">{l}</button>)}
            </div>
          </div>

          {/* Support links */}
          <div>
            <p className="vx-footer-col-title">Support</p>
            <div className="vx-footer-links">
              {SUPPORT_LINKS.map(l => <button key={l} className="vx-footer-link">{l}</button>)}
            </div>
          </div>
        </div>

        <div className="vx-footer-bottom">
          <span className="vx-footer-bottom-text">© 2026 VaultX Exchange. All rights reserved.</span>
          <span className="vx-footer-bottom-text">🔒 RBI Compliant Simulation | 256-bit Encrypted</span>
          <span className="vx-footer-bottom-text">Developed with ❤️ during Infosys Springboard Internship</span>
        </div>
      </footer>
    </>
  );
}
