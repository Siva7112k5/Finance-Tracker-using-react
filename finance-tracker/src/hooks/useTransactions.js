import { useState, useCallback } from 'react';
import { calculateTotals } from '../utils/calculations';

function useTransactions(initialTransactions = []) {
  const [transactions, setTransactions] = useState(initialTransactions);

  const addTransaction = useCallback((transaction) => {
    setTransactions(prev => [...prev, { ...transaction, id: Date.now() }]);
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateTransaction = useCallback((id, updates) => {
    setTransactions(prev => prev.map(t => 
      t.id === id ? { ...t, ...updates } : t
    ));
  }, []);

  const totals = calculateTotals(transactions);

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    ...totals
  };
}

export default useTransactions;