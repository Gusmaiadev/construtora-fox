import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  tone?: 'default' | 'danger' | 'success';
  label: string;
}

const toneClass: Record<NonNullable<IconButtonProps['tone']>, string> = {
  default: 'text-midnight-200 hover:text-white hover:bg-white/[0.06]',
  danger: 'text-rose-300 hover:text-white hover:bg-rose-500/20',
  success: 'text-emerald-300 hover:text-white hover:bg-emerald-500/20',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, tone = 'default', className, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        title={label}
        className={cn(
          'inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200',
          'focus-visible:ring-2 focus-visible:ring-fox-500/40 focus-visible:outline-none',
          toneClass[tone],
          className,
        )}
        {...rest}
      >
        {icon}
      </button>
    );
  },
);
IconButton.displayName = 'IconButton';
