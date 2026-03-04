export const calculateTotals = (transactions) => {
  const totals = transactions.reduce((acc, transaction) => {
    if (transaction.type === 'income') {
      acc.totalIncome += transaction.amount;
      acc.balance += transaction.amount;
    } else {
      acc.totalExpenses += transaction.amount;
      acc.balance -= transaction.amount;
    }
    return acc;
  }, { totalIncome: 0, totalExpenses: 0, balance: 0 });

  return totals;
};

export const filterTransactionsByType = (transactions, type) => {
  return transactions.filter(t => t.type === type);
};

export const getTopTransactions = (transactions, limit = 5) => {
  return [...transactions]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
};