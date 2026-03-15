import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAccountDetails } from '../services/accountService';
import TransactionForm from '../components/TransactionForm';
import { ArrowLeft, User, Mail, DollarSign } from 'lucide-react';

const AccountDetail = () => {
  const { accountNumber } = useParams();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Polling or fetching on mount allows us to see latest balance after a transaction
    const fetchDetails = async () => {
      try {
        const data = await getAccountDetails(accountNumber);
        setAccount(data);
        setError(null);
      } catch (err) {
        setError('Could not find account details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
    
    // Simple polling every 2 seconds to keep balance fresh after forms submit
    const interval = setInterval(fetchDetails, 2000);
    return () => clearInterval(interval);
  }, [accountNumber]);

  if (loading) return <div className="glass-card">Loading details...</div>;
  if (error) return <div className="glass-card text-danger">{error}</div>;
  if (!account) return <div>Account not found</div>;

  return (
    <div>
      <Link to="/dashboard" className="btn" style={{ marginBottom: '2rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }}>
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        
        {/* Left Column: Account Details Card */}
        <div>
          <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Decorative background circle */}
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--primary-color)', borderRadius: '50%', filter: 'blur(50px)', opacity: 0.2 }}></div>
            
            <h2 className="text-gradient" style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>Account Summary</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '0.75rem', borderRadius: '0.5rem', color: 'var(--primary-color)' }}>
                  <User size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Holder Name</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{account.holderName}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '0.75rem', borderRadius: '0.5rem', color: 'var(--primary-color)' }}>
                  <Mail size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email Address</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{account.email}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '0.75rem', borderRadius: '0.5rem', color: 'var(--success)' }}>
                  <DollarSign size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Available Balance</div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success)' }}>
                    ${account.balance.toFixed(2)}
                  </div>
                </div>
              </div>
              
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Account Number</div>
                <div style={{ fontSize: '1.1rem', fontFamily: 'monospace', letterSpacing: '2px' }}>{account.accountNumber}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  Status: <span style={{ color: account.status === 'ACTIVE' ? 'var(--success)' : 'var(--warning)', fontWeight: '600' }}>{account.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Transaction Form */}
        <div>
          <TransactionForm account={account} />
        </div>

      </div>
    </div>
  );
};

export default AccountDetail;
