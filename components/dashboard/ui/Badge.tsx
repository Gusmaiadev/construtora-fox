import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'fox' | 'cyan' | 'purple' | 'emerald' | 'rose' | 'amber' | 'neutral';

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

const toneMap: Record<Tone, string> = {
  fox: 'bg-fox-500/15 text-fox-300 border-fox-500/30',
  cyan: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  purple: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  rose: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  neutral: 'bg-white/[0.06] text-midnight-100 border-white/10',
};

export function Badge({ children, tone = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide',
        toneMap[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
