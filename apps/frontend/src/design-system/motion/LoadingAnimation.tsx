import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ShimmerProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Shimmer: React.FC<ShimmerProps> = ({
  className = '',
  width = '100%',
  height = '1rem',
  rounded = 'md',
}) => {
  const roundedMap = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  return (
    <div
      style={{ width, height }}
      className={`animate-shimmer bg-slate-200/80 dark:bg-slate-800 ${roundedMap[rounded]} ${className}`}
    />
  );
};

interface ProgressBarProps {
  progress: number; // 0 dan 100 gacha
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple';
  height?: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'indigo',
  height = 8,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const clamped = Math.min(100, Math.max(0, progress));

  const colorStyles = {
    indigo: 'bg-indigo-600 dark:bg-indigo-500',
    emerald: 'bg-emerald-600 dark:bg-emerald-500',
    amber: 'bg-amber-500 dark:bg-amber-400',
    rose: 'bg-rose-600 dark:bg-rose-500',
    purple: 'bg-purple-600 dark:bg-purple-500',
  };

  return (
    <div
      style={{ height }}
      className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ${className}`}
    >
      <motion.div
        initial={shouldReduceMotion ? false : { width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`h-full rounded-full ${colorStyles[color]}`}
      />
    </div>
  );
};
