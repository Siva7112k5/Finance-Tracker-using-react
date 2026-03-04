import React, { useState } from 'react';
import { TRANSACTION_TYPE_ICONS, TRANSACTION_TYPE_COLORS } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import './TransactionItem.css';

const TransactionItem = ({ transaction, onDelete, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const { id, text, amount, type, category, date, notes } = transaction;
  const isIncome = type === 'income';
  const icon = TRANSACTION_TYPE_ICONS[type] || '📝';
  const color = TRANSACTION_TYPE_COLORS[type];

  const handleDelete = () => {
    if (showConfirmDelete) {
      onDelete(id);
    } else {
      setShowConfirmDelete(true);
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowConfirmDelete(false), 3000);
    }
  };

  const handleEdit = () => {
    onEdit(transaction);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <li className={`transaction-item ${type} ${isExpanded ? 'expanded' : ''}`}>
      <div className="transaction-main" onClick={toggleExpand}>
        <div className="transaction-icon" style={{ backgroundColor: `${color}20` }}>
          <span>{icon}</span>
        </div>

        <div className="transaction-info">
          <h4 className="transaction-title">{text}</h4>
          {category && (
            <span className="transaction-category">
              {category}
            </span>
          )}
        </div>

        <div className="transaction-amount-container">
          <span className={`transaction-amount ${type}`}>
            {isIncome ? '+' : '-'}{formatCurrency(amount)}
          </span>
          <span className="transaction-date">{formatDate(date)}</span>
        </div>

        <div className="transaction-actions">
          <button 
            onClick={(e) => { e.stopPropagation(); handleEdit(); }}
            className="action-btn edit"
            aria-label="Edit transaction"
          >
            ✎
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            className={`action-btn delete ${showConfirmDelete ? 'confirm' : ''}`}
            aria-label={showConfirmDelete ? 'Click again to confirm' : 'Delete transaction'}
          >
            {showConfirmDelete ? '✓' : '×'}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="transaction-details">
          {notes && (
            <div className="detail-row">
              <span className="detail-label">Notes:</span>
              <span className="detail-value">{notes}</span>
            </div>
          )}
          <div className="detail-row">
            <span className="detail-label">Transaction ID:</span>
            <span className="detail-value">{id}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Full Date:</span>
            <span className="detail-value">
              {new Date(date).toLocaleString()}
            </span>
          </div>
          {category && (
            <div className="detail-row">
              <span className="detail-label">Category:</span>
              <span className="detail-value category-tag">{category}</span>
            </div>
          )}
        </div>
      )}
    </li>
  );
};

export default TransactionItem;