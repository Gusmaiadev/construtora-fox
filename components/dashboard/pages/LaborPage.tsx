'use client';

import { Hammer } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/layout/PageHeader';
import { DataGrid } from '@/components/dashboard/datagrid/DataGrid';
import { Card, CardBody, CardHeader } from '@/components/dashboard/ui/Card';
import { useProject } from '@/lib/store/ProjectContext';
import { totalExtraLabor, totalLabor } from '@/lib/store/selectors';
import { Badge } from '@/components/dashboard/ui/Badge';
import { formatCurrency } from '@/lib/format';

export function LaborPage() {
  const { state } = useProject();
  const totalLab = totalLabor(state);
  const totalExtra = totalExtraLabor(state);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Hammer}
        title="Mão de Obra"
        subtitle="Pagamentos por medição da obra principal e contratações avulsas."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader
            title="Mão de obra · principal"
            subtitle="Pagamentos por medição"
            icon={<Hammer className="h-4 w-4" />}
          />
          <CardBody className="pt-2">
            <div className="font-display text-3xl font-semibold text-white tabular-nums">
              {formatCurrency(totalLab)}
            </div>
            <Badge tone="purple" className="mt-2">
              {state.labor.rows.length} pagamentos
            </Badge>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Mão de obra · extra"
            subtitle="Hidráulica, gesso, pintura, elétrica"
            icon={<Hammer className="h-4 w-4" />}
          />
          <CardBody className="pt-2">
            <div className="font-display text-3xl font-semibold text-white tabular-nums">
              {formatCurrency(totalExtra)}
            </div>
            <Badge tone="emerald" className="mt-2">
              {state.extraLabor.rows.length} contratos
            </Badge>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Mão de obra principal" subtitle="Pagamentos do empreiteiro principal" />
        <CardBody className="pt-4 px-0">
          <DataGrid sheet="labor" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Mão de obra extra" subtitle="Subempreitas e adicionais" />
        <CardBody className="pt-4 px-0">
          <DataGrid sheet="extraLabor" />
        </CardBody>
      </Card>
    </div>
  );
}
