import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'ghost' | 'danger' | 'subtle';
type Size = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClass: Record<Variant, string> = {
  primary:
    'text-white bg-gradient-to-br from-fox-500 to-fox-600 shadow-[0_4px_14px_-4px_rgba(249,115,22,0.5)] hover:shadow-[0_6px_24px_-4px_rgba(249,115,22,0.7)] hover:-translate-y-px',
  ghost: 'text-midnight-100 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:text-white hover:border-white/10',
  subtle: 'text-midnight-100 hover:text-white hover:bg-white/[0.05]',
  danger:
    'text-white bg-gradient-to-br from-rose-500 to-rose-700 hover:from-rose-400 hover:to-rose-600 shadow-[0_4px_14px_-4px_rgba(244,63,94,0.5)]',
};

const sizeClass: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs rounded-lg',
  md: 'h-10 px-4 text-sm rounded-xl',
  lg: 'h-12 px-5 text-base rounded-xl',
  icon: 'h-9 w-9 rounded-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, variant = 'primary', size = 'md', leftIcon, rightIcon, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fox-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-midnight-950',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',
          'whitespace-nowrap',
          variantClass[variant],
          sizeClass[size],
          className,
        )}
        {...rest}
      >
        {leftIcon}
        {children}
        {rightIcon}
      </button>
    );
  },
);
Button.displayName = 'Button';
