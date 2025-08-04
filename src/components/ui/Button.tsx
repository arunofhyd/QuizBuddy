import React, { ButtonHTMLAttributes, ReactNode } from 'react';

import { cloneElement } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  loading?: boolean;
  icon?: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  disabled,
  icon,
  className = '',
  ...props
}) => {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-white focus:ring-gray-500 shadow-lg hover:shadow-xl',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-lg hover:shadow-xl',
    ghost: 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 focus:ring-white/50',
    outline: 'bg-transparent hover:bg-white/5 text-white border border-white/30 focus:ring-white/50'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button 
      className={classes} 
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
          {typeof children === 'string' && children.includes('...') ? children : 'Loading...'}
        </>
      ) : (
        <>
          {icon && cloneElement(icon as React.ReactElement, { className: 'mr-2' })}
          {children}
        </>
      )}
    </button>
  );
};