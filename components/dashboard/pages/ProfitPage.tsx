'use client';

import { useMemo } from 'react';
import { Activity, Coins, Percent, PiggyBank, Wallet } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/layout/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/dashboard/ui/Card';
import { KpiCard } from '@/components/dashboard/ui/KpiCard';
import { ProgressBar } from '@/components/dashboard/ui/ProgressBar';
import { Badge } from '@/components/dashboard/ui/Badge';
import { useProject } from '@/lib/store/ProjectContext';
import { aggregateByCategory, projectProfit } from '@/lib/store/selectors';
import { formatCurrency, formatPercent } from '@/lib/format';

export function ProfitPage() {
  const { state } = useProject();
  const { budget, spent, profit, margin } = useMemo(() => projectProfit(state), [state]);

  // Composição do realizado — as mesmas frentes que entram em totalSpent.
  const composition = useMemo(
    () =>
      aggregateByCategory(state)
        .filter((a) => a.category !== 'clientExtras' && a.total > 0)
        .sort((a, b) => b.total - a.total),
    [state],
  );

  const positive = profit >= 0;
  const executed = budget > 0 ? (spent / budget) * 100 : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Coins}
        title="Lucro"
        subtitle="O que sobra do orçamento total depois de descontar tudo o que já foi realizado na obra."
      />

      <Card variant="strong">
        <CardBody className="p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-midnight-200">
                Lucro do projeto
              </span>
              <div
                className={
                  positive
                    ? 'font-display text-4xl md:text-5xl font-semibold tracking-tight text-emerald-300 tabular-nums mt-2'
                    : 'font-display text-4xl md:text-5xl font-semibold tracking-tight text-rose-300 tabular-nums mt-2'
                }
              >
                {formatCurrency(profit)}
              </div>
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <Badge tone={positive ? 'emerald' : 'rose'}>
                  {positive ? `margem de ${formatPercent(margin)}` : 'orçamento estourado'}
                </Badge>
                <span className="text-xs text-midnight-200 font-mono">
                  {formatCurrency(budget)} − {formatCurrency(spent)}
                </span>
              </div>
            </div>

            <div className="lg:max-w-md w-full">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-midnight-200">
                  Orçamento consumido
                </span>
                <span className="font-display font-semibold text-2xl text-white">
                  {formatPercent(executed)}
                </span>
              </div>
              <ProgressBar
                value={spent}
                max={budget}
                variant={executed <= 80 ? 'fox' : executed <= 100 ? 'amber' : 'rose'}
                size="lg"
              />
              <div className="flex justify-between mt-2 text-[11px] text-midnight-200">
                <span>
                  Realizado: <span className="text-white font-mono">{formatCurrency(spent)}</span>
                </span>
                <span>
                  Orçamento:{' '}
                  <span className="text-white font-mono">{formatCurrency(budget)}</span>
                </span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Orçamento total"
          value={formatCurrency(budget)}
          icon={Wallet}
          accent="fox"
          delay={0}
        />
        <KpiCard
          label="Realizado"
          value={formatCurrency(spent)}
          icon={Activity}
          accent="purple"
          trend={{ direction: executed <= 100 ? 'up' : 'down', label: formatPercent(executed) }}
          delay={0.05}
        />
        <KpiCard
          label="Lucro"
          value={formatCurrency(profit)}
          icon={PiggyBank}
          accent={positive ? 'emerald' : 'rose'}
          hint={positive ? 'Sobra do orçamento' : 'Custo acima do orçado'}
          delay={0.1}
        />
        <KpiCard
          label="Margem"
          value={formatPercent(margin)}
          icon={Percent}
          accent={positive ? 'emerald' : 'rose'}
          hint="Lucro sobre o orçamento"
          delay={0.15}
        />
      </div>

      <Card>
        <CardHeader
          title="Composição do realizado"
          subtitle="Onde o orçamento foi consumido até agora."
          icon={<Activity className="h-4 w-4" />}
        />
        <CardBody className="pt-4 space-y-4">
          {composition.length === 0 ? (
            <p className="text-sm text-midnight-200">
              Nenhum gasto lançado ainda — o lucro equivale ao orçamento total.
            </p>
          ) : (
            composition.map((c) => {
              const share = spent > 0 ? (c.total / spent) * 100 : 0;
              return (
                <div key={c.category}>
                  <div className="flex items-baseline justify-between gap-3 mb-1.5">
                    <span className="text-sm text-white">{c.label}</span>
                    <span className="text-sm font-mono text-midnight-100">
                      {formatCurrency(c.total)}
                      <span className="text-midnight-200 ml-2 text-xs">
                        {formatPercent(share)}
                      </span>
                    </span>
                  </div>
                  <ProgressBar value={c.total} max={spent} variant="fox" size="sm" />
                </div>
              );
            })
          )}
        </CardBody>
      </Card>
    </div>
  );
}
