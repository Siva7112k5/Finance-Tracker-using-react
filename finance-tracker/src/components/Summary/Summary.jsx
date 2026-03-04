// src/components/Summary/Summary.jsx
import React, { useState, useMemo } from 'react';
import SummaryCard from './SummaryCard';
import { 
  TRANSACTION_TYPES, 
  FILTER_PRESETS 
} from '../../utils/constants';
import { calculateTotals } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';
import './Summary.css';

const Summary = ({ transactions = [] }) => {
  const [timeframe, setTimeframe] = useState(FILTER_PRESETS.THIS_MONTH);
  const [showDetails, setShowDetails] = useState(false);

  const totals = useMemo(() => calculateTotals(transactions), [transactions]);
  
  const categoryBreakdown = useMemo(() => {
    const breakdown = { income: {}, expense: {} };
    
    transactions.forEach(transaction => {
      const type = transaction.type;
      const category = transaction.category || 'other';
      const amount = transaction.amount;

      if (!breakdown[type][category]) {
        breakdown[type][category] = {
          total: 0,
          count: 0,
          transactions: []
        };
      }

      breakdown[type][category].total += amount;
      breakdown[type][category].count += 1;
      breakdown[type][category].transactions.push(transaction);
    });

    return breakdown;
  }, [transactions]);

  const monthlyTrends = useMemo(() => {
    const trends = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!trends[monthKey]) {
        trends[monthKey] = {
          month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
          income: 0,
          expense: 0,
          balance: 0,
          transactions: []
        };
      }

      trends[monthKey][transaction.type] += transaction.amount;
      trends[monthKey].balance += transaction.type === TRANSACTION_TYPES.INCOME 
        ? transaction.amount 
        : -transaction.amount;
      trends[monthKey].transactions.push(transaction);
    });

    return Object.values(trends).sort((a, b) => 
      new Date(a.month) - new Date(b.month)
    );
  }, [transactions]);

  const stats = useMemo(() => {
    const totalTransactions = transactions.length;
    const avgTransaction = totalTransactions > 0 
      ? (totals.totalIncome + totals.totalExpenses) / totalTransactions 
      : 0;
    
    const largestIncome = Math.max(
      ...transactions
        .filter(t => t.type === TRANSACTION_TYPES.INCOME)
        .map(t => t.amount),
      0
    );
    
    const largestExpense = Math.max(
      ...transactions
        .filter(t => t.type === TRANSACTION_TYPES.EXPENSE)
        .map(t => t.amount),
      0
    );

    return {
      totalTransactions,
      avgTransaction,
      largestIncome,
      largestExpense,
      savingsRate: totals.totalIncome > 0 
        ? ((totals.totalIncome - totals.totalExpenses) / totals.totalIncome) * 100 
        : 0
    };
  }, [transactions, totals]);

  return (
    <div className="summary-container">
      <div className="summary-header">
        <h2>Financial Summary</h2>
        <div className="summary-actions">
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="timeframe-select"
          >
            <option value={FILTER_PRESETS.TODAY}>Today</option>
            <option value={FILTER_PRESETS.THIS_WEEK}>This Week</option>
            <option value={FILTER_PRESETS.THIS_MONTH}>This Month</option>
          </select>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="toggle-details-btn"
          >
            {showDetails ? '▲ Show Less' : '▼ Show More'}
          </button>
        </div>
      </div>

      <div className="metrics-grid">
        <SummaryCard
          title="Total Balance"
          value={totals.balance}
          type="balance"
          icon="💰"
        />
        <SummaryCard
          title="Total Income"
          value={totals.totalIncome}
          type="income"
          icon="📈"
        />
        <SummaryCard
          title="Total Expenses"
          value={totals.totalExpenses}
          type="expense"
          icon="📉"
        />
        <SummaryCard
          title="Savings Rate"
          value={stats.savingsRate}
          type="percentage"
          icon="🏦"
          suffix="%"
        />
      </div>

      {showDetails && (
        <div className="details-section">
          {/* Add your details here */}
        </div>
      )}
    </div>
  );
};

export default Summary;