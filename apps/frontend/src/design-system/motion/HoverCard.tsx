import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface HoverCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverScale?: number;
  hoverY?: number;
}

export const HoverCard: React.FC<HoverCardProps> = ({
  children,
  className = '',
  onClick,
  hoverScale = 1.012,
  hoverY = -4,
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      onClick={onClick}
      whileHover={
        !shouldReduceMotion
          ? {
              y: hoverY,
              scale: hoverScale,
              transition: { duration: 0.2, ease: 'easeOut' },
            }
          : undefined
      }
      whileTap={!shouldReduceMotion && onClick ? { scale: 0.99 } : undefined}
      className={`transition-shadow duration-200 hover:shadow-lg dark:hover:shadow-indigo-500/5 ${className}`}
    >
      {children}
    </motion.div>
  );
};
