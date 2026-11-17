import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Skeleton: React.FC<SkeletonProps> & {
  Text: React.FC<{ lines?: number; className?: string }>;
  Avatar: React.FC<{ size?: number; className?: string }>;
  Card: React.FC<{ className?: string }>;
} = ({ className = '', width, height, circle = false, rounded = 'md' }) => {
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
      className={`animate-shimmer bg-slate-200/80 dark:bg-slate-800 ${
        circle ? 'rounded-full' : roundedMap[rounded]
      } ${className}`}
    />
  );
};

Skeleton.Text = function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height="0.85rem" width={i === lines - 1 ? '70%' : '100%'} rounded="md" />
      ))}
    </div>
  );
};

Skeleton.Avatar = function SkeletonAvatar({ size = 40, className = '' }) {
  return <Skeleton width={size} height={size} circle className={`shrink-0 ${className}`} />;
};

Skeleton.Card = function SkeletonCard({ className = '' }) {
  return (
    <div
      className={`p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        <Skeleton width="40%" height="1.25rem" />
        <Skeleton.Avatar size={36} />
      </div>
      <Skeleton.Text lines={2} />
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between">
        <Skeleton width="30%" height="0.75rem" />
        <Skeleton width="20%" height="0.75rem" />
      </div>
    </div>
  );
};
