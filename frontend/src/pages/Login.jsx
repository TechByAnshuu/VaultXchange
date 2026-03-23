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
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#3D3535] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#3D3535]/30">
              <svg width={26} height={26} viewBox="0 0 24 24" fill="none">
                <path d="M9 12L11 14L15 10M12 2L3 7V13C3 17.97 7.02 22.63 12 24C16.98 22.63 21 17.97 21 13V7L12 2Z"
                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex flex-col leading-none text-left">
              <div className="flex items-baseline">
                <span className="text-2xl font-black italic tracking-tighter text-[#1A1A2E]">Vault</span>
                <span className="text-3xl font-black italic tracking-tighter text-[#3D3535]">X</span>
              </div>
              <span className="text-[8px] font-black tracking-[0.3em] text-[#6C6C80] mt-0.5">EXCHANGE</span>
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
