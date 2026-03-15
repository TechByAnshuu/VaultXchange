import AccountList from '../components/AccountList';
import AccountForm from '../components/AccountForm';

const Dashboard = () => {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Dashboard</h2>
        <p style={{ color: 'var(--text-muted)' }}>Manage all bank accounts across the simulation.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        
        {/* Left Column: List of existing accounts */}
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Active Accounts</h3>
          <AccountList />
        </div>
        
        {/* Right Column: Form to create a new one */}
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Management</h3>
          <div style={{ position: 'sticky', top: '100px' }}>
             <AccountForm />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
