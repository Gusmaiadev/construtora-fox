'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartTooltip } from './ChartTooltip';
import { formatCurrencyCompact } from '@/lib/format';
import type { CategoryAggregate } from '@/types/domain';

interface Props {
  data: CategoryAggregate[];
}

export function BudgetVsActualChart({ data }: Props) {
  const filtered = data.filter((d) => d.budget !== undefined);
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <BarChart data={filtered} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="rgba(255,255,255,0.4)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="rgba(255,255,255,0.4)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => formatCurrencyCompact(v)}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
          <Bar dataKey="budget" name="Orçado" fill="#A855F7" radius={[6, 6, 0, 0]} barSize={26} />
          <Bar dataKey="total" name="Realizado" fill="#F97316" radius={[6, 6, 0, 0]} barSize={26} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
