'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/cn';

interface KpiCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    label: string;
  };
  accent?: 'fox' | 'cyan' | 'purple' | 'emerald' | 'rose' | 'amber';
  delay?: number;
}

const accentMap: Record<NonNullable<KpiCardProps['accent']>, { ring: string; glow: string; chip: string; icon: string }> = {
  fox: {
    ring: 'from-fox-500/40 to-fox-700/10',
    glow: 'shadow-glow-fox',
    chip: 'bg-fox-500/15 text-fox-300 border-fox-500/30',
    icon: 'text-fox-400',
  },
  cyan: {
    ring: 'from-cyan-400/40 to-cyan-700/10',
    glow: 'shadow-glow-cyan',
    chip: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    icon: 'text-cyan-300',
  },
  purple: {
    ring: 'from-purple-500/40 to-purple-800/10',
    glow: 'shadow-glow-purple',
    chip: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    icon: 'text-purple-300',
  },
  emerald: {
    ring: 'from-emerald-500/40 to-emerald-800/10',
    glow: 'shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)]',
    chip: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    icon: 'text-emerald-300',
  },
  rose: {
    ring: 'from-rose-500/40 to-rose-800/10',
    glow: 'shadow-[0_0_30px_-5px_rgba(244,63,94,0.5)]',
    chip: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    icon: 'text-rose-300',
  },
  amber: {
    ring: 'from-amber-500/40 to-amber-800/10',
    glow: 'shadow-[0_0_30px_-5px_rgba(245,158,11,0.5)]',
    chip: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    icon: 'text-amber-300',
  },
};

export function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  trend,
  accent = 'fox',
  delay = 0,
}: KpiCardProps) {
  const a = accentMap[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'glass rounded-2xl p-5 relative overflow-hidden group',
        'transition-shadow duration-500',
      )}
    >
      <div
        aria-hidden
        className={cn(
          'absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none',
          'bg-gradient-to-br',
          a.ring,
          'rounded-2xl blur-xl',
        )}
      />

      <div className="relative flex items-start justify-between mb-4">
        <span className="text-xs font-medium uppercase tracking-wider text-midnight-200">
          {label}
        </span>
        <div
          className={cn(
            'h-10 w-10 rounded-xl flex items-center justify-center ring-1 ring-white/10 bg-white/[0.03] transition-all',
            'group-hover:scale-110',
          )}
        >
          <Icon className={cn('h-5 w-5', a.icon)} strokeWidth={1.5} />
        </div>
      </div>

      <div className="relative">
        <div className="text-3xl font-display font-semibold tracking-tight text-white">
          {value}
        </div>
        {(hint || trend) && (
          <div className="mt-2 flex items-center gap-2 text-xs text-midnight-200">
            {trend && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-0.5 rounded-full border',
                  a.chip,
                )}
              >
                {trend.direction === 'up' ? (
                  <ArrowUp className="h-3 w-3" />
                ) : trend.direction === 'down' ? (
                  <ArrowDown className="h-3 w-3" />
                ) : null}
                {trend.label}
              </span>
            )}
            {hint && <span>{hint}</span>}
          </div>
        )}
      </div>
    </motion.div>
  );
}
