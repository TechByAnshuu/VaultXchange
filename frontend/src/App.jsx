import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AccountProvider } from './store/AccountContext';

// Pages
import Dashboard from './pages/Dashboard';
import AccountDetail from './pages/AccountDetail';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <AccountProvider>
      <BrowserRouter>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <>
                <header className="glass-header">
                  <div className="flex items-center space-x-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" fill="#C0392B" />
                      <path d="M12 7V17M7 12H17" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <div className="flex flex-col leading-none">
                      <div className="flex items-baseline">
                        <span className="text-xl font-black italic tracking-tighter" style={{ color: '#1A1A2E' }}>Vault</span>
                        <span className="text-2xl font-black italic tracking-tighter" style={{ color: '#C0392B' }}>X</span>
                      </div>
                      <span className="text-[6px] font-black tracking-[0.3em] ml-0.5" style={{ color: '#6C6C80' }}>EXCHANGE</span>
                    </div>
                  </div>
                </header>
                <main className="main-content text-gray-800">
                  <Dashboard />
                </main>
              </>
            } />
            <Route path="/accounts/:accountNumber" element={
              <>
                <header className="glass-header">
                  <div className="flex items-center space-x-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" fill="#C0392B" />
                      <path d="M12 7V17M7 12H17" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <div className="flex flex-col leading-none">
                      <div className="flex items-baseline">
                        <span className="text-xl font-black italic tracking-tighter" style={{ color: '#1A1A2E' }}>Vault</span>
                        <span className="text-2xl font-black italic tracking-tighter" style={{ color: '#C0392B' }}>X</span>
                      </div>
                      <span className="text-[6px] font-black tracking-[0.3em] ml-0.5" style={{ color: '#6C6C80' }}>EXCHANGE</span>
                    </div>
                  </div>
                </header>
                <main className="main-content text-gray-800">
                  <AccountDetail />
                </main>
              </>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </AccountProvider>
  );
}

export default App;
