import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  // VaultX Exchange Branding
  const brand = { name: 'Vault', suffix: 'X', sub: 'EXCHANGE' };
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const colors = {
    cream: '#F5F0EB',         // ALL page backgrounds
    white: '#FFFFFF',          // cards, navbar, forms, modals
    offWhite: '#FAF7F4',       // alternate sections
    novaBlush: '#F2C4CE',      // testimonials, soft feature bg
    footerBg: '#EDE8E1',       // footer background (light, not dark)
    deepNavy: '#1A1A2E',       // TEXT ONLY — headings, nav links
    nearBlack: '#0F0F1A',      // TEXT ONLY — body text
    deepRed: '#C0392B',        // CTA buttons, active states, highlights
    vividRed: '#E84040',       // button hover, withdraw badge, errors
    orange: '#E8580C',         // secondary buttons, badges, icons
    gold: '#F9C74F',           // balance amounts, deposit badge
    mutedGray: '#6C6C80',      // subtext, labels, placeholders
    border: '#EDE8E1',         // borders and dividers
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' }
  ];

  const faqs = [
    { q: "How do I create an account?", a: "Simply click 'Get Started' and enter your details to open your first simulation account instantly." },
    { q: "Is my money safe in the simulation?", a: "This is a bank simulation platform. No real money is used, making it a safe environment to practice financial management." },
    { q: "How do I transfer funds between accounts?", a: "Navigate to the transfer section in your dashboard, select the source and destination accounts, and enter the amount." },
    { q: "Can I have multiple accounts?", a: "Yes! Our Pro and Enterprise plans allow you to manage multiple distinct accounts under one single simulation profile." },
    { q: "How do I view my transaction history?", a: "Each account page features a detailed transaction ledger showing every deposit, withdrawal, and transfer with timestamps." }
  ];

  return (
    <div style={{ backgroundColor: colors.cream, color: colors.nearBlack, fontFamily: "'Inter', sans-serif" }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600;700&display=swap');

          html { scroll-behavior: smooth; }
          .font-playfair { font-family: 'Playfair Display', serif; }
          .btn-primary { transition: background-color 0.2s ease, transform 0.2s ease; }
          .btn-primary:hover { background-color: ${colors.vividRed} !important; transform: translateY(-1px); }
          .btn-outline:hover { background-color: ${colors.deepRed} !important; color: #fff !important; }
          .nav-link { transition: color 0.2s ease; }
          .nav-link:hover { color: ${colors.deepRed} !important; }
          .feature-card { transition: all 0.3s ease; border-top: 4px solid transparent; }
          .feature-card:hover { border-top: 4px solid ${colors.deepRed} !important; transform: translateY(-6px); box-shadow: 0 20px 40px rgba(192,57,43,0.12); }
          .footer-link { transition: color 0.2s ease; }
          .footer-link:hover { color: ${colors.deepRed} !important; }
          .social-icon { transition: color 0.2s ease, transform 0.2s ease; }
          .social-icon:hover { color: ${colors.deepRed} !important; transform: scale(1.15); }
        `}
      </style>

      {/* ── 1. NAVBAR ── */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'shadow-md py-4' : 'py-6'}`}
        style={{ backgroundColor: colors.white, borderBottom: `1px solid ${colors.border}` }}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" fill={colors.deepRed} />
              <path d="M12 7V17M7 12H17" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div className="flex flex-col leading-none">
              <div className="flex items-baseline">
                <span className="text-2xl font-black italic tracking-tighter" style={{ color: colors.deepNavy }}>{brand.name}</span>
                <span className="text-3xl font-black italic tracking-tighter" style={{ color: colors.deepRed }}>{brand.suffix}</span>
              </div>
              <span className="text-[8px] font-black tracking-[0.3em] ml-0.5" style={{ color: colors.mutedGray }}>{brand.sub}</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                className="nav-link font-medium"
                style={{ color: colors.deepNavy }}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="btn-outline px-6 py-2 border-2 font-semibold rounded-lg transition-all"
              style={{ color: colors.deepRed, borderColor: colors.deepRed, backgroundColor: 'transparent' }}
            >
              Log In
            </Link>
            <Link
              to="/login"
              className="btn-primary px-6 py-2 font-semibold text-white rounded-lg shadow-md"
              style={{ backgroundColor: colors.deepRed }}
            >
              Get Started
            </Link>
          </div>

          {/* Hamburger */}
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.deepNavy} strokeWidth="2">
              <path d={isMobileMenuOpen ? "M18 6L6 18M6 6l12 12" : "M3 12h18M3 6h18M3 18h18"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden px-6 py-4 flex flex-col space-y-4 shadow-xl"
            style={{ backgroundColor: colors.white, borderBottom: `1px solid ${colors.border}` }}
          >
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                className="font-medium"
                style={{ color: colors.deepNavy }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Link to="/login" className="font-semibold" style={{ color: colors.deepRed }}>Log In</Link>
            <Link
              to="/login"
              className="py-3 rounded-lg text-center font-bold text-white"
              style={{ backgroundColor: colors.deepRed }}
            >
              Get Started
            </Link>
          </div>
        )}
      </nav>

      {/* ── 2. HERO SECTION ── */}
      <section id="home" className="pt-32 pb-20 px-6 min-h-[90vh] flex items-center" style={{ backgroundColor: colors.cream }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="space-y-8">
            <span
              className="inline-block px-4 py-1 rounded-full text-xs font-bold tracking-wider"
              style={{ backgroundColor: colors.white, color: colors.orange, border: `1px solid ${colors.orange}` }}
            >
              🏦 THE FUTURE OF BANKING
            </span>
            <h1
              className="font-playfair text-5xl md:text-6xl leading-tight"
              style={{ fontFamily: "'Playfair Display', serif", color: colors.deepNavy }}
            >
              Smarter Banking <br /> for Everyone
            </h1>
            <p className="text-lg md:text-xl max-w-lg leading-relaxed" style={{ color: colors.mutedGray }}>
              Manage your accounts, transfer funds, and track every transaction — all in one secure simulation platform.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/login"
                className="btn-primary px-8 py-4 font-bold text-white rounded-xl text-center shadow-lg"
                style={{ backgroundColor: colors.deepRed }}
              >
                Get Started →
              </Link>
              <button
                className="btn-outline px-8 py-4 font-bold rounded-xl border-2 text-center transition-all"
                style={{ borderColor: colors.deepRed, color: colors.deepRed, backgroundColor: colors.white }}
              >
                Learn More
              </button>
            </div>
            <div className="flex flex-wrap gap-6 text-sm font-medium pt-2" style={{ color: colors.mutedGray }}>
              {['Free to use', 'Instant setup', 'Secure transactions'].map(item => (
                <span key={item} className="flex items-center gap-2">
                  <svg width="16" height="16" style={{ color: colors.deepRed }} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Right — Mock Card */}
          <div className="relative">
            <div
              className="p-8 rounded-3xl shadow-2xl relative z-10 overflow-hidden transform md:rotate-2 hover:rotate-0 transition-transform duration-500"
              style={{ backgroundColor: colors.white, borderTop: `6px solid ${colors.deepRed}` }}
            >
              <div className="flex justify-between items-center mb-10">
                <span className="font-bold text-sm tracking-widest" style={{ color: colors.mutedGray }}>NEXUS CARD</span>
                <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                  <circle cx="12" cy="12" r="12" fill={colors.deepRed} fillOpacity="0.8" />
                  <circle cx="28" cy="12" r="12" fill={colors.orange} fillOpacity="0.8" />
                </svg>
              </div>
              <div className="mb-8">
                <p className="text-xs font-medium mb-1" style={{ color: colors.mutedGray }}>Current Balance</p>
                <h4 className="text-4xl font-bold" style={{ color: colors.gold }}>$12,345.67</h4>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: colors.mutedGray }}>Account Number</p>
                  <p className="text-sm font-bold font-mono tracking-widest" style={{ color: colors.deepNavy }}>**** **** **** 8892</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: colors.mutedGray }}>Holder Name</p>
                  <p className="text-sm font-bold" style={{ color: colors.deepNavy }}>ALEX R. MARTINEZ</p>
                </div>
              </div>
            </div>
            {/* Blush shadow behind card */}
            <div
              className="absolute -top-4 -right-4 w-full h-full rounded-3xl -z-10 opacity-40"
              style={{ backgroundColor: colors.novaBlush }}
            />
          </div>
        </div>
      </section>

      {/* ── 3. STATS BAR ── */}
      <div style={{ backgroundColor: colors.deepRed }} className="py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-8">
          {[
            { n: '$2B+', l: 'Transactions Processed' },
            { n: '10K+', l: 'Active Accounts' },
            { n: '99.9%', l: 'System Uptime' },
            { n: '24/7', l: 'Customer Support' }
          ].map((s, i, arr) => (
            <React.Fragment key={s.l}>
              <div className="text-center flex-1 min-w-[140px]">
                <h5 className="text-4xl font-bold text-white mb-2">{s.n}</h5>
                <p className="text-sm font-medium" style={{ color: colors.novaBlush }}>{s.l}</p>
              </div>
              {i < arr.length - 1 && (
                <div className="hidden lg:block h-12 w-px" style={{ backgroundColor: 'rgba(242,196,206,0.3)' }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── 4. FEATURES SECTION ── */}
      <section id="features" className="py-24 px-6" style={{ backgroundColor: colors.offWhite }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-xs font-bold tracking-widest" style={{ color: colors.orange }}>SMART FINANCIAL TOOLS</span>
            <h2 className="text-4xl font-bold mt-4" style={{ color: colors.deepNavy }}>Everything You Need to Bank Smarter</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                t: 'Multiple Accounts',
                d: 'Open and manage multiple bank accounts from one place with distinct balances and histories.',
                icon: <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
              },
              {
                t: 'Instant Transfers',
                d: 'Send money between accounts in seconds with zero fees. Experience high-speed financial simulation.',
                icon: <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              },
              {
                t: 'Bank-Grade Security',
                d: 'Your data is protected with enterprise-level encryption and simulation-safe environment protocols.',
                icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              }
            ].map(f => (
              <div
                key={f.t}
                className="feature-card p-10 rounded-2xl shadow-sm"
                style={{ backgroundColor: colors.white, border: `1px solid ${colors.border}` }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-8"
                  style={{ backgroundColor: `${colors.deepRed}12` }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={colors.deepRed} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {f.icon}
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-4" style={{ color: colors.deepNavy }}>{f.t}</h4>
                <p className="mb-8 leading-relaxed" style={{ color: colors.mutedGray }}>{f.d}</p>
                <a href="#" className="font-bold inline-flex items-center gap-2 transition-all hover:gap-3" style={{ color: colors.deepRed }}>
                  Learn More <span>→</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-6" style={{ backgroundColor: colors.cream }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-xs font-bold tracking-widest" style={{ color: colors.orange }}>SIMPLE PROCESS</span>
            <h2 className="text-4xl font-bold mt-4" style={{ color: colors.deepNavy }}>Up and Running in 3 Simple Steps</h2>
          </div>
          <div className="relative flex flex-col md:flex-row justify-between items-start space-y-20 md:space-y-0">
            {/* Dotted connecting line */}
            <div
              className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0"
              style={{ borderTop: `2px dashed ${colors.mutedGray}`, opacity: 0.25, top: '3rem' }}
            />
            {[
              { s: '01', t: 'Create Your Account', d: 'Click Get Started and sign up for your free simulator profile in seconds.' },
              { s: '02', t: 'Add Your Funds', d: 'Deposit virtual currency into your new account to start your simulation.' },
              { s: '03', t: 'Start Banking', d: 'Transfer funds, track history, and manage your entire financial world.' }
            ].map(step => (
              <div key={step.s} className="relative z-10 text-center flex-1 px-6">
                <div
                  className="w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-8 border-2"
                  style={{ borderColor: colors.deepRed, color: colors.deepRed, backgroundColor: colors.white }}
                >
                  <span className="text-2xl font-black">{step.s}</span>
                </div>
                <h4 className="text-xl font-bold mb-4" style={{ color: colors.deepNavy }}>{step.t}</h4>
                <p style={{ color: colors.mutedGray }}>{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. TESTIMONIALS ── */}
      <section className="py-24 px-6" style={{ backgroundColor: colors.novaBlush }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest" style={{ color: colors.orange }}>TESTIMONIALS</span>
            <h2 className="text-4xl font-bold mt-4" style={{ color: colors.deepNavy }}>What Our Users Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n: 'Alice Johnson', r: 'Student', q: "Nexus changed how I learn finance. The simulation is incredibly realistic and intuitive." },
              { n: 'Bob Martinez', r: 'Freelancer', q: "Finally, a way to map out my business finances without any risk. The transfer speeds are amazing!" },
              { n: 'Sarah Lee', r: 'Developer', q: "The cleanest UI I've seen in a banking app. It works flawlessly and feels absolutely premium." }
            ].map((t, i) => (
              <div key={i} className="p-10 rounded-2xl shadow-xl" style={{ backgroundColor: colors.white }}>
                <div className="flex mb-6">
                  {[1, 2, 3, 4, 5].map(s => (
                    <svg key={s} className="w-5 h-5" style={{ color: colors.gold }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="italic mb-8 font-medium leading-relaxed" style={{ color: colors.nearBlack }}>"{t.q}"</p>
                <div className="flex items-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white mr-4 text-sm"
                    style={{ backgroundColor: colors.deepRed }}
                  >
                    {t.n.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h5 className="font-bold" style={{ color: colors.deepNavy }}>{t.n}</h5>
                    <p className="text-xs uppercase font-bold tracking-widest" style={{ color: colors.mutedGray }}>{t.r}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. PRICING SECTION ── */}
      <section id="pricing" className="py-24 px-6" style={{ backgroundColor: colors.white }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-xs font-bold tracking-widest" style={{ color: colors.orange }}>PRICING</span>
            <h2 className="text-4xl font-bold mt-4" style={{ color: colors.deepNavy }}>Simple, Transparent Plans</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 items-center">

            {/* Free */}
            <div
              className="p-10 rounded-3xl border-2"
              style={{ backgroundColor: colors.white, borderColor: colors.border }}
            >
              <h4 className="text-xl font-bold mb-2" style={{ color: colors.deepNavy }}>Free</h4>
              <p className="text-4xl font-bold mb-6" style={{ color: colors.deepNavy }}>
                $0<span className="text-sm font-medium" style={{ color: colors.mutedGray }}>/month</span>
              </p>
              <ul className="space-y-4 mb-10">
                {['Single account', 'Basic transactions', 'Email support', 'Real-time tracking'].map(item => (
                  <li key={item} className="flex items-center text-sm font-medium" style={{ color: colors.nearBlack }}>
                    <svg className="w-5 h-5 mr-3 flex-shrink-0" style={{ color: colors.deepRed }} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                className="w-full py-4 rounded-xl font-bold border-2 transition-all"
                style={{ borderColor: colors.border, color: colors.deepNavy, backgroundColor: colors.offWhite }}
              >
                Get Started
              </button>
            </div>

            {/* Pro — Most Popular */}
            <div
              className="p-10 rounded-3xl border-4 relative shadow-2xl transform md:scale-105"
              style={{ backgroundColor: colors.white, borderColor: colors.deepRed }}
            >
              <div
                className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1 rounded-full text-[10px] font-black text-white tracking-wider"
                style={{ backgroundColor: colors.deepRed }}
              >
                MOST POPULAR
              </div>
              <h4 className="text-xl font-bold mb-2" style={{ color: colors.deepNavy }}>Pro</h4>
              <p className="text-4xl font-bold mb-6" style={{ color: colors.deepNavy }}>
                $15<span className="text-sm font-medium" style={{ color: colors.mutedGray }}>/month</span>
              </p>
              <ul className="space-y-4 mb-10">
                {['Up to 5 accounts', 'Unlimited transfers', 'Priority support', 'Multi-currency simulation'].map(item => (
                  <li key={item} className="flex items-center text-sm font-medium" style={{ color: colors.nearBlack }}>
                    <svg className="w-5 h-5 mr-3 flex-shrink-0" style={{ color: colors.deepRed }} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                className="btn-primary w-full py-4 rounded-xl font-bold text-white shadow-lg"
                style={{ backgroundColor: colors.deepRed }}
              >
                Get Started
              </button>
            </div>

            {/* Enterprise */}
            <div
              className="p-10 rounded-3xl border-2"
              style={{ backgroundColor: colors.white, borderColor: colors.orange }}
            >
              <h4 className="text-xl font-bold mb-2" style={{ color: colors.deepNavy }}>Enterprise</h4>
              <p className="text-4xl font-bold mb-6" style={{ color: colors.deepNavy }}>
                $30<span className="text-sm font-medium" style={{ color: colors.mutedGray }}>/month</span>
              </p>
              <ul className="space-y-4 mb-10">
                {['Unlimited accounts', 'API access', 'Dedicated manager', 'Custom analytics'].map(item => (
                  <li key={item} className="flex items-center text-sm font-medium" style={{ color: colors.nearBlack }}>
                    <svg className="w-5 h-5 mr-3 flex-shrink-0" style={{ color: colors.deepRed }} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                className="w-full py-4 rounded-xl font-bold border-2 transition-all hover:opacity-90"
                style={{ borderColor: colors.orange, color: colors.orange, backgroundColor: 'transparent' }}
              >
                Contact Us
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── 8. FAQ SECTION ── */}
      <section id="faq" className="py-24 px-6" style={{ backgroundColor: colors.offWhite }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest" style={{ color: colors.orange }}>FAQ</span>
            <h2 className="text-4xl font-bold mt-4" style={{ color: colors.deepNavy }}>Still Have Questions?</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden shadow-sm"
                style={{ backgroundColor: colors.white, border: `1px solid ${colors.border}` }}
              >
                <button
                  className="w-full p-6 text-left flex justify-between items-center transition-colors"
                  style={{ backgroundColor: 'transparent' }}
                  onClick={() => toggleFaq(i)}
                >
                  <span className="font-bold text-lg pr-4" style={{ color: colors.deepNavy }}>{faq.q}</span>
                  <svg
                    className={`w-6 h-6 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                    style={{ color: colors.deepRed }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openFaq === i ? 'max-h-40' : 'max-h-0'}`}>
                  <div className="px-6 pb-6 font-medium leading-relaxed" style={{ color: colors.mutedGray }}>
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. CTA BANNER ── */}
      <section className="py-24 px-6" style={{ backgroundColor: colors.cream }}>
        <div
          className="max-w-7xl mx-auto rounded-3xl p-16 text-center text-white shadow-2xl relative overflow-hidden"
          style={{ backgroundColor: colors.deepRed }}
        >
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full -translate-x-1/2 -translate-y-1/2" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full translate-x-1/3 translate-y-1/3" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
          <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ready to Start Exchange with VaultX?
          </h2>
          <p className="text-xl mb-12 relative z-10 font-medium" style={{ color: colors.novaBlush }}>
            Join 10,000+ users practicing smarter finance every day.
          </p>
          <Link
            to="/login"
            className="inline-block px-12 py-5 font-black rounded-2xl transition-transform hover:scale-105 shadow-xl relative z-10"
            style={{ backgroundColor: colors.white, color: colors.deepRed }}
          >
            Open Free Account →
          </Link>
        </div>
      </section>

      {/* ── 10. FOOTER — light cream, NO dark background ── */}
      <footer className="py-20 px-6" style={{ backgroundColor: colors.footerBg, borderTop: `1px solid ${colors.border}` }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center space-x-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" fill={colors.deepRed} />
                <path d="M12 7V17M7 12H17" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <div className="flex flex-col leading-none">
                <div className="flex items-baseline">
                  <span className="text-xl font-black italic tracking-tighter" style={{ color: colors.deepNavy }}>{brand.name}</span>
                  <span className="text-2xl font-black italic tracking-tighter" style={{ color: colors.deepRed }}>{brand.suffix}</span>
                </div>
                <span className="text-[6px] font-black tracking-[0.3em] ml-0.5" style={{ color: colors.mutedGray }}>{brand.sub}</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: colors.mutedGray }}>
              The world's leading banking simulation platform for students, developers, and financial enthusiasts.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4">
              {['twitter', 'github', 'linkedin', 'instagram'].map(s => (
                <a key={s} href="#" className="social-icon" style={{ color: colors.mutedGray }}>
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {[
            { t: 'Product', l: ['Features', 'Pricing', 'Security', 'Simulation Engine'] },
            { t: 'Company', l: ['About Us', 'Careers', 'Press', 'Privacy Policy'] },
            { t: 'Support', l: ['FAQ', 'Documentation', 'Contact', 'System Status'] }
          ].map(col => (
            <div key={col.t} className="space-y-6">
              <h4 className="font-bold text-lg" style={{ color: colors.deepNavy }}>{col.t}</h4>
              <ul className="space-y-4">
                {col.l.map(link => (
                  <li key={link}>
                    <a href="#" className="footer-link text-sm font-medium" style={{ color: colors.mutedGray }}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          className="max-w-7xl mx-auto mt-16 pt-8 flex flex-col md:flex-row justify-between items-center"
          style={{ borderTop: `1px solid ${colors.border}` }}
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-4 md:mb-0" style={{ color: colors.mutedGray }}>
            © 2026 VaultX Exchange. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs" style={{ color: colors.mutedGray }}>
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
            <a href="#" className="footer-link">Cookie Policy</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;