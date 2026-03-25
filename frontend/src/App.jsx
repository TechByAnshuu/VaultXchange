import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AccountProvider } from './store/AccountContext';

// New pages
import CustomerHome from './pages/CustomerHome';
import BankDashboard from './pages/BankDashboard';

// Existing pages
import Dashboard from './pages/Dashboard';
import AccountDetail from './pages/AccountDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';

/* ── Protected Route Wrapper ── */
function ProtectedRoute({ children, requiredRole }) {
  const role = localStorage.getItem('vx_role');
  const location = useLocation();

  if (!role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <AccountProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer protected */}
          <Route path="/customer/home" element={
            <ProtectedRoute requiredRole="customer">
              <CustomerHome />
            </ProtectedRoute>
          } />
          <Route path="/customer/accounts/:id" element={
            <ProtectedRoute requiredRole="customer">
              <AccountDetail />
            </ProtectedRoute>
          } />

          {/* Employee protected */}
          <Route path="/bank/dashboard" element={
            <ProtectedRoute requiredRole="employee">
              <BankDashboard />
            </ProtectedRoute>
          } />

          {/* Legacy support */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/accounts/:accountNumber" element={
            <ProtectedRoute>
              <AccountDetail />
            </ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AccountProvider>
  );
}

export default App;
