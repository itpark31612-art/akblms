import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface CounterAnimationProps {
  value: number | string;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const CounterAnimation: React.FC<CounterAnimationProps> = ({
  value,
  duration = 1.2,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Matnli sonlarni (masalan: "2,450", "99.9%") parse qilish
  const numericTarget =
    typeof value === 'number'
      ? value
      : parseFloat(
          String(value)
            .replace(/,/g, '')
            .replace(/[^0-9.-]+/g, '')
        ) || 0;

  const [count, setCount] = useState<number>(shouldReduceMotion ? numericTarget : 0);

  useEffect(() => {
    if (shouldReduceMotion) {
      setCount(numericTarget);
      return;
    }

    let start = 0;
    const end = numericTarget;
    const totalFrames = Math.round(duration * 60);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      // EaseOutQuad progress
      const progress = frame / totalFrames;
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * easeOutProgress;

      setCount(current);

      if (frame >= totalFrames) {
        clearInterval(timer);
        setCount(end);
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [numericTarget, duration, shouldReduceMotion]);

  const formatted = decimals > 0 ? count.toFixed(decimals) : Math.round(count).toLocaleString();

  // Agar asl qiymat matn bo'lsa (masalan "99.99%"), suffixni avtomatik aniqlash
  const finalSuffix = suffix || (typeof value === 'string' && value.endsWith('%') ? '%' : '');

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {finalSuffix}
    </span>
  );
};
