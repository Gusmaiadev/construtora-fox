'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartTooltip } from './ChartTooltip';
import { formatCurrencyCompact } from '@/lib/format';
import type { TopMaterial } from '@/lib/store/selectors';

interface Props {
  data: TopMaterial[];
}

const PALETTE = ['#F97316', '#FB923C', '#FDBA74', '#A855F7', '#22D3EE', '#10B981', '#F59E0B', '#F43F5E'];

export function TopMaterialsChart({ data }: Props) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
        >
          <CartesianGrid stroke="rgba(255,255,255,0.04)" horizontal={false} />
          <XAxis
            type="number"
            stroke="rgba(255,255,255,0.4)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => formatCurrencyCompact(v)}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke="rgba(255,255,255,0.5)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={120}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="total" radius={[0, 6, 6, 0]} barSize={18}>
            {data.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
