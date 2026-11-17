import React from 'react';
import { UserRole, ROLE_LABELS } from '@ems/shared';

interface BadgeProps {
  children?: React.ReactNode;
  role?: UserRole;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ children, role, variant, size = 'md' }) => {
  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  if (role) {
    const roleStyles: Record<UserRole, string> = {
      [UserRole.SUPER_ADMIN]: 'bg-purple-100 text-purple-800 border-purple-200',
      [UserRole.ADMIN]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      [UserRole.TEACHER]: 'bg-blue-100 text-blue-800 border-blue-200',
      [UserRole.STUDENT]: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      [UserRole.PARENT]: 'bg-amber-100 text-amber-800 border-amber-200',
    };

    return (
      <span
        className={`inline-flex items-center font-medium rounded-full border ${sizeStyles} ${roleStyles[role]}`}
      >
        {children || ROLE_LABELS[role]}
      </span>
    );
  }

  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${sizeStyles} ${
        variant ? variantStyles[variant] : variantStyles.neutral
      }`}
    >
      {children}
    </span>
  );
};
