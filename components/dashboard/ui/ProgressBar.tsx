'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  variant?: 'fox' | 'emerald' | 'cyan' | 'amber' | 'rose';
  size?: 'sm' | 'md' | 'lg';
}

const colorMap: Record<NonNullable<ProgressBarProps['variant']>, string> = {
  fox: 'from-fox-400 to-fox-600',
  emerald: 'from-emerald-400 to-emerald-600',
  cyan: 'from-cyan-400 to-cyan-600',
  amber: 'from-amber-400 to-amber-600',
  rose: 'from-rose-400 to-rose-600',
};

const heightMap = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3.5' };

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  variant = 'fox',
  size = 'md',
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="w-full">
      <div className={cn('w-full bg-white/[0.04] rounded-full overflow-hidden ring-1 ring-white/[0.04]', heightMap[size])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className={cn('h-full bg-gradient-to-r', colorMap[variant], 'relative')}
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)] bg-[length:200%_100%] animate-shimmer"
          />
        </motion.div>
      </div>
      {showLabel && (
        <div className="flex justify-between text-xs text-midnight-200 mt-1.5">
          <span>{pct.toFixed(1).replace('.', ',')}%</span>
          <span>
            {value.toLocaleString('pt-BR')} / {max.toLocaleString('pt-BR')}
          </span>
        </div>
      )}
    </div>
  );
}
