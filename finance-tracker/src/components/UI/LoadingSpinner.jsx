import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium',
  color = 'primary',
  fullScreen = false,
  text = 'Loading...',
  className = '',
  ...props 
}) => {
  const spinnerClasses = [
    'ui-spinner',
    `ui-spinner-${size}`,
    `ui-spinner-${color}`,
    fullScreen ? 'ui-spinner-fullscreen' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={spinnerClasses} {...props}>
      <div className="ui-spinner-animation">
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
      </div>
      {text && <span className="ui-spinner-text">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;