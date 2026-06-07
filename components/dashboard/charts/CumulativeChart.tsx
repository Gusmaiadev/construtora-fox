'use client';

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartTooltip } from './ChartTooltip';
import { formatCurrencyCompact } from '@/lib/format';
import type { MonthlySeries } from '@/lib/store/selectors';

interface Props {
  data: MonthlySeries[];
  budget: number;
}

export function CumulativeChart({ data, budget }: Props) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="cumGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F97316" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#F97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="monthLabel" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis
            stroke="rgba(255,255,255,0.4)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => formatCurrencyCompact(v)}
          />
          <Tooltip content={<ChartTooltip />} />
          {budget > 0 && (
            <ReferenceLine
              y={budget}
              stroke="#F43F5E"
              strokeDasharray="4 4"
              label={{ value: 'Orçamento', position: 'right', fill: '#F43F5E', fontSize: 10 }}
            />
          )}
          <Area
            type="monotone"
            dataKey="cumulative"
            name="Acumulado"
            stroke="#F97316"
            strokeWidth={2.5}
            fill="url(#cumGrad)"
          />
          <Line
            type="monotone"
            dataKey="total"
            name="Mensal"
            stroke="#22D3EE"
            strokeWidth={2}
            dot={{ r: 3, fill: '#22D3EE' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
