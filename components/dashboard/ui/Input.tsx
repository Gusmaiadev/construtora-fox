import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...rest }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 text-sm text-white',
        'placeholder:text-midnight-300 outline-none transition-all',
        'focus:border-fox-500/60 focus:bg-white/[0.04] focus:ring-2 focus:ring-fox-500/20',
        className,
      )}
      {...rest}
    />
  ),
);
Input.displayName = 'Input';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...rest }, ref) => (
    <select
      ref={ref}
      className={cn(
        'h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 text-sm text-white',
        'outline-none transition-all',
        'focus:border-fox-500/60 focus:bg-white/[0.04] focus:ring-2 focus:ring-fox-500/20',
        className,
      )}
      {...rest}
    >
      {children}
    </select>
  ),
);
Select.displayName = 'Select';

interface FieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

export function Field({ label, hint, children }: FieldProps) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-midnight-200 mb-1.5 uppercase tracking-wide">
        {label}
      </span>
      {children}
      {hint && <span className="block text-[11px] text-midnight-300 mt-1">{hint}</span>}
    </label>
  );
}
