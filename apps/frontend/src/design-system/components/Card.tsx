import React from 'react';
import { HoverCard } from '../motion/HoverCard';

export interface CardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  hover?: boolean;
  className?: string;
  onClick?: () => void;
  accent?: 'indigo' | 'emerald' | 'amber' | 'purple' | 'none';
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  action,
  footer,
  hover = false,
  className = '',
  onClick,
  accent = 'none',
}) => {
  const accentBorderStyles = {
    none: '',
    indigo: 'border-t-4 border-t-indigo-600 dark:border-t-indigo-500',
    emerald: 'border-t-4 border-t-emerald-600 dark:border-t-emerald-500',
    amber: 'border-t-4 border-t-amber-500 dark:border-t-amber-400',
    purple: 'border-t-4 border-t-purple-600 dark:border-t-purple-500',
  };

  const cardContent = (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-2xs transition-colors text-left ${accentBorderStyles[accent]} ${className}`}
    >
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            {title && (
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0 ml-4">{action}</div>}
        </div>
      )}

      <div>{children}</div>

      {footer && (
        <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
          {footer}
        </div>
      )}
    </div>
  );

  if (hover) {
    return <HoverCard onClick={onClick}>{cardContent}</HoverCard>;
  }

  return cardContent;
};
