import React from 'react';
import './Analytics.css';

const Analytics = ({ transactions = [], totals = {} }) => {
  return (
    <div className="analytics-container">
      <h2>Analytics Dashboard</h2>
      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Summary</h3>
          <p>Total Transactions: {transactions.length}</p>
          <p>Balance: </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
