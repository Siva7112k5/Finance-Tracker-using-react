import React, { useState } from 'react';
import './Input.css';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  success,
  disabled = false,
  required = false,
  icon,
  iconPosition = 'left',
  helperText,
  maxLength,
  min,
  max,
  step,
  pattern,
  name,
  id,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const handleBlur = () => {
    setTouched(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputClasses = [
    'ui-input-field',
    error ? 'ui-input-error' : '',
    success && !error ? 'ui-input-success' : '',
    icon ? `ui-input-with-icon icon-${iconPosition}` : '',
    disabled ? 'ui-input-disabled' : '',
    touched && error ? 'ui-input-touched' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="ui-input-wrapper">
      {label && (
        <label htmlFor={id} className="ui-input-label">
          {label}
          {required && <span className="ui-input-required">*</span>}
        </label>
      )}

      <div className="ui-input-container">
        {icon && iconPosition === 'left' && (
          <span className="ui-input-icon left">{icon}</span>
        )}

        <input
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          min={min}
          max={max}
          step={step}
          pattern={pattern}
          name={name}
          id={id}
          className={inputClasses}
          {...props}
        />

        {icon && iconPosition === 'right' && !type === 'password' && (
          <span className="ui-input-icon right">{icon}</span>
        )}

        {type === 'password' && (
          <button
            type="button"
            className="ui-input-password-toggle"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        )}
      </div>

      {helperText && !error && (
        <span className="ui-input-helper">{helperText}</span>
      )}

      {error && touched && (
        <span className="ui-input-error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </span>
      )}

      {maxLength && (
        <span className="ui-input-char-count">
          {value?.length || 0}/{maxLength}
        </span>
      )}
    </div>
  );
};

export default Input;