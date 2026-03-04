import React, { createContext, useContext } from 'react';
import useTransactions from '../hooks/useTransactions';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const transactionsData = useTransactions([]);

  return (
    <TransactionContext.Provider value={transactionsData}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactionContext = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactionContext must be used within TransactionProvider');
  }
  return context;
};