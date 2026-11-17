import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { pageTransitionVariants } from './motionPresets';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  // Agar foydalanuvchi reduced motion tanlagan bo'lsa, harakatsiz faqat silliq fade
  const accessibleVariants = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.15 } },
        exit: { opacity: 0, transition: { duration: 0.1 } },
      }
    : pageTransitionVariants;

  return (
    <motion.div
      variants={accessibleVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
};
