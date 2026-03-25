import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const brand = { name: 'Vault', suffix: 'X', sub: 'EXCHANGE' };
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
  ];

  const faqs = [
    { q: 'How do I create an account?', a: "Simply click 'Get Started' and enter your details to open your first simulation account instantly." },
    { q: 'Is my money safe in the simulation?', a: 'This is a bank simulation platform. No real money is used — a completely safe environment to practice financial management.' },
    { q: 'How do I transfer funds?', a: 'Go to any account page, click Transfer, enter the destination account number and amount, then confirm.' },
    { q: 'Can I have multiple accounts?', a: 'Yes! Pro and Enterprise plans support multiple accounts under one simulation profile.' },
    { q: 'How do I view my transaction history?', a: 'Every account page has a full transaction ledger with deposits, withdrawals, and transfers with timestamps.' },
  ];

  const features = [
    {
      title: 'Multiple Accounts',
      desc: 'Open and manage multiple bank accounts from one place with distinct balances and complete transaction histories.',
      icon: 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z',
      iconColor: 'text-[#3D3535]',
      iconBg: 'bg-[#3D3535]/10',
    },
    {
      title: 'Instant Transfers',
      desc: 'Send money between accounts in seconds with zero fees. Experience real-time high-speed financial simulation.',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      iconColor: 'text-[#E8580C]',
      iconBg: 'bg-[#E8580C]/10',
    },
    {
      title: 'Bank-Grade Security',
      desc: 'Your data is protected with enterprise-level encryption and simulation-safe environment protocols at every layer.',
      icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
      iconColor: 'text-emerald-500',
      iconBg: 'bg-emerald-500/10',
    },
  ];

  const testimonials = [
    { name: 'Alice Johnson', role: 'Student', quote: 'VaultX changed how I learn finance. The simulation is incredibly realistic and the UI is genuinely beautiful.' },
    { name: 'Bob Martinez', role: 'Freelancer', quote: 'Finally a way to map out business finances without any risk. The transfer speeds are amazing — feels completely real.' },
    { name: 'Sarah Lee', role: 'Developer', quote: 'The cleanest banking UI I have ever seen. Works flawlessly and the design feels premium in every single detail.' },
  ];

  const stats = [
    { n: '$2B+', l: 'Transactions Processed', emoji: <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg> },
    { n: '10K+', l: 'Active Accounts', emoji: <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
    { n: '99.9%', l: 'System Uptime', emoji: <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
    { n: '24/7', l: 'Customer Support', emoji: <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
  ];

  // ── Logo ──────────────────────────────────
  const Logo = ({ large = false }) => (
    <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
      <div className={`${large ? 'w-10 h-10' : 'w-9 h-9'} rounded-xl bg-[#3D3535] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#3D3535]/30`}>
        <svg width={large ? 22 : 18} height={large ? 22 : 18} viewBox="0 0 24 24" fill="none">
          <path d="M9 12L11 14L15 10M12 2L3 7V13C3 17.97 7.02 22.63 12 24C16.98 22.63 21 17.97 21 13V7L12 2Z"
            stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline">
          <span className={`${large ? 'text-2xl' : 'text-xl'} font-black italic tracking-tight text-[#1A1A2E]`}>{brand.name}</span>
          <span className={`${large ? 'text-3xl' : 'text-2xl'} font-black italic tracking-tight text-[#3D3535]`}>{brand.suffix}</span>
        </div>
        <span className="text-[7px] font-black tracking-[0.3em] text-[#6C6C80] mt-0.5">{brand.sub}</span>
      </div>
    </Link>
  );

  // ── Check icon ────────────────────────────
  const Check = ({ color = '#3D3535' }) => (
    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}18` }}>
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <path d="M2 6l3 3 5-5" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );

  return (
    <div className="bg-[#F5F0EB] text-[#0F0F1A] font-sans overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Inter:wght@400;500;600;700;800;900&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        .nav-link-underline { position: relative; padding-bottom: 3px; }
        .nav-link-underline::after { content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 2px; background: #3D3535; transition: width .25s ease; border-radius: 2px; }
        .nav-link-underline:hover::after { width: 100%; }
        .feature-card-hover { position: relative; overflow: hidden; }
        .feature-card-hover::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: #3D3535; transform: scaleX(0); transform-origin: left; transition: transform .3s ease; }
        .feature-card-hover:hover::before { transform: scaleX(1); }
        .faq-icon-rotate { transition: all .3s ease; }
        .faq-icon-rotate.open { background: #3D3535 !important; transform: rotate(180deg); }
      `}</style>

      {/* ══════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#EDE8E1] transition-all duration-300 ${isScrolled ? 'shadow-md py-3' : 'py-5'}`}>
        <div className="w-full px-8 flex items-center justify-between">
          <Logo />

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-9">
            {navLinks.map(l => (
              <a key={l.name} href={l.href}
                className="nav-link-underline text-[#1A1A2E] hover:text-[#3D3535] font-medium text-sm transition-colors duration-200">
                {l.name}
              </a>
            ))}
          </div>

          {/* Desktop buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login"
              className="px-5 py-2.5 border-2 border-[#3D3535] text-[#3D3535] font-semibold text-sm rounded-xl hover:bg-[#3D3535] hover:text-white transition-all duration-200">
              Log In
            </Link>
            <Link to="/login"
              className="px-5 py-2.5 bg-[#3D3535] text-white font-semibold text-sm rounded-xl hover:bg-[#2A2A2A] transition-all duration-200 shadow-lg shadow-[#3D3535]/25">
              Get Started
            </Link>
          </div>

          {/* Hamburger */}
          <button className="md:hidden p-1" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1A2E" strokeWidth="2.5" strokeLinecap="round">
              <path d={isMobileMenuOpen ? "M18 6L6 18M6 6l12 12" : "M3 8h18M3 16h18"} />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-[#EDE8E1] px-6 py-5 flex flex-col gap-4">
            {navLinks.map(l => (
              <a key={l.name} href={l.href}
                className="text-[#1A1A2E] font-medium text-base"
                onClick={() => setIsMobileMenuOpen(false)}>
                {l.name}
              </a>
            ))}
            <div className="flex gap-3 pt-2">
              <Link to="/login" className="flex-1 py-3 border-2 border-[#3D3535] text-[#3D3535] font-bold text-sm rounded-xl text-center">Log In</Link>
              <Link to="/login" className="flex-1 py-3 bg-[#3D3535] text-white font-bold text-sm rounded-xl text-center">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section id="home" className="bg-[#F5F0EB] pt-32 pb-20 min-h-[92vh] flex items-center px-8">
        <div className="w-full">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div className="flex flex-col gap-7">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E8580C]/30 bg-[#E8580C]/06 w-fit">
                <span className="text-sm">🏦</span>
                <span className="text-xs font-bold text-[#E8580C] tracking-widest">THE FUTURE OF BANKING</span>
              </div>

              <h1 className="font-playfair text-5xl md:text-6xl font-bold text-[#1A1A2E] leading-[1.15]">
                Smarter Banking<br />
                <em className="text-[#3D3535] not-italic font-bold" style={{ fontStyle: 'italic' }}>for Everyone</em>
              </h1>

              <p className="text-lg text-[#6C6C80] leading-relaxed max-w-lg">
                Manage accounts, transfer funds, and track every transaction — all in one secure simulation platform built for the modern world.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to="/login"
                  className="px-8 py-4 bg-[#3D3535] text-white font-bold rounded-xl hover:bg-[#2A2A2A] transition-all duration-200 shadow-xl shadow-[#3D3535]/25 hover:-translate-y-0.5">
                  Get Started →
                </Link>
                <button className="px-8 py-4 border-2 border-[#3D3535] text-[#3D3535] font-bold rounded-xl hover:bg-[#3D3535] hover:text-white transition-all duration-200 bg-white">
                  Watch Demo
                </button>
              </div>

              <div className="flex flex-wrap gap-5 pt-1">
                {['Free to use', 'Instant setup', 'Secure transactions'].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-[#6C6C80] font-medium">
                    <Check />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Hero card */}
            <div className="relative hidden md:block p-5">
              {/* Background blobs */}
              <div className="absolute -top-4 -right-4 w-full h-full rounded-3xl bg-[#DDD8D0] opacity-40 z-0" />
              <div className="absolute -bottom-2 left-6 w-3/4 h-3/4 rounded-3xl bg-[#F9C74F]/10 z-0" />

              {/* Card */}
              <div className="relative z-10 bg-white rounded-3xl p-8 shadow-2xl border-t-[5px] border-[#3D3535] rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="flex justify-between items-center mb-7">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#3D3535]" />
                    <span className="text-[11px] font-black tracking-[0.15em] text-[#6C6C80]">VAULTX CARD</span>
                  </div>
                  <svg width="44" height="26" viewBox="0 0 44 26" fill="none">
                    <circle cx="14" cy="13" r="13" fill="#3D3535" fillOpacity="0.85" />
                    <circle cx="30" cy="13" r="13" fill="#E8580C" fillOpacity="0.75" />
                  </svg>
                </div>

                <div className="mb-6">
                  <p className="text-[11px] font-semibold text-[#6C6C80] tracking-widest uppercase mb-2">Available Balance</p>
                  <h3 className="text-5xl font-extrabold text-[#F9C74F] tracking-tight">$12,345.67</h3>
                </div>

                <div className="h-px bg-[#EDE8E1] mb-5" />

                <div className="flex justify-between items-end mb-5">
                  <div>
                    <p className="text-[9px] font-bold text-[#6C6C80] tracking-[0.15em] uppercase mb-1.5">Account Number</p>
                    <p className="text-sm font-bold font-mono tracking-widest text-[#1A1A2E]">**** **** **** 8892</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-[#6C6C80] tracking-[0.15em] uppercase mb-1.5">Holder</p>
                    <p className="text-sm font-bold text-[#1A1A2E]">ALEX R. MARTINEZ</p>
                  </div>
                </div>

                <div className="border-t border-[#EDE8E1] pt-4">
                  <p className="text-[11px] font-bold text-[#6C6C80] tracking-widest uppercase mb-3">Recent Activity</p>
                  {[
                    { label: 'Deposit from Alice', amount: '+$500.00', color: 'text-emerald-500' },
                    { label: 'Transfer to Bob', amount: '-$150.00', color: 'text-[#3D3535]' },
                  ].map((tx, i) => (
                    <div key={i} className={`flex justify-between items-center py-2 ${i === 0 ? 'border-b border-[#EDE8E1]' : ''}`}>
                      <span className="text-sm text-[#6C6C80] font-medium">{tx.label}</span>
                      <span className={`text-sm font-bold ${tx.color}`}>{tx.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════ */}
      <div className="bg-[#3D3535]">
        <div className="w-full px-8">
          <div className="flex flex-wrap">
            {stats.map((s, i) => (
              <div key={s.l}
                className={`flex-1 min-w-[180px] py-9 px-6 text-center ${i < stats.length - 1 ? 'border-r border-white/10' : ''}`}>
                <div className="flex justify-center text-[#F9C74F] mb-3">{s.emoji}</div>
                <div className="text-4xl font-extrabold text-white mb-1 tracking-tight">{s.n}</div>
                <div className="text-sm font-medium text-white/80">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          FEATURES
      ══════════════════════════════════════ */}
      <section id="features" className="bg-[#FAF7F4] py-24 px-8">
        <div className="w-full">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#E8580C]/08 border border-[#E8580C]/20 text-xs font-black text-[#E8580C] tracking-widest mb-4">
              SMART FINANCIAL TOOLS
            </span>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#1A1A2E]">
              Everything You Need to Bank Smarter
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title}
                className="feature-card-hover bg-white border border-[#EDE8E1] rounded-2xl p-9 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#3D3535]/10 hover:border-[#3D3535]/20 transition-all duration-300">
                <div className={`w-14 h-14 ${f.iconBg.replace('bg-[#3D3535]/10', 'bg-[#3D3535]/10')} rounded-2xl flex items-center justify-center mb-6`}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className={f.iconColor.replace('text-[#3D3535]', 'text-[#3D3535]')}
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={f.icon} />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-[#1A1A2E] mb-3">{f.title}</h4>
                <p className="text-[#6C6C80] leading-relaxed mb-6">{f.desc}</p>
                <a href="#" className="inline-flex items-center gap-1.5 text-[#3D3535] font-bold text-sm hover:gap-3 transition-all duration-200">
                  Learn More →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section id="how-it-works" className="bg-[#F5F0EB] py-24 px-8">
        <div className="w-full">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#3D3535]/06 border border-[#3D3535]/15 text-xs font-black text-[#3D3535] tracking-widest mb-4">
              SIMPLE PROCESS
            </span>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#1A1A2E]">
              Up and Running in 3 Simple Steps
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-start gap-0">
            {[
              { n: '01', t: 'Create Your Account', d: 'Click Get Started and sign up for your free simulator profile in under 60 seconds.', emoji: <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
              { n: '02', t: 'Add Your Funds', d: 'Deposit virtual currency into your new account to begin your financial simulation journey.', emoji: <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
              { n: '03', t: 'Start Banking', d: 'Transfer, withdraw, track history, and manage your entire financial world with ease.', emoji: <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.5 4.5L21 3m0 0l-1.5 7.5M21 3l-6.75 6.75M12 8.25L4.5 15m0 0l-1.5 3 1.5-1.5zm0 0l1.5-1.5 6.75-6.75M8.25 12l-1.5 6M8.25 12l6-1.5" /></svg> },
            ].map((step, i) => (
              <React.Fragment key={step.n}>
                <div className="flex-1 text-center px-6">
                  <div className="w-20 h-20 rounded-full border-2 border-[#3D3535] bg-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#3D3535]/12">
                    <span className="font-playfair text-2xl font-black text-[#3D3535] italic">{step.n}</span>
                  </div>
                  <div className="flex justify-center text-[#3D3535] mb-4">{step.emoji}</div>
                  <h4 className="text-lg font-bold text-[#1A1A2E] mb-2">{step.t}</h4>
                  <p className="text-sm text-[#6C6C80] leading-relaxed max-w-[220px] mx-auto">{step.d}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:flex items-center justify-center w-16 pt-10 flex-shrink-0">
                    <div className="w-full border-t-2 border-dashed border-[#EDE8E1]" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      <section className="bg-[#2C1F1F] py-24 px-8">
        <div className="w-full">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-black text-white/80 tracking-widest mb-4">
              TESTIMONIALS
            </span>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white">
              What Our Users Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-9 shadow-lg hover:-translate-y-1 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <svg key={s} width="18" height="18" fill="#F9C74F" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-white/90 leading-relaxed italic mb-6 text-[15px]">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-5 border-t border-white/10">
                  <div className="w-11 h-11 rounded-full bg-[#3D3535] flex items-center justify-center text-white text-sm font-black flex-shrink-0">
                    {t.name.split(' ').map(w => w[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-xs font-semibold text-white/50 uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PRICING
      ══════════════════════════════════════ */}
      <section id="pricing" className="bg-white py-24 px-8">
        <div className="w-full">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#E8580C]/08 border border-[#E8580C]/20 text-xs font-black text-[#E8580C] tracking-widest mb-4">
              PRICING
            </span>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#1A1A2E]">
              Simple, Transparent Plans
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-center">

            {/* Free */}
            <div className="bg-white border-2 border-[#EDE8E1] rounded-3xl p-10 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <p className="text-xs font-black text-[#6C6C80] uppercase tracking-widest mb-2">Free</p>
              <div className="flex items-baseline gap-1 mb-7">
                <span className="text-5xl font-black text-[#1A1A2E] tracking-tight">$0</span>
                <span className="text-base text-[#6C6C80]">/month</span>
              </div>
              <ul className="space-y-3.5 mb-9">
                {['Single account', 'Basic transactions', 'Email support', 'Real-time tracking'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-[#0F0F1A]">
                    <Check /> {f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3.5 border-2 border-[#EDE8E1] rounded-xl bg-[#FAF7F4] text-[#1A1A2E] font-bold text-sm hover:bg-[#EDE8E1] transition-colors duration-200">
                Get Started
              </button>
            </div>

            {/* Pro */}
            <div className="bg-white border-[3px] border-[#3D3535] rounded-3xl p-10 relative shadow-2xl scale-105 hover:scale-[1.06] transition-all duration-300">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#3D3535] text-white text-[10px] font-black tracking-widest px-5 py-1.5 rounded-full whitespace-nowrap">
                MOST POPULAR
              </div>
              <p className="text-xs font-black text-[#3D3535] uppercase tracking-widest mb-2">Pro</p>
              <div className="flex items-baseline gap-1 mb-7">
                <span className="text-5xl font-black text-[#1A1A2E] tracking-tight">$15</span>
                <span className="text-base text-[#6C6C80]">/month</span>
              </div>
              <ul className="space-y-3.5 mb-9">
                {['Up to 5 accounts', 'Unlimited transfers', 'Priority support', 'Multi-currency simulation'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-[#0F0F1A]">
                    <Check /> {f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3.5 bg-[#3D3535] text-white font-bold text-sm rounded-xl hover:bg-[#2A2A2A] transition-colors duration-200 shadow-lg shadow-[#3D3535]/25">
                Get Started
              </button>
            </div>

            {/* Enterprise */}
            <div className="bg-white border-2 border-[#E8580C]/35 rounded-3xl p-10 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <p className="text-xs font-black text-[#E8580C] uppercase tracking-widest mb-2">Enterprise</p>
              <div className="flex items-baseline gap-1 mb-7">
                <span className="text-5xl font-black text-[#1A1A2E] tracking-tight">$30</span>
                <span className="text-base text-[#6C6C80]">/month</span>
              </div>
              <ul className="space-y-3.5 mb-9">
                {['Unlimited accounts', 'API access', 'Dedicated manager', 'Custom analytics'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-[#0F0F1A]">
                    <Check color="#E8580C" /> {f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3.5 border-2 border-[#E8580C] text-[#E8580C] font-bold text-sm rounded-xl hover:bg-[#E8580C] hover:text-white transition-all duration-200 bg-transparent">
                Contact Us
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQ
      ══════════════════════════════════════ */}
      <section id="faq" className="bg-[#FAF7F4] py-24 px-8">
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#E8580C]/08 border border-[#E8580C]/20 text-xs font-black text-[#E8580C] tracking-widest mb-4">
              FAQ
            </span>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#1A1A2E]">
              Still Have Questions?
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className={`bg-white border rounded-2xl overflow-hidden transition-colors duration-200 ${openFaq === i ? 'border-[#3D3535]/30' : 'border-[#EDE8E1] hover:border-[#3D3535]/20'}`}>
                <button
                  className="w-full px-6 py-5 flex justify-between items-center gap-4 text-left bg-transparent"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-base font-semibold text-[#1A1A2E] flex-1">{faq.q}</span>
                  <div className={`faq-icon-rotate w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${openFaq === i ? 'open' : 'bg-[#3D3535]/08'}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke={openFaq === i ? '#fff' : '#3D3535'} strokeWidth="2.5" strokeLinecap="round">
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-40' : 'max-h-0'}`}>
                  <div className="px-6 pb-5 text-[15px] text-[#6C6C80] leading-relaxed">{faq.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════ */}
      <section className="bg-[#F5F0EB] py-20 px-8">
        <div className="w-full">
          <div className="bg-[#3D3535] rounded-3xl px-10 py-20 text-center relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -right-10 w-80 h-80 rounded-full bg-white/5" />
            <div className="absolute top-1/2 left-[12%] -translate-y-1/2 w-28 h-28 rounded-full bg-[#F9C74F]/08" />

            <div className="relative z-10">
              <p className="text-[11px] font-black text-white/80 tracking-[0.2em] uppercase mb-4">
                START TODAY — IT'S FREE
              </p>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
                Ready to Start Banking<br />Smarter with VaultX?
              </h2>
              <p className="text-lg text-white/80 mb-10 max-w-md mx-auto leading-relaxed">
                Join 10,000+ users practising smarter finance every single day.
              </p>
              <Link to="/login"
                className="inline-flex items-center gap-2 bg-white text-[#3D3535] font-black text-base px-10 py-4 rounded-2xl hover:scale-105 hover:shadow-2xl transition-all duration-200 shadow-xl">
                Open Free Account →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="bg-[#EDE8E1] border-t border-[#EDE8E1] pt-16 pb-10 px-8">
        <div className="w-full">
          <div className="grid md:grid-cols-4 gap-12 mb-12">

            {/* Brand */}
            <div>
              <Logo />
              <p className="text-sm text-[#6C6C80] leading-relaxed mt-5 mb-6 max-w-[240px]">
                The world's leading banking simulation platform for students, developers, and financial enthusiasts.
              </p>
              <div className="flex gap-2.5">
                {[['T', 'Twitter'], ['G', 'GitHub'], ['L', 'LinkedIn'], ['I', 'Instagram']].map(([l, name]) => (
                  <a key={name} href="#" title={name}
                    className="w-9 h-9 rounded-xl bg-white border border-[#EDE8E1] flex items-center justify-center text-xs font-bold text-[#6C6C80] hover:bg-[#3D3535] hover:border-[#3D3535] hover:text-white hover:-translate-y-0.5 transition-all duration-200">
                    {l}
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {[
              { t: 'Product', l: ['Features', 'Pricing', 'Security', 'Simulation Engine'] },
              { t: 'Company', l: ['About Us', 'Careers', 'Press', 'Privacy Policy'] },
              { t: 'Support', l: ['FAQ', 'Documentation', 'Contact', 'System Status'] },
            ].map(col => (
              <div key={col.t}>
                <p className="text-xs font-black text-[#1A1A2E] uppercase tracking-widest mb-5">{col.t}</p>
                <ul className="space-y-3">
                  {col.l.map(link => (
                    <li key={link}>
                      <a href="#" className="text-sm font-medium text-[#6C6C80] hover:text-[#3D3535] transition-colors duration-200">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="border-t border-[#EDE8E1] pt-7 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm font-medium text-[#6C6C80]">
              © 2026 VaultX Exchange. All rights reserved.
            </p>
            <div className="flex gap-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
                <a key={l} href="#" className="text-sm font-medium text-[#6C6C80] hover:text-[#3D3535] transition-colors duration-200">
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;