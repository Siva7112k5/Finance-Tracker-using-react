import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import './SummaryCard.css';

const SummaryCard = ({ 
  title, 
  value, 
  type = 'balance',
  icon,
  trend,
  suffix = '',
  onClick 
}) => {
  const getValueColor = () => {
    if (type === 'income') return 'income';
    if (type === 'expense') return 'expense';
    if (type === 'percentage') return 'percentage';
    return value >= 0 ? 'positive' : 'negative';
  };

  const formatValue = () => {
    if (type === 'percentage') {
      return `${value.toFixed(1)}${suffix}`;
    }
    return formatCurrency(value);
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend > 0) return '▲';
    if (trend < 0) return '▼';
    return '◆';
  };

  const getTrendClass = () => {
    if (!trend) return '';
    if (type === 'expense') {
      return trend > 0 ? 'negative-trend' : 'positive-trend';
    }
    return trend > 0 ? 'positive-trend' : 'negative-trend';
  };

  return (
    <div 
      className={`summary-card ${type}`} 
      onClick={onClick}
      role={onClick ? 'button' : 'article'}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="card-header">
        <span className="card-icon">{icon}</span>
        <h3 className="card-title">{title}</h3>
      </div>
      
      <div className="card-content">
        <span className={`card-value ${getValueColor()}`}>
          {formatValue()}
        </span>
        
        {trend !== undefined && (
          <div className={`card-trend ${getTrendClass()}`}>
            <span className="trend-icon">{getTrendIcon()}</span>
            <span className="trend-value">
              {formatCurrency(Math.abs(trend))}
            </span>
          </div>
        )}
      </div>

      {/* Mini sparkline (optional) */}
      {type === 'balance' && (
        <div className="card-sparkline">
          <div className="sparkline-bar" style={{ height: '30%' }} />
          <div className="sparkline-bar" style={{ height: '60%' }} />
          <div className="sparkline-bar" style={{ height: '45%' }} />
          <div className="sparkline-bar" style={{ height: '80%' }} />
          <div className="sparkline-bar" style={{ height: '65%' }} />
        </div>
      )}
    </div>
  );
};

export default SummaryCard;