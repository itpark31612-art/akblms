import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();

  const baseStyles =
    'relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 shadow-2xs',
    md: 'px-4 py-2 text-sm gap-2 shadow-xs',
    lg: 'px-6 py-2.5 text-base gap-2.5 shadow-sm',
  };

  const variantStyles = {
    primary:
      'bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 active:bg-indigo-800 focus:ring-indigo-500 shadow-indigo-500/20 hover:shadow-indigo-500/30',
    secondary:
      'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-slate-300 focus:ring-slate-400 dark:focus:ring-slate-600 border border-slate-200/60 dark:border-slate-700/60',
    outline:
      'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100 focus:ring-indigo-500',
    danger:
      'bg-rose-600 dark:bg-rose-500 text-white hover:bg-rose-700 dark:hover:bg-rose-600 active:bg-rose-800 focus:ring-rose-500 shadow-rose-500/20',
    ghost:
      'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 focus:ring-slate-400',
    subtle:
      'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 focus:ring-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50',
  };

  return (
    <motion.button
      whileHover={
        !disabled && !isLoading && !shouldReduceMotion ? { scale: 1.012, y: -1 } : undefined
      }
      whileTap={!disabled && !isLoading && !shouldReduceMotion ? { scale: 0.98 } : undefined}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        icon && <span className="inline-flex shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </motion.button>
  );
};
