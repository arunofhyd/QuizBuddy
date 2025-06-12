import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  glass = true 
}) => {
  const baseClasses = 'rounded-2xl p-6 shadow-xl';
  const glassClasses = glass 
    ? 'bg-white/10 backdrop-blur-md border border-white/20' 
    : 'bg-gray-800';

  return (
    <div className={`${baseClasses} ${glassClasses} ${className}`}>
      {children}
    </div>
  );
};