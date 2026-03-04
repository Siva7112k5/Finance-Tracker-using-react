import Header from './components/Header';
import Balance from './components/Balance';
import AddTransaction from './components/AddTransaction'; // 1. Import it
import './App.css';

import React, { useState, useEffect } from 'react'; // Add useEffect here

function App() {
  // 1. Initialize state from LocalStorage or empty array
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. Save transactions to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction) => {
    setTransactions([...transactions, transaction]);
  };
  // Function to delete transaction
const deleteTransaction = (id) => {
  setTransactions(transactions.filter(transaction => transaction.id !== id));
};
// Add this logic before the return statement
const amounts = transactions.map(transaction => transaction.amount);
const income = amounts
  .filter(item => item > 0)
  .reduce((acc, item) => (acc += item), 0)
  .toFixed(2);

const expense = (
  amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
).toFixed(2);

// Update your JSX to show these values
<div className="inc-exp-container">
  <div>
    <h4>Income</h4>
    <p className="money plus">+${income}</p>
  </div>
  <div>
    <h4>Expense</h4>
    <p className="money minus">-${expense}</p>
  </div>
</div>
  return (
    <div className="container">
      <Header />
      <div className="inc-exp-container">
        <Balance transactions={transactions} />
      </div>
      
      <h3>History</h3>
      <ul className="list">
  {transactions.map(item => (
    <li key={item.id} className={item.amount < 0 ? 'minus' : 'plus'}>
      {item.text} 
      <span>{item.amount < 0 ? '-' : '+'}${Math.abs(item.amount)}</span>
      <button 
        onClick={() => deleteTransaction(item.id)} 
        className="delete-btn"
      >
        x
      </button>
    </li>
  ))}
</ul>

      {/* 3. Pass the function as a prop */}
      <AddTransaction addTransaction={addTransaction} />
    </div>
  );
}

export default App;