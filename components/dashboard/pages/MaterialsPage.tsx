'use client';

import { useMemo } from 'react';
import { HardHat, ShoppingCart, Layers, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/layout/PageHeader';
import { DataGrid } from '@/components/dashboard/datagrid/DataGrid';
import { Card, CardBody, CardHeader } from '@/components/dashboard/ui/Card';
import { TopMaterialsChart } from '@/components/dashboard/charts/TopMaterialsChart';
import { useProject } from '@/lib/store/ProjectContext';
import { topMaterials, totalMaterials } from '@/lib/store/selectors';
import { Badge } from '@/components/dashboard/ui/Badge';
import { formatCurrency } from '@/lib/format';
import { ProgressBar } from '@/components/dashboard/ui/ProgressBar';

export function MaterialsPage() {
  const { state } = useProject();
  const total = totalMaterials(state);
  const top = useMemo(() => topMaterials(state, 8), [state]);
  const budget =
    state.budgetBreakdown.find((b) => b.category.toLowerCase() === 'material')?.value ?? 0;

  const ceramics = state.ceramics;
  const totalCeramicArea = ceramics.reduce((acc, c) => {
    const m = parseFloat(String(c.size).replace(/[^\d,.]/g, '').replace(',', '.'));
    return Number.isNaN(m) ? acc : acc + m;
  }, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={HardHat}
        title="Materiais da Construção"
        subtitle="Compras consolidadas com filtros, busca, edição inline e novas colunas dinâmicas."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader
            title="Materiais · gasto"
            subtitle={`${state.materials.rows.length} aquisições registradas`}
            icon={<ShoppingCart className="h-4 w-4" />}
          />
          <CardBody className="pt-2">
            <div className="font-display text-3xl font-semibold text-white tabular-nums">
              {formatCurrency(total)}
            </div>
            <div className="mt-3">
              <ProgressBar
                value={total}
                max={Math.max(budget, total)}
                variant={total > budget ? 'rose' : 'fox'}
              />
              <div className="flex justify-between text-[11px] text-midnight-200 mt-1.5">
                <span>Realizado</span>
                <span>Orçado: {formatCurrency(budget)}</span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Item líder"
            subtitle="Material com maior valor consolidado"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <CardBody className="pt-2">
            {top[0] ? (
              <>
                <div className="font-display text-2xl font-semibold text-white">{top[0].name}</div>
                <div className="font-mono text-fox-300 mt-1">{formatCurrency(top[0].total)}</div>
                <Badge tone="amber" className="mt-3">
                  {top[0].count} compras
                </Badge>
              </>
            ) : (
              <span className="text-midnight-200">Sem dados</span>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Cerâmica · cobertura"
            subtitle={`${ceramics.length} ambientes especificados`}
            icon={<Layers className="h-4 w-4" />}
          />
          <CardBody className="pt-2">
            <div className="font-display text-3xl font-semibold text-white">
              {totalCeramicArea.toLocaleString('pt-BR')}{' '}
              <span className="text-base text-midnight-200">m²</span>
            </div>
            <ul className="mt-3 space-y-1 text-xs">
              {ceramics.slice(0, 3).map((c) => (
                <li key={c.id} className="flex justify-between text-midnight-100">
                  <span>{c.area}</span>
                  <span className="font-mono text-midnight-200">{c.size}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Top materiais"
          subtitle="Top 8 itens por gasto consolidado"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <CardBody>
          <TopMaterialsChart data={top} />
        </CardBody>
      </Card>

      <DataGrid sheet="materials" />

      <Card>
        <CardHeader
          title="Especificações de cerâmica"
          subtitle="Áreas, metragem e tipos definidos"
          icon={<Layers className="h-4 w-4" />}
        />
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {ceramics.map((c) => (
              <div
                key={c.id}
                className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-4 hover:border-fox-500/30 transition-colors"
              >
                <div className="text-xs uppercase tracking-wider text-midnight-200">{c.type}</div>
                <div className="font-display text-base font-semibold text-white mt-1">{c.area}</div>
                <div className="font-mono text-fox-300 text-sm mt-1">{c.size}</div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
