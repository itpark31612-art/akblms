import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ButtonAnimationProps {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  hoverScale?: number;
  tapScale?: number;
}

export const ButtonAnimation: React.FC<ButtonAnimationProps> = ({
  children,
  disabled = false,
  className = '',
  onClick,
  hoverScale = 1.015,
  tapScale = 0.975,
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      onClick={disabled ? undefined : onClick}
      whileHover={!disabled && !shouldReduceMotion ? { scale: hoverScale } : undefined}
      whileTap={!disabled && !shouldReduceMotion ? { scale: tapScale } : undefined}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
};
