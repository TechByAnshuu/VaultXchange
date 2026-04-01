// src/components/VaultXChatbot.jsx
// VaultX Banking Assistant — styled to match App.css cream/charcoal theme
// Mirrors ChatService.java state machine logic exactly

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deposit, withdraw, transfer, getTransactionHistory } from '../services/transactionService';
import { getAccountDetails, getAccounts } from '../services/accountService';

/* ─── CSS scoped to chatbot only (no Tailwind) ─────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.vx-chat-fab {
  position: fixed; bottom: 28px; right: 28px; z-index: 9000;
  width: 56px; height: 56px; border-radius: 50%;
  background: #3D3535; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8px 24px rgba(61,53,53,0.35);
  transition: transform 0.2s, box-shadow 0.2s;
}
.vx-chat-fab:hover { transform: scale(1.08); box-shadow: 0 12px 32px rgba(61,53,53,0.45); }
.vx-chat-fab-badge {
  position: absolute; top: -3px; right: -3px;
  width: 18px; height: 18px; border-radius: 50%;
  background: #E8580C; color: #fff;
  font-size: 10px; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid #F5F0EB;
}

.vx-chat-panel {
  position: fixed; bottom: 96px; right: 28px; z-index: 9000;
  width: 380px; height: 580px;
  background: #FFFFFF; border: 1px solid #EDE8E1;
  border-radius: 20px; display: flex; flex-direction: column;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  font-family: 'Inter', sans-serif;
  animation: vxChatOpen 0.25s cubic-bezier(0.34,1.56,0.64,1);
  overflow: hidden;
}
@keyframes vxChatOpen {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* Header */
.vx-chat-header {
  background: #3D3535; padding: 16px 18px;
  display: flex; align-items: center; gap: 12px;
  border-radius: 20px 20px 0 0; flex-shrink: 0;
}
.vx-chat-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(249,199,79,0.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 800; color: #F9C74F;
  flex-shrink: 0; position: relative;
}
.vx-chat-avatar::after {
  content: ''; position: absolute; bottom: 1px; right: 1px;
  width: 10px; height: 10px; border-radius: 50%;
  background: #10B981; border: 2px solid #3D3535;
}
.vx-chat-header-info { flex: 1; }
.vx-chat-header-name { font-size: 13px; font-weight: 700; color: #FFFFFF; letter-spacing: 0.4px; }
.vx-chat-header-name span { color: #F9C74F; }
.vx-chat-header-status { font-size: 11px; color: rgba(255,255,255,0.55); margin-top: 2px; }
.vx-chat-close {
  background: none; border: none; cursor: pointer;
  color: rgba(255,255,255,0.5); padding: 4px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  transition: color 0.15s;
}
.vx-chat-close:hover { color: #FFFFFF; }

/* Messages area */
.vx-chat-body {
  flex: 1; overflow-y: auto; padding: 16px 14px;
  display: flex; flex-direction: column; gap: 10px;
  background: #FAF7F4; scroll-behavior: smooth;
}
.vx-chat-body::-webkit-scrollbar { width: 3px; }
.vx-chat-body::-webkit-scrollbar-thumb { background: #EDE8E1; border-radius: 4px; }

.vx-chat-msg { display: flex; gap: 8px; animation: vxMsgIn 0.22s ease; }
.vx-chat-msg.bot { flex-direction: row; }
.vx-chat-msg.user { flex-direction: row-reverse; }
@keyframes vxMsgIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.vx-chat-msg-av {
  width: 26px; height: 26px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700; flex-shrink: 0; margin-top: 2px;
}
.vx-chat-msg.bot .vx-chat-msg-av { background: #3D3535; color: #F9C74F; }
.vx-chat-msg.user .vx-chat-msg-av { background: #EDE8E1; color: #6C6C80; }

.vx-chat-bubble {
  max-width: 80%; padding: 10px 14px;
  border-radius: 16px; font-size: 13px; line-height: 1.55;
}
.vx-chat-msg.bot .vx-chat-bubble {
  background: #FFFFFF; border: 1px solid #EDE8E1;
  color: #0F0F1A; border-bottom-left-radius: 4px;
}
.vx-chat-msg.user .vx-chat-bubble {
  background: #3D3535; color: #FFFFFF;
  border-bottom-right-radius: 4px;
}
.vx-chat-bubble b { color: #3D3535; }
.vx-chat-msg.user .vx-chat-bubble b { color: #F9C74F; }
.vx-chat-bubble code {
  background: rgba(61,53,53,0.08); color: #3D3535;
  padding: 1px 5px; border-radius: 4px;
  font-size: 11.5px; font-family: monospace;
}
.vx-chat-bubble.err { border-left: 3px solid #E8580C; }

/* Confirm card */
.vx-chat-card {
  background: #FAF7F4; border: 1px solid #EDE8E1;
  border-radius: 10px; padding: 10px 12px; margin-top: 6px;
  font-size: 12px;
}
.vx-chat-card-row {
  display: flex; justify-content: space-between;
  padding: 3px 0; border-bottom: 1px solid #EDE8E1; gap: 8px;
}
.vx-chat-card-row:last-child { border-bottom: none; }
.vx-chat-card-label { color: #6C6C80; font-size: 11px; }
.vx-chat-card-val { color: #1A1A2E; font-weight: 600; font-size: 11px; text-align: right; font-family: monospace; }

/* Chips */
.vx-chat-chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 4px 0 4px 34px; }
.vx-chat-chip {
  background: rgba(61,53,53,0.07); border: 1px solid rgba(61,53,53,0.18);
  color: #3D3535; padding: 5px 12px; border-radius: 20px;
  font-size: 12px; font-weight: 500; cursor: pointer; border-style: solid;
  transition: all 0.15s; font-family: 'Inter', sans-serif;
}
.vx-chat-chip:hover { background: #3D3535; color: #FFFFFF; border-color: #3D3535; }

/* Typing */
.vx-chat-typing { display: flex; gap: 4px; padding: 12px 14px; }
.vx-chat-typing span {
  width: 7px; height: 7px; background: #6C6C80;
  border-radius: 50%; animation: vxBounce 1.2s infinite;
}
.vx-chat-typing span:nth-child(2) { animation-delay: 0.2s; }
.vx-chat-typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes vxBounce {
  0%,80%,100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
}

/* Timestamp divider */
.vx-chat-ts {
  text-align: center; font-size: 10px; color: #6C6C80;
  display: flex; align-items: center; gap: 8px; padding: 2px 0;
}
.vx-chat-ts::before,.vx-chat-ts::after {
  content:''; flex: 1; height: 1px; background: #EDE8E1;
}

/* Input bar */
.vx-chat-input-bar {
  background: #FFFFFF; border-top: 1px solid #EDE8E1;
  padding: 12px 14px; display: flex; gap: 8px;
  align-items: center; flex-shrink: 0;
  border-radius: 0 0 20px 20px;
}
.vx-chat-input {
  flex: 1; background: #FAF7F4; border: 1.5px solid #EDE8E1;
  border-radius: 20px; padding: 9px 16px;
  color: #0F0F1A; font-family: 'Inter', sans-serif;
  font-size: 13px; outline: none; transition: border-color 0.2s;
}
.vx-chat-input::placeholder { color: #6C6C80; }
.vx-chat-input:focus { border-color: #3D3535; }
.vx-chat-send {
  width: 38px; height: 38px; border-radius: 50%;
  background: #3D3535; border: none; color: #F9C74F;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: transform 0.15s, box-shadow 0.15s;
}
.vx-chat-send:hover { transform: scale(1.08); box-shadow: 0 4px 14px rgba(61,53,53,0.35); }

@media (max-width: 480px) {
  .vx-chat-panel { width: calc(100vw - 24px); right: 12px; bottom: 80px; height: 75vh; }
  .vx-chat-fab { bottom: 16px; right: 16px; }
}
`;

/* ─── State machine (mirrors ChatService.java) ──────────────────── */
function createChatEngine(session, navigate, onTransactionComplete) {
  // session = { accountNumber, name, email, phone, balance, status, joinedDate }
  const s = {
    lastAction: null,
    currentStep: null,
    tempToAcc: null,
    tempReceiverName: null,
    userDetails: {},
    retries: {},
    // in-memory mock DB (for standalone / no-session flows)
    accounts: {},
    transactions: [],
    nextId: 1001,
  };

  const firstName = session?.name?.split(' ')[0] || 'there';
  const isAuthenticated = !!session;

  // ── helpers ──────────────────────────────────────────────────────
  function reset() {
    s.lastAction = null; s.currentStep = null;
    s.tempToAcc = null; s.tempReceiverName = null; s.userDetails = {}; s.retries = {};
  }

  function maskEmail(e) {
    if (!e) return '****';
    return e.replace(/^(.{2})(.*)(@.+)$/, (_, a, b, c) => a + '****' + c);
  }
  function maskPhone(p) {
    if (!p) return '****';
    const clean = p.replace(/\D/g, '');
    return clean.slice(0, -4).replace(/./g, '*') + clean.slice(-4);
  }
  function maskId(v) {
    if (!v) return '****';
    return v.replace(/.(?=.{4})/g, '*');
  }

  const validators = {
    dob: v => {
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(v)) return false;
      const [d, m, y] = v.split('/').map(Number);
      const age = (Date.now() - new Date(y, m - 1, d)) / (1000 * 60 * 60 * 24 * 365.25);
      return age >= 18;
    },
    phone: v => /^[6-9]\d{9}$/.test(v.replace(/\s/g, '')),
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    amount: v => !isNaN(v) && Number(v) > 0,
    aadhar: v => /^\d{12}$/.test(v.replace(/\s/g, '')),
    pan: v => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v.toUpperCase()),
    passport: v => /^[A-Z]\d{7}$/.test(v.toUpperCase()),
  };

  // ── Mock DB (for unauthenticated chatbot only) ───────────────────
  function mockCreateAccount(d) {
    const id = s.nextId++;
    s.accounts[id] = { ...d, id, balance: 0, status: 'ACTIVE' };
    return id;
  }
  function mockGetAcc(raw) {
    const n = Number(String(raw).replace(/acc-/i, '').trim());
    return s.accounts[n] || null;
  }

  // ── Response builders ────────────────────────────────────────────
  function text(html, isErr = false) { return { t: 'text', html, isErr }; }
  function chips(opts) { return { t: 'chips', opts }; }
  function card(details) { return { t: 'card', details }; }
  function menuChips() {
    if (isAuthenticated) {
      return chips(['Deposit', 'Withdraw', 'Transfer', 'Balance', 'Statement', 'Profile', 'Help']);
    }
    return chips(['Create Account', 'Deposit', 'Withdraw', 'Transfer', 'Balance', 'History']);
  }

  function welcomeMsg() {
    if (isAuthenticated) {
      const bal = Number(session.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
      return text(`Hey <b>${firstName}!</b> 👋 Welcome back to <b>VaultX Exchange</b>.<br><br>
        Your balance: <b style="color:#F9C74F">₹${bal}</b><br>
        Account: <code>${session.accountNumber}</code> · 
        <span style="color:#10B981">● ACTIVE</span><br><br>
        What would you like to do today?`);
    }
    return text(`Welcome to <b>VaultX Exchange</b> 💳<br><br>
      I'm your intelligent banking assistant.<br><br>
      <b>1.</b> Create Account &nbsp;<b>2.</b> Deposit<br>
      <b>3.</b> Withdraw &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>4.</b> Transfer<br>
      <b>5.</b> Check Balance &nbsp;<b>6.</b> Transaction History<br><br>
      Type a number or describe what you need.`);
  }

  // ─────────────────────────────────────────────────────────────────
  // MAIN ENGINE: process(msg) → array of response objects
  // ─────────────────────────────────────────────────────────────────
  async function process(raw) {
    const msg = raw.trim();
    const lower = msg.toLowerCase();

    // Global cancel
    if (['cancel', 'stop', 'exit', 'quit', 'back', 'menu'].includes(lower)) {
      reset();
      return [text(`Process cancelled. How else can I help you, <b>${firstName}</b>?`), menuChips()];
    }

    // Idle — detect intent
    if (!s.lastAction) {
      if (/create|open|new.?account|register|^1$/.test(lower)) return startCreate();
      if (/deposit|add money|^2$/.test(lower)) return startDeposit();
      if (/withdraw|take out|^3$/.test(lower)) return startWithdraw();
      if (/transfer|send|^4$/.test(lower)) return startTransfer();
      if (/balance|how much|^5$|what.*balance/.test(lower)) return handleBalance();
      if (/history|statement|transactions|^6$/.test(lower)) return startHistory();
      if (/profile|who am i|account.?detail/.test(lower)) return handleProfile();
      if (/hi|hello|help|hey/.test(lower)) return [welcomeMsg(), menuChips()];
      // Landing-page informational chips
      if (/how does it work|how it works/.test(lower)) return [
        text(`🏦 <b>How VaultX Works</b><br><br>
          <b>1.</b> Create your free account (takes ~60 seconds)<br>
          <b>2.</b> Deposit virtual funds to get started<br>
          <b>3.</b> Transfer, withdraw, track history — all in real time<br><br>
          Everything mirrors a real bank's backend powered by Spring Boot + MySQL.<br><br>
          Want to try it? Type <b>Create Account</b> to begin!`),
        { t: 'chips', opts: ['Create Account', 'Features', 'Help'] }
      ];
      if (/feature|what can|what do/.test(lower)) return [
        text(`✨ <b>VaultX Features</b><br><br>
          💳 <b>Multi-account management</b><br>
          ⚡ <b>Instant fund transfers</b><br>
          📊 <b>Real-time transaction history</b><br>
          🔒 <b>Bank-grade security simulation</b><br>
          📱 <b>Deposit & withdrawals</b><br>
          🤖 <b>AI banking assistant</b> (that's me!)<br><br>
          Ready to open your free account?`),
        { t: 'chips', opts: ['Create Account', 'How does it work?', 'Help'] }
      ];
      return [text("I didn't quite understand that. Please choose an option:"), menuChips()];
    }

    // Route to active handler
    switch (s.lastAction) {
      case 'create': return handleCreate(msg);
      case 'deposit': return handleDeposit(msg);
      case 'withdraw': return handleWithdraw(msg);
      case 'transfer': return handleTransfer(msg);
      case 'history': return handleHistory(msg);
      default: { reset(); return [text('Something went wrong. Let\'s start over.'), menuChips()]; }
    }
  }

  // ══ BALANCE (instant from session or mock) ══
  async function handleBalance() {
    if (isAuthenticated) {
      const bal = Number(session.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
      return [text(`💰 <b>Your Current Balance</b><br><br>
        Account: <code>${session.accountNumber}</code><br>
        Name: <b>${session.name}</b><br>
        Status: <span style="color:#10B981">● ACTIVE</span><br><br>
        Balance: <span style="font-size:20px;color:#F9C74F;font-family:monospace">₹${bal}</span>`)
      , menuChips()];
    }
    // unauthenticated: ask account number
    s.lastAction = 'balance_lookup'; s.currentStep = 'accNo';
    return [text('💹 <b>Check Balance</b><br><br>Enter your <b>account number</b>. Example: <code>ACC-1001</code>')];
  }

  // ══ PROFILE ══
  async function handleProfile() {
    if (!isAuthenticated) return [text('Please log in to view your profile.'), menuChips()];
    return [text(`👤 <b>Your Account Profile</b><br><br>
      <b>Name:</b> ${session.name}<br>
      <b>Account No:</b> <code>${session.accountNumber}</code><br>
      <b>Email:</b> ${maskEmail(session.email)}<br>
      <b>Mobile:</b> ${maskPhone(session.phone)}<br>
      <b>Status:</b> <span style="color:#10B981">● ACTIVE</span><br>
      <b>Member Since:</b> ${session.joinedDate || 'N/A'}`)
    , menuChips()];
  }

  // ══ CREATE ACCOUNT (KYC flow — unauthenticated) ══
  function startCreate() {
    if (isAuthenticated) return [text('You already have a VaultX account 😊 How else can I help?'), menuChips()];
    s.lastAction = 'create'; s.currentStep = 'name'; s.userDetails = {};
    return [text("Let's create your <b>VaultX account</b>! 🎉<br>Type <code>cancel</code> anytime to stop.<br><br>👤 Please enter your <b>full name</b>.")];
  }

  async function handleCreate(msg) {
    const d = s.userDetails;
    const step = s.currentStep;

    if (step === 'name') {
      if (msg.length < 2) return [text('⚠️ Please enter a valid full name. Example: <code>Rahul Sharma</code>', true)];
      d.name = msg; s.currentStep = 'dob';
      return [text(`✅ Thank you, <b>${d.name}</b>!<br><br>📅 Enter your <b>date of birth</b> (DD/MM/YYYY).<br><small style="color:#6C6C80">You must be 18 or older.</small>`)];
    }
    if (step === 'dob') {
      if (!validators.dob(msg)) return [text('⚠️ Invalid date or age below 18. Format: <code>DD/MM/YYYY</code><br>Example: <code>15/08/2000</code>', true)];
      d.dob = msg; s.currentStep = 'phone';
      return [text('✅ DOB recorded.<br><br>📱 Enter your <b>10-digit mobile number</b>.')];
    }
    if (step === 'phone') {
      if (!validators.phone(msg)) return [text('⚠️ Must be 10 digits starting with 6–9. Example: <code>9876543210</code>', true)];
      d.phone = msg; s.currentStep = 'email';
      return [text('✅ Mobile saved.<br><br>📧 Enter your <b>email address</b>.')];
    }
    if (step === 'email') {
      if (!validators.email(msg)) return [text('⚠️ Invalid email. Example: <code>rahul@gmail.com</code>', true)];
      d.email = msg; s.currentStep = 'address';
      return [text('✅ Email saved.<br><br>🏠 Enter your <b>full address</b>.')];
    }
    if (step === 'address') {
      if (msg.length < 5) return [text('⚠️ Please enter a complete address (min 5 characters).', true)];
      d.address = msg; s.currentStep = 'idType';
      return [text('✅ Address saved.<br><br>🪪 Select your <b>ID proof type</b>:'), chips(['Aadhar', 'PAN', 'Passport'])];
    }
    if (step === 'idType') {
      const t = msg.toLowerCase();
      if (!['aadhar', 'pan', 'passport'].includes(t)) {
        return [text('⚠️ Please select a valid ID type:', true), chips(['Aadhar', 'PAN', 'Passport'])];
      }
      d.idType = msg.charAt(0).toUpperCase() + msg.slice(1).toLowerCase();
      s.currentStep = 'idNo';
      const fmts = { aadhar: '12-digit: <code>1234 5678 9012</code>', pan: '<code>ABCDE1234F</code>', passport: '<code>A1234567</code>' };
      return [text(`✅ ID type: <b>${d.idType}</b><br><br>🔢 Enter your <b>${d.idType} number</b>.<br><small style="color:#6C6C80">${fmts[t]}</small>`)];
    }
    if (step === 'idNo') {
      const t = d.idType.toLowerCase();
      const ok = (t === 'aadhar' && validators.aadhar(msg)) || (t === 'pan' && validators.pan(msg)) || (t === 'passport' && validators.passport(msg));
      if (!ok) return [text(`⚠️ Invalid ${d.idType} format. Please check and try again.`, true)];
      d.idNo = msg; s.currentStep = 'password';
      return [text(`✅ ID saved.<br><br>🔒 <b>Create a Password</b> for your account.<br><small style="color:#6C6C80">Must be at least 6 characters.</small>`)];
    }
    if (step === 'password') {
      if (msg.length < 6) return [text('⚠️ Password must be at least 6 characters long.', true)];
      d.password = msg; s.currentStep = 'confirm';
      return [card(d), chips(['Yes, Confirm', 'Cancel'])];
    }
    if (step === 'confirm') {
      if (/yes|confirm/.test(msg.toLowerCase())) {
        try {
          let accNo;
          let password;
          try {
            const apiPayload = {
               holderName: d.name,
               email: d.email,
               phone: d.phone,
               dateOfBirth: d.dob,
               address: d.address,
               idType: d.idType.toUpperCase(),
               idNumber: d.idNo,
               password: d.password,
               initialBalance: 0
            };
            const res = await (await import('../services/accountService')).createAccount(apiPayload);
            accNo = res.accountNumber;
            password = res.plainTextPassword;
          } catch(err) {
            console.error(err);
            reset();
            return [text('⚠️ Account creation failed. Please try again later.', true), menuChips()];
          }
          const name = d.name;
          s.currentStep = 'save_credentials';
          s.tempAccNo = accNo;
          s.tempPassword = password;
          return [text(`🎉 <b>Account Created Successfully!</b><br><br>
            Your account number:<br>
            <span style="font-size:20px;color:#F9C74F;font-family:monospace">${accNo}</span><br><br>
            Your account password:<br>
            <span style="font-size:20px;color:#E8580C;font-family:monospace">${password}</span><br><br>
            <b>Welcome to VaultX Exchange, ${name}!</b><br>
            <small style="color:#C9460A;font-weight:700">Please capture a screenshot or save these details immediately. You will not see this password again.</small>`),
            chips(['✅ Yes, I saved it'])];
        } catch {
          reset();
          return [text('⚠️ Account creation failed. Please try again later.', true), menuChips()];
        }
      }
      reset();
      return [text('Account creation <b>cancelled</b>. Your data has been discarded.'), menuChips()];
    }
    if (step === 'save_credentials') {
      if (msg.toLowerCase().includes('saved') || msg.toLowerCase().includes('yes')) {
        const acc = s.tempAccNo;
        const pass = s.tempPassword;
        reset();
        if (navigate) {
          setTimeout(() => navigate('/login', { state: { accountNumber: acc, password: pass } }), 500);
          return [text('Redirecting you to Login... 🚀')];
        }
        return [text('Awesome! You can now access your account.'), menuChips()];
      }
      return [text('Please confirm you have saved your credentials to continue.'), chips(['✅ Yes, I saved it'])];
    }
  }

  // ══ DEPOSIT ══
  function startDeposit() {
    s.lastAction = 'deposit'; s.currentStep = isAuthenticated ? 'amount' : 'accNo';
    if (isAuthenticated) {
      const bal = Number(session.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
      return [text(`💰 <b>Deposit Funds</b><br><br>How much would you like to deposit into <code>${session.accountNumber}</code>, <b>${firstName}</b>?<br><small style="color:#6C6C80">Current balance: ₹${bal}</small>`)];
    }
    return [text('💰 <b>Deposit Funds</b><br><br>Enter your <b>account number</b>. Example: <code>ACC-1001</code>')];
  }

  async function handleDeposit(msg) {
    if (s.currentStep === 'accNo') {
      const acc = mockGetAcc(msg);
      if (!acc) return [text('⚠️ Account not found. Please check the number. Example: <code>ACC-1001</code>', true)];
      s.tempToAcc = acc.id; s.currentStep = 'amount';
      return [text(`✅ Account found: <b>${acc.name}</b><br>Balance: <code>₹${acc.balance.toLocaleString('en-IN')}</code><br><br>Enter <b>amount to deposit</b> (₹):`)];
    }
    if (s.currentStep === 'amount') {
      const amount = Number(msg.replace(/[₹,\s]/g, ''));
      if (!validators.amount(amount)) return [text('⚠️ Please enter a valid positive amount. Example: <code>5000</code>', true)];
      try {
        const accNo = isAuthenticated ? session.accountNumber : String(s.tempToAcc);
        let newBal;
        if (isAuthenticated) {
          const res = await deposit(accNo, amount);
          newBal = res.balance ?? (Number(session.balance) + amount);
          if (onTransactionComplete) onTransactionComplete();
        } else {
          s.accounts[s.tempToAcc].balance += amount;
          newBal = s.accounts[s.tempToAcc].balance;
        }
        const txnId = `TXN-${Date.now().toString().slice(-6)}`;
        reset();
        return [text(`✅ <b>Deposit Successful!</b><br><br>
          Amount deposited: <b style="color:#10B981">₹${amount.toLocaleString('en-IN')}</b><br>
          Account: <code>${accNo}</code><br>
          New Balance: <b>₹${Number(newBal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</b><br>
          Transaction ID: <code>${txnId}</code><br>
          <small style="color:#6C6C80">${new Date().toLocaleString('en-IN')}</small>
          ${amount > 50000 ? '<br><br>⚠️ Large transaction alert has been recorded for compliance.' : ''}`)
        , menuChips()];
      } catch (e) {
        reset();
        return [text('⚠️ Deposit failed. Please try again. (' + (e?.response?.data?.message || e.message || 'Server error') + ')', true), menuChips()];
      }
    }
  }

  // ══ WITHDRAW ══
  function startWithdraw() {
    s.lastAction = 'withdraw'; s.currentStep = isAuthenticated ? 'amount' : 'accNo';
    if (isAuthenticated) {
      const bal = Number(session.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
      return [text(`🏧 <b>Withdraw Funds</b><br><br>How much would you like to withdraw?<br>Available balance: <b style="color:#F9C74F">₹${bal}</b>`)];
    }
    return [text('🏧 <b>Withdraw Funds</b><br><br>Enter your <b>account number</b>.')];
  }

  async function handleWithdraw(msg) {
    if (s.currentStep === 'accNo') {
      const acc = mockGetAcc(msg);
      if (!acc) return [text('⚠️ Account not found.', true)];
      s.tempToAcc = acc.id; s.currentStep = 'amount';
      return [text(`✅ Account: <b>${acc.name}</b><br>Available: <code>₹${acc.balance.toLocaleString('en-IN')}</code><br><br>Enter <b>amount to withdraw</b> (₹):`)];
    }
    if (s.currentStep === 'amount') {
      const amount = Number(msg.replace(/[₹,\s]/g, ''));
      if (!validators.amount(amount)) return [text('⚠️ Please enter a valid positive amount.', true)];
      const bal = isAuthenticated ? Number(session.balance) : (s.accounts[s.tempToAcc]?.balance || 0);
      if (amount > bal) {
        return [text(`⚠️ <b>Insufficient funds.</b><br>Requested: ₹${amount.toLocaleString('en-IN')}<br>Available: <code>₹${bal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</code><br>Please enter a lesser amount.`, true)];
      }
      try {
        const accNo = isAuthenticated ? session.accountNumber : String(s.tempToAcc);
        let newBal;
        if (isAuthenticated) {
          const res = await withdraw(accNo, amount);
          newBal = res.balance ?? (bal - amount);
          if (onTransactionComplete) onTransactionComplete();
        } else {
          s.accounts[s.tempToAcc].balance -= amount;
          newBal = s.accounts[s.tempToAcc].balance;
        }
        const txnId = `TXN-${Date.now().toString().slice(-6)}`;
        reset();
        return [text(`✅ <b>Withdrawal Successful!</b><br><br>
          Amount withdrawn: <b style="color:#E8580C">₹${amount.toLocaleString('en-IN')}</b><br>
          Account: <code>${accNo}</code><br>
          Remaining Balance: <b>₹${Number(newBal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</b><br>
          Transaction ID: <code>${txnId}</code>`)
        , menuChips()];
      } catch (e) {
        reset();
        return [text('⚠️ Withdrawal failed: ' + (e?.response?.data?.message || 'Server error'), true), menuChips()];
      }
    }
  }

  // ══ TRANSFER ══
  function startTransfer() {
    s.lastAction = 'transfer';
    if (isAuthenticated) {
      s.currentStep = 'toAcc';
      const bal = Number(session.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
      return [text(`🔁 <b>Transfer Funds</b><br><br>Your balance: <b style="color:#F9C74F">₹${bal}</b><br><br>Enter the <b>receiver's account number</b>:`)];
    }
    s.currentStep = 'fromAcc';
    return [text('🔁 <b>Transfer Funds</b><br><br>Enter the <b>sender account number</b>. Example: <code>ACC-1001</code>')];
  }

  async function handleTransfer(msg) {
    if (s.currentStep === 'fromAcc') {
      const acc = mockGetAcc(msg);
      if (!acc) return [text('⚠️ Sender account not found.', true)];
      s.tempToAcc = null; s._fromId = acc.id; s.currentStep = 'toAcc';
      return [text(`✅ Sender: <b>${acc.name}</b> · Balance: <code>₹${acc.balance.toLocaleString('en-IN')}</code><br><br>Enter <b>receiver account number</b>:`)];
    }
    if (s.currentStep === 'toAcc') {
      try {
        // Try real API lookup
        const rawNo = msg.replace(/acc-/i, '').trim();
        let receiverName = null;
        let receiverAccNo = rawNo;
        try {
          const res = await getAccountDetails(rawNo);
          if (res) {
            receiverName = res.holderName || res.name;
            receiverAccNo = res.accountNumber || rawNo;
            if (isAuthenticated && receiverAccNo === session.accountNumber) {
              return [text('⚠️ You cannot transfer to your own account.', true)];
            }
          }
        } catch {
          // fall back to mock
          const acc = mockGetAcc(msg);
          if (!acc) return [text('⚠️ Receiver account not found. Please check the number.', true)];
          if (!isAuthenticated && acc.id === s._fromId) return [text('⚠️ Sender and receiver cannot be the same account.', true)];
          receiverName = acc.name;
          receiverAccNo = String(acc.id);
        }
        s.tempToAcc = receiverAccNo;
        s.tempReceiverName = receiverName;
        s.currentStep = 'confirmReceiver';
        return [text(`Receiver found: <b>${receiverName || 'Account ' + receiverAccNo}</b> (<code>${receiverAccNo}</code>).<br>Is this correct?`), chips(['Yes', 'No'])];
      } catch {
        return [text('⚠️ Receiver account not found. Please check the number.', true)];
      }
    }
    if (s.currentStep === 'confirmReceiver') {
      if (/no|wrong|incorrect/.test(msg.toLowerCase())) {
        s.currentStep = 'toAcc'; s.tempToAcc = null; s.tempReceiverName = null;
        return [text('Please enter the correct receiver account number:')];
      }
      s.currentStep = 'amount';
      const bal = isAuthenticated ? Number(session.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '';
      return [text(`Enter <b>transfer amount</b> (₹):${isAuthenticated ? `<br><small style="color:#6C6C80">Your balance: ₹${bal}</small>` : ''}`)];
    }
    if (s.currentStep === 'amount') {
      const amount = Number(msg.replace(/[₹,\s]/g, ''));
      if (!validators.amount(amount)) return [text('⚠️ Please enter a valid positive amount.', true)];
      const senderBal = isAuthenticated ? Number(session.balance) : (s.accounts[s._fromId]?.balance || 0);
      if (amount > senderBal) {
        return [text(`⚠️ <b>Insufficient funds.</b><br>Available: <code>₹${senderBal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</code>`, true)];
      }
      try {
        const fromAcc = isAuthenticated ? session.accountNumber : String(s._fromId);
        const toAcc = s.tempToAcc;
        const receiverName = s.tempReceiverName || toAcc;
        let newBal;
        if (isAuthenticated) {
          const res = await transfer(fromAcc, toAcc, amount);
          newBal = res.balance ?? (senderBal - amount);
          if (onTransactionComplete) onTransactionComplete();
        } else {
          s.accounts[s._fromId].balance -= amount;
          if (s.accounts[Number(toAcc)]) s.accounts[Number(toAcc)].balance += amount;
          newBal = s.accounts[s._fromId].balance;
        }
        const txnId = `TXN-${Date.now().toString().slice(-6)}`;
        reset();
        return [text(`✅ <b>Transfer Successful!</b><br><br>
          Sent to: <b>${receiverName}</b> (<code>${toAcc}</code>)<br>
          Amount: <b style="color:#F9C74F">₹${amount.toLocaleString('en-IN')}</b><br>
          Your Balance: <b>₹${Number(newBal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</b><br>
          Transaction ID: <code>${txnId}</code><br>
          <small style="color:#6C6C80">${new Date().toLocaleString('en-IN')}</small>
          ${amount > 50000 ? '<br><br>⚠️ Large transaction alert recorded for compliance.' : ''}`)
        , menuChips()];
      } catch (e) {
        reset();
        return [text('⚠️ Transfer failed: ' + (e?.response?.data?.message || 'Server error'), true), menuChips()];
      }
    }
  }

  // ══ HISTORY / STATEMENT ══
  function startHistory() {
    s.lastAction = 'history'; s.currentStep = 'accNo';
    if (isAuthenticated) {
      // skip asking account number
      s.currentStep = 'fetching';
      return fetchHistory(session.accountNumber);
    }
    return [text('📋 <b>Transaction History</b><br><br>Enter your <b>account number</b>. Example: <code>ACC-1001</code>')];
  }

  async function fetchHistory(accNo) {
    try {
      const txns = await getTransactionHistory(accNo);
      if (!txns || txns.length === 0) {
        reset();
        return [text(`No transactions found for <code>${accNo}</code>.`), menuChips()];
      }
      const last6 = txns.slice(0, 6);
      const rows = last6.map(t => {
        const isCredit = t.type === 'DEPOSIT' || (t.type === 'TRANSFER' && t.toAccountNumber === accNo);
        const sign = isCredit ? '+' : '-';
        const color = isCredit ? '#10B981' : '#E8580C';
        const label = t.type === 'DEPOSIT' ? '↓ DEPOSIT' : t.type === 'WITHDRAW' ? '↑ WITHDRAW' : `⇄ TRANSFER ${isCredit ? 'IN' : 'OUT'}`;
        return `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #EDE8E1;font-size:12px">
          <span style="color:#6C6C80">${label}</span>
          <span style="color:${color};font-weight:600;font-family:monospace">${sign}₹${Number(t.amount).toLocaleString('en-IN')}</span>
        </div>`;
      }).join('');
      reset();
      return [{ t: 'raw', html: `<b>Last ${last6.length} transaction(s)</b><div style="margin-top:8px">${rows}</div>` }, menuChips()];
    } catch {
      reset();
      return [text('⚠️ Could not fetch transaction history. Please try again later.', true), menuChips()];
    }
  }

  async function handleHistory(msg) {
    if (s.currentStep === 'accNo') {
      const rawNo = msg.replace(/acc-/i, '').trim();
      return fetchHistory(rawNo);
    }
  }

  return { process, welcomeMsg, menuChips };
}

/* ─── React Component ───────────────────────────────────────────── */
export default function VaultXChatbot({ session, landingPage = false, onTransactionComplete }) {
  const navigate = typeof window !== 'undefined' ? useNavigate() : null;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(1);
  const bodyRef = useRef(null);
  const engineRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    engineRef.current = createChatEngine(session || null, navigate, onTransactionComplete);
  }, [session, navigate, onTransactionComplete]);

  useEffect(() => {
    if (open && messages.length === 0) {
      const eng = engineRef.current;
      // Landing page gets a special onboarding welcome
      const welcome = landingPage
        ? { t: 'text', html: `👋 <b>Hi there! Welcome to VaultX Exchange.</b><br><br>I can help you <b>create your free account</b> right here — no page navigation needed!<br><br>Just type <b>Create Account</b> and I'll guide you through the quick setup. Or ask me anything about VaultX.` }
        : eng.welcomeMsg();
      const chipsMsg = landingPage
        ? { t: 'chips', opts: ['Create Account', 'How does it work?', 'Features', 'Help'] }
        : eng.menuChips();
      setMessages([
        { id: 0, side: 'ts', text: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) },
        { id: 1, side: 'bot', ...welcome },
        { id: 2, side: 'chips', ...chipsMsg },
      ]);
      setUnread(0);
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, typing]);

  const addMsgs = (newMsgs) => {
    setMessages(prev => {
      const base = prev.filter(m => m.side !== 'chips'); // clear old chips
      const mapped = newMsgs.map((r, i) => ({
        id: Date.now() + i,
        side: r.t === 'chips' ? 'chips' : r.t === 'card' ? 'card' : r.t === 'raw' ? 'bot' : 'bot',
        html: r.html || r.text,
        isErr: r.isErr,
        opts: r.opts,
        details: r.details,
        raw: r.t === 'raw',
      }));
      return [...base, ...mapped];
    });
  };

  const send = async (text) => {
    if (!text.trim()) return;
    setInput('');
    // add user message, strip old chips
    setMessages(prev => [
      ...prev.filter(m => m.side !== 'chips'),
      { id: Date.now(), side: 'user', html: text },
    ]);
    setTyping(true);
    await new Promise(r => setTimeout(r, 450 + Math.random() * 350));
    setTyping(false);
    const responses = await engineRef.current.process(text);
    addMsgs(responses);
  };

  const handleChip = (opt) => send(opt);
  const handleKey = (e) => { if (e.key === 'Enter') send(input); };

  return (
    <>
      <style>{CSS}</style>

      {/* FAB */}
      <button className="vx-chat-fab" onClick={() => { setOpen(o => !o); setUnread(0); }} title="VaultX Assistant — click to chat">
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F9C74F" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F9C74F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
        )}
        {!open && unread > 0 && <span className="vx-chat-fab-badge" style={landingPage ? { animation: 'none' } : {}}>{unread}</span>}
      </button>

      {/* Panel */}
      {open && (
        <div className="vx-chat-panel">
          {/* Header */}
          <div className="vx-chat-header">
            <div className="vx-chat-avatar">VX</div>
            <div className="vx-chat-header-info">
              <div className="vx-chat-header-name">VAULT<span>X</span> ASSISTANT</div>
              <div className="vx-chat-header-status">
                {landingPage ? 'New User Guide · Create your account' : 'Online · VaultX Exchange'}
              </div>
            </div>
            <button className="vx-chat-close" onClick={() => setOpen(false)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="vx-chat-body" ref={bodyRef}>
            {messages.map((m) => {
              if (m.side === 'ts') return <div key={m.id} className="vx-chat-ts">{m.text}</div>;
              if (m.side === 'chips') return (
                <div key={m.id} className="vx-chat-chips">
                  {(m.opts || []).map(opt => (
                    <button key={opt} className="vx-chat-chip" onClick={() => handleChip(opt)}>{opt}</button>
                  ))}
                </div>
              );
              if (m.side === 'card') return (
                <div key={m.id} className="vx-chat-msg bot">
                  <div className="vx-chat-msg-av">VX</div>
                  <div className="vx-chat-bubble">
                    <b>Please confirm your details:</b>
                    <div className="vx-chat-card">
                      {[['Full Name', m.details?.name],
                        ['Date of Birth', m.details?.dob],
                        ['Mobile', m.details?.phone ? m.details.phone.slice(0,-4)+'****' : ''],
                        ['Email', m.details?.email ? m.details.email.replace(/^(.{2})(.*)(@.+)$/, '$1****$3') : ''],
                        ['Address', m.details?.address?.substring(0,30) + (m.details?.address?.length > 30 ? '…' : '')],
                        [m.details?.idType + ' No.', m.details?.idNo ? m.details.idNo.replace(/.(?=.{4})/g,'*') : ''],
                      ].map(([label, val]) => (
                        <div key={label} className="vx-chat-card-row">
                          <span className="vx-chat-card-label">{label}</span>
                          <span className="vx-chat-card-val">{val}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 8, fontSize: 13 }}>Is everything correct?</div>
                  </div>
                </div>
              );
              return (
                <div key={m.id} className={`vx-chat-msg ${m.side}`}>
                  <div className="vx-chat-msg-av">{m.side === 'bot' ? 'VX' : 'U'}</div>
                  <div className={`vx-chat-bubble${m.isErr ? ' err' : ''}`} dangerouslySetInnerHTML={{ __html: m.html }} />
                </div>
              );
            })}
            {typing && (
              <div className="vx-chat-msg bot">
                <div className="vx-chat-msg-av">VX</div>
                <div className="vx-chat-bubble"><div className="vx-chat-typing"><span/><span/><span/></div></div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="vx-chat-input-bar">
            <input
              ref={inputRef}
              className="vx-chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a message…"
              autoComplete="off"
            />
            <button className="vx-chat-send" onClick={() => send(input)} title="Send">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
