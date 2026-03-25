// src/hooks/useBankDashboard.js
import { useState, useEffect, useMemo } from 'react';
import api from '../services/api';

export const useBankDashboard = () => {
  const [accounts, setAccounts]         = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage]                 = useState(1);
  const PAGE_SIZE = 10;

  const fetchAccounts = async () => {
    const res = await api.get('/accounts');
    setAccounts(res.data || []);
  };

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions');
      setTransactions(res.data || []);
    } catch {
      // /api/transactions may not be implemented — don't fail the whole dashboard
      setTransactions([]);
    }
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchAccounts(), fetchTransactions()]);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // ── Computed stats from real data ──────────
  const computedStats = useMemo(() => {
    if (!accounts.length && !loading) return {
      totalAccounts: 0, totalBalance: 0, activeAccounts: 0, frozenAccounts: 0, todayTxns: 0, flaggedTxns: 0,
    };
    const today = new Date().toDateString();
    return {
      totalAccounts:  accounts.length,
      totalBalance:   accounts.reduce((s, a) => s + (a.balance || 0), 0),
      activeAccounts: accounts.filter(a => a.status === 'ACTIVE').length,
      frozenAccounts: accounts.filter(a => a.status === 'FROZEN').length,
      todayTxns:      transactions.filter(t => {
        const d = new Date(t.timestamp || t.createdAt);
        return !isNaN(d) && d.toDateString() === today;
      }).length,
      flaggedTxns:    transactions.filter(t => (t.amount || 0) >= 1000).length,
    };
  }, [accounts, transactions, loading]);

  // ── Filtered accounts ──────────────────────
  const filteredAccounts = useMemo(() => {
    return accounts.filter(a => {
      const q = search.toLowerCase();
      const matchSearch = !q
        || a.accountNumber?.toLowerCase().includes(q)
        || (a.holderName || a.name || '').toLowerCase().includes(q)
        || (a.email || '').toLowerCase().includes(q);
      const matchStatus = statusFilter === 'ALL' || a.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [accounts, search, statusFilter]);

  const totalPages = Math.ceil(filteredAccounts.length / PAGE_SIZE);
  const paginatedAccounts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredAccounts.slice(start, start + PAGE_SIZE);
  }, [filteredAccounts, page]);

  const toggleAccountStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'FROZEN' : 'ACTIVE';
    try {
      await api.put(`/accounts/${id}/status`, { status: newStatus });
      setAccounts(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    } catch (e) {
      alert(`Could not update account status: ${e?.response?.data?.message || e.message}`);
    }
  };

  return {
    accounts: paginatedAccounts,
    allAccounts: accounts,
    transactions,
    stats: computedStats,
    loading, error,
    search, setSearch,
    statusFilter, setStatusFilter,
    page, setPage, totalPages,
    filteredCount: filteredAccounts.length,
    toggleAccountStatus,
    refetch: load,
  };
};
