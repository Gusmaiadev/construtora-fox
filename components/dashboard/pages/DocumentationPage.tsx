'use client';

import { FileText, ListChecks } from 'lucide-react';
import { useMemo } from 'react';
import { PageHeader } from '@/components/dashboard/layout/PageHeader';
import { DataGrid } from '@/components/dashboard/datagrid/DataGrid';
import { Card, CardBody, CardHeader } from '@/components/dashboard/ui/Card';
import { Badge } from '@/components/dashboard/ui/Badge';
import { useProject } from '@/lib/store/ProjectContext';
import { totalDocumentation } from '@/lib/store/selectors';
import { formatCurrency, formatDateLong } from '@/lib/format';

export function DocumentationPage() {
  const { state } = useProject();
  const total = totalDocumentation(state);

  const insights = useMemo(() => {
    const rows = state.documentation.rows;
    const sorted = [...rows].sort((a, b) => {
      const va = typeof a.values.value === 'number' ? a.values.value : 0;
      const vb = typeof b.values.value === 'number' ? b.values.value : 0;
      return vb - va;
    });
    const top = sorted[0];
    const dates = rows
      .map((r) => (typeof r.values.date === 'string' ? r.values.date : null))
      .filter((d): d is string => !!d)
      .map((d) => new Date(d))
      .filter((d) => !Number.isNaN(d.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());

    const first = dates[0];
    const last = dates[dates.length - 1];

    return {
      topName: top?.values.name as string | undefined,
      topValue: top?.values.value as number | undefined,
      first,
      last,
    };
  }, [state.documentation.rows]);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FileText}
        title="Documentação Inicial"
        subtitle="Taxas, atualizações de matrícula, ISS, IPTU, projeto, seguro Caixa, averbação, corretagem."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader
            title="Total investido"
            subtitle="Soma dos lançamentos desta categoria"
            icon={<ListChecks className="h-4 w-4" />}
          />
          <CardBody className="pt-2">
            <div className="font-display text-3xl font-semibold text-white tabular-nums">
              {formatCurrency(total)}
            </div>
            <Badge tone="fox" className="mt-2">
              {state.documentation.rows.length} lançamentos
            </Badge>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Maior despesa" subtitle="Item de maior valor" />
          <CardBody className="pt-2">
            <div className="font-display text-2xl font-semibold text-white">
              {insights.topName || '—'}
            </div>
            <div className="text-fox-300 font-mono mt-1">
              {formatCurrency(insights.topValue ?? 0)}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Janela temporal" subtitle="Período da documentação" />
          <CardBody className="pt-2 space-y-1">
            <div className="text-sm text-midnight-100">
              Início:{' '}
              <span className="text-white font-medium">
                {insights.first ? formatDateLong(insights.first.toISOString()) : '—'}
              </span>
            </div>
            <div className="text-sm text-midnight-100">
              Último:{' '}
              <span className="text-white font-medium">
                {insights.last ? formatDateLong(insights.last.toISOString()) : '—'}
              </span>
            </div>
          </CardBody>
        </Card>
      </div>

      <DataGrid sheet="documentation" />
    </div>
  );
}
