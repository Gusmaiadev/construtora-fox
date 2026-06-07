'use client';

import { useMemo } from 'react';
import {
  Wallet,
  TrendingUp,
  Hammer,
  HardHat,
  ShoppingCart,
  Sparkles,
  Activity,
  PiggyBank,
  Layers,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useProject } from '@/lib/store/ProjectContext';
import {
  aggregateByCategory,
  monthlyExpenses,
  projectProgress,
  topMaterials,
  totalBudgetPlanned,
  totalClientExtras,
  totalLabor,
  totalMaterials,
  totalMeasurements,
  ceramicTotalArea,
} from '@/lib/store/selectors';
import { KpiCard } from '@/components/dashboard/ui/KpiCard';
import { Card, CardBody, CardHeader } from '@/components/dashboard/ui/Card';
import { ExpenseAreaChart } from '@/components/dashboard/charts/ExpenseAreaChart';
import { CategoryDonut } from '@/components/dashboard/charts/CategoryDonut';
import { TopMaterialsChart } from '@/components/dashboard/charts/TopMaterialsChart';
import { BudgetVsActualChart } from '@/components/dashboard/charts/BudgetVsActualChart';
import { CumulativeChart } from '@/components/dashboard/charts/CumulativeChart';
import { ProgressBar } from '@/components/dashboard/ui/ProgressBar';
import { Badge } from '@/components/dashboard/ui/Badge';
import { formatCurrency, formatPercent } from '@/lib/format';

export function DashboardPage() {
  const { state } = useProject();
  const progress = useMemo(() => projectProgress(state), [state]);
  const monthly = useMemo(() => monthlyExpenses(state), [state]);
  const aggregates = useMemo(() => aggregateByCategory(state), [state]);
  const topMats = useMemo(() => topMaterials(state, 8), [state]);
  const measurementsTotal = totalMeasurements(state);
  const budgetPlanned = totalBudgetPlanned(state);
  const ceramicArea = ceramicTotalArea(state);

  const burnRate = monthly.length > 0 ? monthly[monthly.length - 1]!.total : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <ProjectHero
        budget={state.project.budget}
        spent={progress.spent}
        percent={progress.percent}
        remaining={progress.remaining}
        name={state.project.name}
        code={state.project.code}
        dimensions={state.project.dimensions}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Orçamento total"
          value={formatCurrency(state.project.budget)}
          icon={Wallet}
          accent="fox"
          hint={`Planejado: ${formatCurrency(budgetPlanned)}`}
          delay={0}
        />
        <KpiCard
          label="Realizado"
          value={formatCurrency(progress.spent)}
          icon={Activity}
          accent="purple"
          trend={{
            direction: progress.percent <= 100 ? 'up' : 'down',
            label: formatPercent(progress.percent),
          }}
          delay={0.05}
        />
        <KpiCard
          label="Saldo do orçamento"
          value={formatCurrency(progress.remaining)}
          icon={PiggyBank}
          accent={progress.remaining >= 0 ? 'emerald' : 'rose'}
          hint={progress.remaining >= 0 ? 'Dentro do limite' : 'Acima do orçado'}
          delay={0.1}
        />
        <KpiCard
          label="Medições liberadas"
          value={formatCurrency(measurementsTotal)}
          icon={TrendingUp}
          accent="cyan"
          hint={`${state.measurements.length} medições`}
          delay={0.15}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Materiais"
          value={formatCurrency(totalMaterials(state))}
          icon={ShoppingCart}
          accent="amber"
          hint={`${state.materials.rows.length} compras`}
          delay={0}
        />
        <KpiCard
          label="Mão de obra"
          value={formatCurrency(totalLabor(state))}
          icon={Hammer}
          accent="purple"
          hint={`${state.labor.rows.length} medições`}
          delay={0.05}
        />
        <KpiCard
          label="Adicionais cliente"
          value={formatCurrency(totalClientExtras(state))}
          icon={Sparkles}
          accent="emerald"
          hint={`${state.clientExtras.rows.length} itens`}
          delay={0.1}
        />
        <KpiCard
          label="Cerâmica · área"
          value={`${ceramicArea.toLocaleString('pt-BR')} m²`}
          icon={Layers}
          accent="cyan"
          hint={`${state.ceramics.length} ambientes`}
          delay={0.15}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Evolução de gastos por mês"
            subtitle="Distribuição mensal entre categorias com base nas datas registradas."
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <CardBody>
            <ExpenseAreaChart data={monthly} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            title="Mix por categoria"
            subtitle="Onde o capital da obra foi alocado."
            icon={<Layers className="h-4 w-4" />}
          />
          <CardBody>
            <CategoryDonut data={aggregates.filter((a) => a.total > 0)} />
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Acumulado vs orçamento"
            subtitle="Curva de execução financeira ao longo da obra."
            icon={<Activity className="h-4 w-4" />}
            actions={
              burnRate > 0 ? (
                <Badge tone="amber">
                  <span className="font-mono">{formatCurrency(burnRate)}</span>
                  &nbsp;último mês
                </Badge>
              ) : null
            }
          />
          <CardBody>
            <CumulativeChart data={monthly} budget={state.project.budget} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            title="Orçado × Realizado"
            subtitle="Comparativo por categoria principal."
            icon={<Wallet className="h-4 w-4" />}
          />
          <CardBody>
            <BudgetVsActualChart data={aggregates} />
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Top materiais por valor"
          subtitle="Itens consolidados por nome (somando recompras)."
          icon={<HardHat className="h-4 w-4" />}
        />
        <CardBody>
          <TopMaterialsChart data={topMats} />
        </CardBody>
      </Card>
    </div>
  );
}

function ProjectHero({
  name,
  code,
  dimensions,
  budget,
  spent,
  percent,
  remaining,
}: {
  name: string;
  code: string;
  dimensions: string;
  budget: number;
  spent: number;
  percent: number;
  remaining: number;
}) {
  const variant = percent <= 80 ? 'fox' : percent <= 100 ? 'amber' : 'rose';
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl glass-strong p-6 md:p-8"
    >
      <div
        aria-hidden
        className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-fox-500/30 blur-[120px]"
      />
      <div
        aria-hidden
        className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-purple-500/20 blur-[120px]"
      />
      <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          <Badge tone="fox" className="mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-fox-300 animate-pulse" />
            {code} · em andamento
          </Badge>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
            <span className="gradient-text-fox">{name}</span>
            <span className="text-white/80"> · Painel de Obra</span>
          </h1>
          <p className="text-sm text-midnight-100 mt-2 max-w-xl">
            Acompanhe documentação, materiais, mão de obra e adicionais com indicadores em
            tempo real. Dimensões: <span className="text-white font-medium">{dimensions}</span>.
          </p>
        </div>
        <div className="lg:max-w-md w-full">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-midnight-200">Execução</span>
            <span className="font-display font-semibold text-2xl text-white">
              {formatPercent(percent)}
            </span>
          </div>
          <ProgressBar value={spent} max={budget} variant={variant} size="lg" />
          <div className="flex justify-between mt-2 text-[11px] text-midnight-200">
            <span>
              Realizado:{' '}
              <span className="text-white font-mono">{formatCurrency(spent)}</span>
            </span>
            <span>
              Saldo:{' '}
              <span className={remaining >= 0 ? 'text-emerald-300 font-mono' : 'text-rose-300 font-mono'}>
                {formatCurrency(remaining)}
              </span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
