'use client';

import type { TooltipProps } from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { formatCurrency } from '@/lib/format';

interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  asCurrency?: boolean;
  unitSuffix?: string;
}

export function ChartTooltip({ active, payload, label, asCurrency = true, unitSuffix }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="glass-strong rounded-xl px-3 py-2.5 text-xs shadow-2xl ring-1 ring-white/10">
      {label && (
        <div className="text-[11px] uppercase tracking-wider text-midnight-200 mb-1.5">
          {label}
        </div>
      )}
      <div className="space-y-1">
        {payload.map((entry, idx) => {
          const v = entry.value as number;
          return (
            <div key={idx} className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color || entry.fill || '#F97316' }}
              />
              <span className="text-midnight-100">{entry.name}</span>
              <span className="ml-auto font-mono tabular-nums text-white">
                {asCurrency ? formatCurrency(v) : v?.toLocaleString('pt-BR')}
                {unitSuffix}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
