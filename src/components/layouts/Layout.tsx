import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  background?: 'default' | 'game' | 'host';
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  background = 'default' 
}) => {
  const backgroundClasses = {
    default: 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900',
    game: 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900', // Updated game background
    host: 'bg-gray-900' // Added host background
  };

  return (
    <div className={`min-h-screen ${backgroundClasses[background]}`}>
      <div className="relative min-h-screen">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {background === 'host' ? (
            <>
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-100/5 rounded-full blur-3xl" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-200/5 rounded-full blur-3xl" />
            </>
          ) : (
            <>
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
            </>
          )}
        </div>
        
        {/* Main content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};