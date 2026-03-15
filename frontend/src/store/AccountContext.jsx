import { createContext, useState, useEffect, useContext } from 'react';
import { getAccounts } from '../services/accountService';

const AccountContext = createContext(null);

export const AccountProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reusable function to fetch/refresh accounts from backend
  const refreshAccounts = async () => {
    try {
      setLoading(true);
      const data = await getAccounts();
      setAccounts(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load accounts", err);
      setError("Failed to communicate with the banking server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAccounts();
  }, []);

  return (
    <AccountContext.Provider value={{ accounts, loading, error, refreshAccounts }}>
      {children}
    </AccountContext.Provider>
  );
};

// Custom hook for easier access to our global context
export const useAccounts = () => {
  return useContext(AccountContext);
};
