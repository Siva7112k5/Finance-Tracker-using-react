import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  icon,
  iconPosition = 'left',
  className = '',
  ...props 
}) => {
  const buttonClasses = [
    'ui-button',
    `ui-button-${variant}`,
    `ui-button-${size}`,
    fullWidth ? 'ui-button-fullwidth' : '',
    loading ? 'ui-button-loading' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="ui-button-spinner" />}
      
      {icon && iconPosition === 'left' && !loading && (
        <span className="ui-button-icon left">{icon}</span>
      )}
      
      <span className="ui-button-text">{children}</span>
      
      {icon && iconPosition === 'right' && !loading && (
        <span className="ui-button-icon right">{icon}</span>
      )}
    </button>
  );
};

export default Button;