'use client';

import { Hammer, Calculator, Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/layout/PageHeader';
import { DataGrid } from '@/components/dashboard/datagrid/DataGrid';
import { Card, CardBody, CardHeader } from '@/components/dashboard/ui/Card';
import { useProject } from '@/lib/store/ProjectContext';
import { totalExtraLabor, totalLabor, totalMeasurements } from '@/lib/store/selectors';
import { Badge } from '@/components/dashboard/ui/Badge';
import { formatCurrency } from '@/lib/format';
import { Button } from '@/components/dashboard/ui/Button';
import { IconButton } from '@/components/dashboard/ui/IconButton';
import { uid } from '@/lib/id';
import type { Measurement } from '@/types/domain';
import { Input } from '@/components/dashboard/ui/Input';

export function LaborPage() {
  const { state, dispatch } = useProject();
  const totalLab = totalLabor(state);
  const totalExtra = totalExtraLabor(state);
  const measurementsTotal = totalMeasurements(state);

  const updateMeasurement = (m: Measurement, patch: Partial<Measurement>) => {
    dispatch({ type: 'MEASUREMENT_UPDATE', measurement: { ...m, ...patch } });
  };

  const addMeasurement = () => {
    const next = state.measurements.length + 1;
    const m: Measurement = { id: uid(), order: next, type: 'Medição', value: 0 };
    dispatch({ type: 'MEASUREMENT_ADD', measurement: m });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Hammer}
        title="Mão de Obra"
        subtitle="Pagamentos por medição da obra principal e contratações avulsas."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        <Card>
          <CardHeader
            title="Medições liberadas"
            subtitle="Repasses recebidos no projeto"
            icon={<Calculator className="h-4 w-4" />}
          />
          <CardBody className="pt-2">
            <div className="font-display text-3xl font-semibold text-white tabular-nums">
              {formatCurrency(measurementsTotal)}
            </div>
            <Badge tone="cyan" className="mt-2">
              {state.measurements.length} de 6 etapas
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

      <Card>
        <CardHeader
          title="Medições da obra"
          subtitle="Liberações financeiras por etapa do contrato"
          icon={<Calculator className="h-4 w-4" />}
          actions={
            <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={addMeasurement}>
              Nova medição
            </Button>
          }
        />
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {state.measurements.map((m) => (
              <div
                key={m.id}
                className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-4 hover:border-fox-500/30 transition-colors group"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge tone="fox">#{m.order}</Badge>
                  <IconButton
                    icon={<Trash2 className="h-3.5 w-3.5" />}
                    label="Remover"
                    tone="danger"
                    className="opacity-0 group-hover:opacity-100"
                    onClick={() => dispatch({ type: 'MEASUREMENT_DELETE', id: m.id })}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    value={m.type}
                    onChange={(e) => updateMeasurement(m, { type: e.target.value })}
                    placeholder="Tipo"
                    className="h-9"
                  />
                  <Input
                    type="number"
                    value={m.value || ''}
                    onChange={(e) =>
                      updateMeasurement(m, { value: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="Valor"
                    className="h-9 font-mono"
                  />
                  <Input
                    type="date"
                    value={m.date ?? ''}
                    onChange={(e) => updateMeasurement(m, { date: e.target.value || undefined })}
                    className="h-9"
                  />
                </div>
                <div className="mt-3 text-fox-300 font-mono tabular-nums text-sm">
                  {formatCurrency(m.value)}
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
