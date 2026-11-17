import { Transition, Variants, useReducedMotion } from 'framer-motion';
import { UserRole } from '@ems/shared';
import confetti from 'canvas-confetti';

/**
 * prefers-reduced-motion sozlamasini hisobga oluvchi yordamchi hook
 */
export const useAccessibleAnimation = () => {
  const shouldReduceMotion = useReducedMotion();
  return { shouldReduceMotion };
};

/**
 * Auditoriyaga moslashgan harakat tezligi va xarakteri (Role-specific Motion)
 */
export const getRoleTransition = (role?: UserRole | null): Transition => {
  switch (role) {
    case UserRole.SUPER_ADMIN:
    case UserRole.ADMIN:
      // Jiddiy, o'ta tezkor, professional (Admin)
      return { duration: 0.18, ease: [0.16, 1, 0.3, 1] };

    case UserRole.STUDENT:
      // Rang-barang, elastik, quvnoq spring (O'quvchi)
      return { type: 'spring', stiffness: 380, damping: 22 };

    case UserRole.TEACHER:
      // Sodda, barqaror va samarali (Ustoz)
      return { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] };

    case UserRole.PARENT:
      // Sokin, tushunarli, mayin va vazmin (Ota-ona)
      return { duration: 0.3, ease: 'easeInOut' };

    default:
      return { duration: 0.22, ease: 'easeOut' };
  }
};

/**
 * Page Transition Variants: Fade-in + Slide-up
 */
export const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.18,
      ease: 'easeIn',
    },
  },
};

/**
 * Stagger Container & Item Variants
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.24,
      ease: 'easeOut',
    },
  },
};

/**
 * Modal Scale-up + Fade Animation
 */
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.94,
    y: 8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 350,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: 8,
    transition: {
      duration: 0.15,
      ease: 'easeIn',
    },
  },
};

/**
 * Notification / Toast Animation
 */
export const notificationVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 40,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 28,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    x: 20,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};

/**
 * O'quvchilar yutuqlari va topshiriqlari uchun Confetti Fire
 */
export const fireGamificationConfetti = (origin = { x: 0.5, y: 0.6 }) => {
  confetti({
    particleCount: 60,
    spread: 70,
    origin,
    colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'],
    disableForReducedMotion: true,
  });
};
