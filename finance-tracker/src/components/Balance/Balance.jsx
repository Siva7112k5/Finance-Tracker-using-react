import React from 'react';
import Card from '../UI/Card';
import { formatCurrency } from '../../utils/formatters';
import './Balance.css';

const Balance = ({ total }) => {
  const balanceClass = total >= 0 ? 'positive' : 'negative';

  return (
    <Card className="balance-container">
      <h2>Current Balance</h2>
      <p className={`balance-amount ${balanceClass}`}>
        {formatCurrency(total)}
      </p>
    </Card>
  );
};

export default Balance;