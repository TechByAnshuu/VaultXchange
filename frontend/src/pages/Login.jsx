import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password');

  // Simple hardcoded login for simulation purposes
  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'password') {
      navigate('/dashboard');
    } else {
      alert("Invalid credentials. Try 'admin' / 'password'");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="flex items-center space-x-1 mb-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" fill="#C0392B" />
              <path d="M12 7V17M7 12H17" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div className="flex flex-col leading-none text-left">
              <div className="flex items-baseline">
                <span className="text-2xl font-black italic tracking-tighter" style={{ color: '#1A1A2E' }}>Vault</span>
                <span className="text-3xl font-black italic tracking-tighter" style={{ color: '#C0392B' }}>X</span>
              </div>
              <span className="text-[8px] font-black tracking-[0.3em] ml-0.5" style={{ color: '#6C6C80' }}>EXCHANGE</span>
            </div>
          </div>
          <h2 className="text-navy font-bold" style={{ fontSize: '1.5rem', margin: 0 }}>Portal Access</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Executive Staff Login</p>
        </div>

        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              className="form-control" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.875rem' }}>
            Access Portal
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
