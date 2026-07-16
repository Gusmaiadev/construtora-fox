'use client';

import { Ruler, Calculator, Plus, Trash2, Sigma } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/layout/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/dashboard/ui/Card';
import { useProject } from '@/lib/store/ProjectContext';
import { totalMeasurements } from '@/lib/store/selectors';
import { Badge } from '@/components/dashboard/ui/Badge';
import { formatCurrency } from '@/lib/format';
import { Button } from '@/components/dashboard/ui/Button';
import { IconButton } from '@/components/dashboard/ui/IconButton';
import { uid } from '@/lib/id';
import type { Measurement } from '@/types/domain';
import { Input } from '@/components/dashboard/ui/Input';

export function MeasurementsPage() {
  const { state, dispatch } = useProject();
  const measurementsTotal = totalMeasurements(state);
  const count = state.measurements.length;
  const average = count > 0 ? measurementsTotal / count : 0;

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
        icon={Ruler}
        title="Medições da Obra"
        subtitle="Liberações financeiras por etapa do contrato e repasses recebidos."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              {count} de 6 etapas
            </Badge>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Etapas medidas"
            subtitle="Quantidade de medições registradas"
            icon={<Ruler className="h-4 w-4" />}
          />
          <CardBody className="pt-2">
            <div className="font-display text-3xl font-semibold text-white tabular-nums">
              {count}
            </div>
            <Badge tone="fox" className="mt-2">
              {Math.max(0, 6 - count)} restantes
            </Badge>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Média por medição"
            subtitle="Valor médio liberado por etapa"
            icon={<Sigma className="h-4 w-4" />}
          />
          <CardBody className="pt-2">
            <div className="font-display text-3xl font-semibold text-white tabular-nums">
              {formatCurrency(average)}
            </div>
            <Badge tone="emerald" className="mt-2">
              média
            </Badge>
          </CardBody>
        </Card>
      </div>

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
