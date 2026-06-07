'use client';

import { Settings, Save, Database, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/layout/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/dashboard/ui/Card';
import { Button } from '@/components/dashboard/ui/Button';
import { Input, Field } from '@/components/dashboard/ui/Input';
import { useProject } from '@/lib/store/ProjectContext';
import { useState, useMemo } from 'react';
import { formatCurrency, parseNumberInput } from '@/lib/format';
import { Badge } from '@/components/dashboard/ui/Badge';
import {
  totalDocumentation,
  totalLabor,
  totalMaterials,
  totalExtraLabor,
  totalSpent,
} from '@/lib/store/selectors';

export function SettingsPage() {
  const { state, dispatch, reset } = useProject();
  const [name, setName] = useState(state.project.name);
  const [code, setCode] = useState(state.project.code);
  const [dimensions, setDimensions] = useState(state.project.dimensions);
  const [budget, setBudget] = useState(String(state.project.budget));
  const [investment, setInvestment] = useState(String(state.project.investment));
  const [confirmReset, setConfirmReset] = useState(false);

  const stats = useMemo(
    () => ({
      docs: state.documentation.rows.length,
      mats: state.materials.rows.length,
      lab: state.labor.rows.length,
      extLab: state.extraLabor.rows.length,
      ext: state.clientExtras.rows.length,
      meas: state.measurements.length,
      ceramic: state.ceramics.length,
    }),
    [state],
  );

  const save = () => {
    dispatch({
      type: 'PROJECT_UPDATE',
      patch: {
        name,
        code,
        dimensions,
        budget: parseNumberInput(budget),
        investment: parseNumberInput(investment),
      },
    });
  };

  const handleReset = () => {
    if (confirmReset) {
      reset();
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 4000);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Settings}
        title="Ajustes do Projeto"
        subtitle="Edite informações principais, visualize estatísticas e gerencie os dados locais."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Informações do projeto" icon={<Settings className="h-4 w-4" />} />
          <CardBody className="space-y-4">
            <Field label="Nome do projeto">
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="Código">
              <Input value={code} onChange={(e) => setCode(e.target.value)} />
            </Field>
            <Field label="Dimensões">
              <Input value={dimensions} onChange={(e) => setDimensions(e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Orçamento total (R$)">
                <Input
                  inputMode="decimal"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </Field>
              <Field label="Investido (R$)">
                <Input
                  inputMode="decimal"
                  value={investment}
                  onChange={(e) => setInvestment(e.target.value)}
                />
              </Field>
            </div>
            <div className="flex justify-end pt-1">
              <Button leftIcon={<Save className="h-4 w-4" />} onClick={save}>
                Salvar alterações
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Estatísticas dos dados" icon={<Database className="h-4 w-4" />} />
          <CardBody className="space-y-3">
            <Stat label="Documentação" count={stats.docs} value={totalDocumentation(state)} />
            <Stat label="Materiais" count={stats.mats} value={totalMaterials(state)} />
            <Stat label="Mão de obra" count={stats.lab} value={totalLabor(state)} />
            <Stat label="M.O. Extra" count={stats.extLab} value={totalExtraLabor(state)} />
            <Stat label="Adicionais cliente" count={stats.ext} value={null} />
            <div className="border-t border-white/[0.06] pt-3 flex items-center justify-between">
              <span className="text-sm text-midnight-100">Total acumulado</span>
              <span className="font-mono tabular-nums font-semibold text-fox-300">
                {formatCurrency(totalSpent(state))}
              </span>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Zona de risco"
          subtitle="Operações irreversíveis nos dados locais"
          icon={<AlertTriangle className="h-4 w-4" />}
        />
        <CardBody className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold text-white">Resetar dados</h4>
            <p className="text-xs text-midnight-200 max-w-md mt-1">
              Apaga todas as alterações feitas localmente e recarrega os dados originais da planilha.
              Esta ação não pode ser desfeita.
            </p>
          </div>
          <Button variant={confirmReset ? 'danger' : 'ghost'} onClick={handleReset}>
            {confirmReset ? 'Confirmar reset?' : 'Resetar dados'}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}

function Stat({ label, count, value }: { label: string; count: number; value: number | null }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-midnight-100">{label}</span>
      <div className="flex items-center gap-3">
        <Badge tone="neutral">{count} reg.</Badge>
        {value !== null && (
          <span className="font-mono tabular-nums text-white text-sm">{formatCurrency(value)}</span>
        )}
      </div>
    </div>
  );
}
