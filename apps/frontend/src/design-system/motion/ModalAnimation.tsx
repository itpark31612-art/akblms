import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { modalVariants } from './motionPresets';

interface ModalAnimationProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  backdropClassName?: string;
}

export const ModalAnimation: React.FC<ModalAnimationProps> = ({
  isOpen,
  onClose,
  children,
  className = '',
  backdropClassName = '',
}) => {
  const shouldReduceMotion = useReducedMotion();

  const activeModalVariants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.15 } },
        exit: { opacity: 0, transition: { duration: 0.1 } },
      }
    : modalVariants;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className={`fixed inset-0 bg-slate-950/60 dark:bg-black/75 backdrop-blur-xs cursor-pointer ${backdropClassName}`}
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            variants={activeModalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`relative z-10 w-full ${className}`}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
