const TransactionList = ({ transactions, currentAccountNumber }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        No transactions found for this account yet.
      </div>
    );
  }

  return (
    <div className="glass-card">
      <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Transaction History</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {transactions.map(tx => {
          // Determine if money came in or went out relative to the current account
          let isCredit = false;
          if (tx.type === 'DEPOSIT') isCredit = true;
          if (tx.type === 'TRANSFER' && tx.toAccountNumber === currentAccountNumber) isCredit = true;
          
          const color = isCredit ? 'var(--success)' : 'var(--danger)';
          const sign = isCredit ? '+' : '-';
          
          return (
            <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <div style={{ fontWeight: '500' }}>{tx.type}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {new Date(tx.timestamp).toLocaleString()}
                </div>
                {tx.type === 'TRANSFER' && (
                  <div style={{ fontSize: '0.85rem', marginTop: '0.2rem', color: 'var(--text-muted)' }}>
                    {isCredit ? `From: ${tx.fromAccountNumber}` : `To: ${tx.toAccountNumber}`}
                  </div>
                )}
              </div>
              <div style={{ fontWeight: '600', color }}>
                {sign} ${tx.amount.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionList;
