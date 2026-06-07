'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
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
}

export function ExpenseAreaChart({ data }: Props) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="g-mat" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F97316" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#F97316" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="g-lab" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A855F7" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#A855F7" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="g-doc" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#22D3EE" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="g-ext" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="monthLabel"
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
            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeDasharray: 4 }}
          />
          <Legend wrapperStyle={{ paddingTop: 8, fontSize: 11 }} iconType="circle" />

          <Area type="monotone" dataKey="materials" name="Materiais" stroke="#F97316" strokeWidth={2} fill="url(#g-mat)" />
          <Area type="monotone" dataKey="labor" name="Mão de obra" stroke="#A855F7" strokeWidth={2} fill="url(#g-lab)" />
          <Area type="monotone" dataKey="documentation" name="Documentação" stroke="#22D3EE" strokeWidth={2} fill="url(#g-doc)" />
          <Area type="monotone" dataKey="extraLabor" name="M.O. Extra" stroke="#10B981" strokeWidth={2} fill="url(#g-ext)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
