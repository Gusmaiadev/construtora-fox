import { type ReactNode, type HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'strong';
  hover?: boolean;
}

export function Card({
  children,
  variant = 'default',
  hover = false,
  className,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl relative',
        variant === 'default' ? 'glass' : 'glass-strong',
        hover && 'neon-border transition-transform duration-300 hover:-translate-y-0.5',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  actions,
  icon,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 px-5 pt-5">
      <div className="flex items-start gap-3 min-w-0">
        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fox-500/20 to-accent-purple/20 ring-1 ring-white/10 text-fox-300 flex-none">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white tracking-tight truncate">{title}</h3>
          {subtitle && (
            <p className="text-xs text-midnight-200 mt-0.5 line-clamp-2">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex-none">{actions}</div>}
    </div>
  );
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('p-5', className)}>{children}</div>;
}
