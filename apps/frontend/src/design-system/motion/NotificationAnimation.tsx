import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { notificationVariants } from './motionPresets';

interface NotificationAnimationProps {
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

export const NotificationAnimation: React.FC<NotificationAnimationProps> = ({
  children,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();

  const accessibleVariants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.15 } },
        exit: { opacity: 0, transition: { duration: 0.1 } },
      }
    : notificationVariants;

  return (
    <motion.div
      variants={accessibleVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
};
