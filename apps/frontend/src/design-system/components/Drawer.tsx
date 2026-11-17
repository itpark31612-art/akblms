import React, { useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  position?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  position = 'right',
  size = 'md',
  showCloseButton = true,
}) => {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const sizeStyles = {
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  const slideVariants = {
    closed: {
      x: position === 'right' ? '100%' : '-100%',
      opacity: shouldReduceMotion ? 0 : 1,
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 30,
        stiffness: 350,
      },
    },
    exit: {
      x: position === 'right' ? '100%' : '-100%',
      opacity: shouldReduceMotion ? 0 : 1,
      transition: { duration: 0.2, ease: 'easeIn' },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-950/60 dark:bg-black/75 backdrop-blur-xs cursor-pointer"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <div
            className={`fixed inset-y-0 ${
              position === 'right' ? 'right-0' : 'left-0'
            } flex max-w-full`}
          >
            <motion.div
              variants={slideVariants}
              initial="closed"
              animate="open"
              exit="exit"
              className={`w-screen ${sizeStyles[size]} bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-10 text-left`}
            >
              {(title || showCloseButton) && (
                <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                  <div>
                    {title && (
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {title}
                      </h3>
                    )}
                    {description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {description}
                      </p>
                    )}
                  </div>
                  {showCloseButton && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-6">{children}</div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
