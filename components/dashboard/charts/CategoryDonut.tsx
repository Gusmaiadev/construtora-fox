'use client';

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { ChartTooltip } from './ChartTooltip';
import { formatCurrency } from '@/lib/format';
import type { CategoryAggregate } from '@/types/domain';

const COLORS = ['#F97316', '#A855F7', '#22D3EE', '#10B981', '#F43F5E', '#F59E0B'];

interface Props {
  data: CategoryAggregate[];
}

export function CategoryDonut({ data }: Props) {
  const total = data.reduce((acc, d) => acc + d.total, 0);
  return (
    <div className="h-72 relative">
      <ResponsiveContainer>
        <PieChart>
          <Tooltip content={<ChartTooltip />} />
          <Pie
            data={data}
            dataKey="total"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            stroke="rgba(0,0,0,0.4)"
            strokeWidth={2}
            paddingAngle={2}
          >
            {data.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ fontSize: 11 }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -mt-6">
        <span className="text-[11px] uppercase tracking-wider text-midnight-200">Total</span>
        <span className="font-display font-semibold text-white text-xl tabular-nums">
          {formatCurrency(total)}
        </span>
      </div>
    </div>
  );
}
