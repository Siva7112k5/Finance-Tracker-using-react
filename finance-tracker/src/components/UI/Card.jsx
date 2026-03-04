import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  variant = 'default',
  padding = 'normal',
  elevation = 'low',
  interactive = false,
  onClick,
  className = '',
  ...props 
}) => {
  const cardClasses = [
    'ui-card',
    `ui-card-${variant}`,
    `ui-card-padding-${padding}`,
    `ui-card-elevation-${elevation}`,
    interactive ? 'ui-card-interactive' : '',
    onClick ? 'ui-card-clickable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={cardClasses} 
      onClick={onClick}
      role={onClick ? 'button' : 'article'}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;