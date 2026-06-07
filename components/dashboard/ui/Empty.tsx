import { type LucideIcon } from 'lucide-react';
import { type ReactNode } from 'react';

interface EmptyProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function Empty({ icon: Icon, title, description, action }: EmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-fox-500/20 to-purple-500/10 ring-1 ring-white/10 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-fox-300" strokeWidth={1.5} />
      </div>
      <h4 className="text-sm font-semibold text-white">{title}</h4>
      {description && (
        <p className="text-xs text-midnight-200 mt-1 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
