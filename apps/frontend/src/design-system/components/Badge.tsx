import React from 'react';
import { UserRole, ROLE_LABELS } from '@ems/shared';

export interface BadgeProps {
  children?: React.ReactNode;
  role?: UserRole;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  role,
  variant,
  size = 'md',
  dot = false,
  className = '',
}) => {
  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  if (role) {
    const roleStyles: Record<UserRole, { badge: string; dot: string }> = {
      [UserRole.SUPER_ADMIN]: {
        badge:
          'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
        dot: 'bg-purple-500',
      },
      [UserRole.ADMIN]: {
        badge:
          'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60',
        dot: 'bg-indigo-500',
      },
      [UserRole.TEACHER]: {
        badge:
          'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60',
        dot: 'bg-blue-500',
      },
      [UserRole.STUDENT]: {
        badge:
          'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
        dot: 'bg-emerald-500',
      },
      [UserRole.PARENT]: {
        badge:
          'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
        dot: 'bg-amber-500',
      },
    };

    const config = roleStyles[role];

    return (
      <span
        className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${sizeStyles} ${config.badge} ${className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        <span>{children || ROLE_LABELS[role]}</span>
      </span>
    );
  }

  const variantStyles = {
    success: {
      badge:
        'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
      dot: 'bg-emerald-500',
    },
    warning: {
      badge:
        'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
      dot: 'bg-amber-500',
    },
    danger: {
      badge:
        'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60',
      dot: 'bg-rose-500',
    },
    info: {
      badge:
        'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/60',
      dot: 'bg-sky-500',
    },
    purple: {
      badge:
        'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
      dot: 'bg-purple-500',
    },
    neutral: {
      badge:
        'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      dot: 'bg-slate-400',
    },
  };

  const currentVariant = variant ? variantStyles[variant] : variantStyles.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${sizeStyles} ${currentVariant.badge} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${currentVariant.dot}`} />}
      <span>{children}</span>
    </span>
  );
};
