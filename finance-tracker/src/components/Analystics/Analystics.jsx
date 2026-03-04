import React from 'react';
import './Analytics.css';

const Analytics = ({ transactions = [], totals = {} }) => {
  // Calculate some basic analytics
  const totalTransactions = transactions.length;
  const avgTransaction = totalTransactions > 0 
    ? (totals.totalIncome + totals.totalExpenses) / totalTransactions 
    : 0;

  return (
    <div className="analytics-container">
      <h2>Analytics Dashboard</h2>
      
      <div className="analytics-grid">
        {/* Summary Cards */}
        <div className="analytics-card">
          <h3>Transaction Summary</h3>
          <div className="stat-item">
            <span>Total Transactions:</span>
            <strong>{totalTransactions}</strong>
          </div>
          <div className="stat-item">
            <span>Average Amount:</span>
            <strong>${avgTransaction.toFixed(2)}</strong>
          </div>
        </div>

        <div className="analytics-card">
          <h3>Income vs Expenses</h3>
          <div className="stat-item income">
            <span>Total Income:</span>
            <strong>${(totals.totalIncome || 0).toFixed(2)}</strong>
          </div>
          <div className="stat-item expense">
            <span>Total Expenses:</span>
            <strong>${(totals.totalExpenses || 0).toFixed(2)}</strong>
          </div>
          <div className="stat-item">
            <span>Net Balance:</span>
            <strong className={totals.balance >= 0 ? 'positive' : 'negative'}>
              ${(totals.balance || 0).toFixed(2)}
            </strong>
          </div>
        </div>

        <div className="analytics-card">
          <h3>Quick Stats</h3>
          <div className="stat-item">
            <span>Monthly Average:</span>
            <strong>${(totals.balance / 30 || 0).toFixed(2)}/day</strong>
          </div>
          <div className="stat-item">
            <span>Savings Rate:</span>
            <strong>
              {totals.totalIncome > 0 
                ? (((totals.totalIncome - totals.totalExpenses) / totals.totalIncome) * 100).toFixed(1) 
                : 0}%
            </strong>
          </div>
        </div>
      </div>

      {/* Placeholder for charts - you can add actual charts here later */}
      <div className="chart-placeholder">
        <h3>Charts Coming Soon!</h3>
        <p>Future updates will include:
          <br />• Spending trends over time
          <br />• Category breakdown pie charts
          <br />• Income vs expenses bar charts
        </p>
      </div>
    </div>
  );
};

export default Analytics;