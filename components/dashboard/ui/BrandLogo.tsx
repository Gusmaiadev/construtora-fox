import Image from 'next/image';
import { cn } from '@/lib/cn';

/** Logo da Construtora Fox (mesma do site). Substitui o antigo "F". */
export function BrandLogo({ size = 44, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/site/images/logo-fox.png"
      alt="Construtora Fox"
      width={size}
      height={size}
      className={cn('rounded-full object-cover shadow-glow-fox', className)}
      style={{ width: size, height: size }}
    />
  );
}
