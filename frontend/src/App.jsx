import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AccountProvider } from './store/AccountContext';

// Pages
import Dashboard from './pages/Dashboard';
import AccountDetail from './pages/AccountDetail';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';

/* ── Shared navbar shown on all app pages ─── */
function AppNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="glass-header">
      {/* Logo */}
      <Link to="/dashboard" style={{ textDecoration: 'none' }} className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-[#3D3535] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#3D3535]/30">
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <path d="M9 12L11 14L15 10M12 2L3 7V13C3 17.97 7.02 22.63 12 24C16.98 22.63 21 17.97 21 13V7L12 2Z"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline">
            <span className="text-xl font-black italic tracking-tight text-[#1A1A2E]">Vault</span>
            <span className="text-2xl font-black italic tracking-tight text-[#3D3535]">X</span>
          </div>
          <span className="text-[7px] font-black tracking-[0.3em] text-[#6C6C80] mt-0.5">EXCHANGE</span>
        </div>
      </Link>

      {/* Nav links */}
      <nav className="app-nav">
        <Link
          to="/dashboard"
          className={`app-nav-link${isActive('/dashboard') ? ' active' : ''}`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
          </svg>
          Dashboard
        </Link>
        <Link
          to="/dashboard"
          className="app-nav-link"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
            <circle cx="12" cy="12" r="2" />
          </svg>
          Accounts
        </Link>
      </nav>

      {/* Right — user badge + logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div className="user-badge">
          <div className="user-avatar">A</div>
          <div className="user-info">
            <span className="user-name">Admin</span>
            <span className="user-role">Executive Staff</span>
          </div>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => navigate('/login')}
          style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
}

/* ── Layout wrapper for authenticated pages ── */
function AppLayout({ children }) {
  return (
    <>
      <AppNavbar />
      <main className="main-content text-gray-800">
        {children}
      </main>
    </>
  );
}

function App() {
  return (
    <AccountProvider>
      <BrowserRouter>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <AppLayout><Dashboard /></AppLayout>
            } />
            <Route path="/accounts/:accountNumber" element={
              <AppLayout><AccountDetail /></AppLayout>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </AccountProvider>
  );
}

export default App;
