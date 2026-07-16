'use client';

import { Coins, TrendingUp, Wallet } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/layout/PageHeader';
import { DataGrid } from '@/components/dashboard/datagrid/DataGrid';
import { Card, CardBody, CardHeader } from '@/components/dashboard/ui/Card';
import { useProject } from '@/lib/store/ProjectContext';
import { totalProfit } from '@/lib/store/selectors';
import { Badge } from '@/components/dashboard/ui/Badge';
import { formatCurrency } from '@/lib/format';

export function ProfitPage() {
  const { state } = useProject();
  const total = totalProfit(state);
  const count = state.profit.rows.length;
  const average = count > 0 ? total / count : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Coins}
        title="Lucro"
        subtitle="Lançamentos de lucro e receitas do projeto, com edição inline e colunas dinâmicas."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader
            title="Lucro total"
            subtitle="Soma dos lançamentos"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <CardBody className="pt-2">
            <div
              className={
                total >= 0
                  ? 'font-display text-3xl font-semibold text-emerald-300 tabular-nums'
                  : 'font-display text-3xl font-semibold text-rose-300 tabular-nums'
              }
            >
              {formatCurrency(total)}
            </div>
            <Badge tone={total >= 0 ? 'emerald' : 'rose'} className="mt-2">
              {total >= 0 ? 'positivo' : 'negativo'}
            </Badge>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Lançamentos"
            subtitle="Registros na tabela de lucro"
            icon={<Coins className="h-4 w-4" />}
          />
          <CardBody className="pt-2">
            <div className="font-display text-3xl font-semibold text-white tabular-nums">
              {count}
            </div>
            <Badge tone="fox" className="mt-2">
              {count === 1 ? '1 registro' : `${count} registros`}
            </Badge>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Média por lançamento"
            subtitle="Valor médio registrado"
            icon={<Wallet className="h-4 w-4" />}
          />
          <CardBody className="pt-2">
            <div className="font-display text-3xl font-semibold text-white tabular-nums">
              {formatCurrency(average)}
            </div>
            <Badge tone="cyan" className="mt-2">
              média
            </Badge>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Tabela de Lucro" subtitle="Lançamentos de lucro e receitas" />
        <CardBody className="pt-4 px-0">
          <DataGrid sheet="profit" />
        </CardBody>
      </Card>
    </div>
  );
}
