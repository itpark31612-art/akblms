import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, hover = false }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm ${
        hover
          ? 'transition-all duration-200 hover:shadow-md hover:border-slate-300 cursor-pointer'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
