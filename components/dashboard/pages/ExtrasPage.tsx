'use client';

import { Sparkles, Layers, Coins } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/layout/PageHeader';
import { DataGrid } from '@/components/dashboard/datagrid/DataGrid';
import { Card, CardBody, CardHeader } from '@/components/dashboard/ui/Card';
import { useProject } from '@/lib/store/ProjectContext';
import { totalClientExtras } from '@/lib/store/selectors';
import { Badge } from '@/components/dashboard/ui/Badge';
import { formatCurrency } from '@/lib/format';

export function ExtrasPage() {
  const { state } = useProject();
  const total = totalClientExtras(state);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Sparkles}
        title="Extras & Acabamentos"
        subtitle="Itens cobrados como adicionais ao cliente, especificações de cerâmica e acabamentos."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader
            title="Adicionais ao cliente"
            subtitle="Faturado além do contrato"
            icon={<Coins className="h-4 w-4" />}
          />
          <CardBody className="pt-2">
            <div className="font-display text-3xl font-semibold text-white tabular-nums">
              {formatCurrency(total)}
            </div>
            <Badge tone="emerald" className="mt-2">
              {state.clientExtras.rows.length} itens
            </Badge>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Cerâmica especificada"
            subtitle="Acabamentos por ambiente"
            icon={<Layers className="h-4 w-4" />}
          />
          <CardBody className="pt-2">
            <div className="font-display text-3xl font-semibold text-white">
              {state.ceramics.length}{' '}
              <span className="text-base text-midnight-200">ambientes</span>
            </div>
            <Badge tone="cyan" className="mt-2">
              {state.ceramics.reduce((acc, c) => {
                const m = parseFloat(String(c.size).replace(/[^\d,.]/g, '').replace(',', '.'));
                return Number.isNaN(m) ? acc : acc + m;
              }, 0)}{' '}
              m² total
            </Badge>
          </CardBody>
        </Card>
      </div>

      <DataGrid sheet="clientExtras" />

      <Card>
        <CardHeader
          title="Especificações de cerâmica"
          subtitle="Áreas, metragens e tipos definidos para o acabamento"
          icon={<Layers className="h-4 w-4" />}
        />
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wider text-midnight-200">
                  <th className="text-left py-3 px-3 font-medium">Ambiente</th>
                  <th className="text-left py-3 px-3 font-medium">Metragem</th>
                  <th className="text-left py-3 px-3 font-medium">Tipo de Cerâmica</th>
                </tr>
              </thead>
              <tbody>
                {state.ceramics.map((c) => (
                  <tr key={c.id} className="border-b border-white/[0.03] hover:bg-white/[0.015]">
                    <td className="py-3 px-3">
                      <span className="font-medium text-white">{c.area}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono tabular-nums text-fox-300">{c.size}</span>
                    </td>
                    <td className="py-3 px-3">
                      <Badge tone="purple">{c.type}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
