/**
 * Seletores derivados — cálculos sobre o estado do projeto.
 * Encapsulados aqui para serem facilmente memoizados em hooks.
 */
import type {
  CategoryAggregate,
  DataSheet,
  ExpenseCategory,
  ProjectState,
  Row,
} from '@/types/domain';

export function sumValueColumn(sheet: DataSheet, key: string = 'value'): number {
  return sheet.rows.reduce((acc, r) => {
    const v = r.values[key];
    if (typeof v === 'number') return acc + v;
    if (typeof v === 'string') {
      const n = parseFloat(v.replace(',', '.'));
      return Number.isNaN(n) ? acc : acc + n;
    }
    return acc;
  }, 0);
}

export function totalDocumentation(s: ProjectState): number {
  return sumValueColumn(s.documentation);
}
export function totalMaterials(s: ProjectState): number {
  return sumValueColumn(s.materials);
}
export function totalLabor(s: ProjectState): number {
  return sumValueColumn(s.labor);
}
export function totalExtraLabor(s: ProjectState): number {
  return sumValueColumn(s.extraLabor);
}
export function totalClientExtras(s: ProjectState): number {
  return sumValueColumn(s.clientExtras);
}
export function totalMeasurements(s: ProjectState): number {
  return s.measurements.reduce((acc, m) => acc + (m.value || 0), 0);
}
export function totalBudgetPlanned(s: ProjectState): number {
  return s.budgetBreakdown.reduce((acc, b) => acc + (b.value || 0), 0);
}

/** Valor do terreno = orçado na categoria "Terreno" (0 se não houver). */
export function terrainValue(s: ProjectState): number {
  return budgetForCategory(s, 'Terreno') ?? 0;
}

export function totalSpent(s: ProjectState): number {
  return (
    totalDocumentation(s) +
    totalMaterials(s) +
    totalLabor(s) +
    totalExtraLabor(s) +
    terrainValue(s)
  );
}

export function aggregateByCategory(s: ProjectState): CategoryAggregate[] {
  const map: Record<ExpenseCategory, { label: string; budget?: number }> = {
    documentation: { label: 'Documentação', budget: budgetForCategory(s, 'Documentação') },
    materials: { label: 'Materiais', budget: budgetForCategory(s, 'Material') },
    labor: { label: 'Mão de Obra', budget: budgetForCategory(s, 'Mão de obra') },
    extraLabor: { label: 'M.O. Extra', budget: undefined },
    clientExtras: { label: 'Extras Cliente', budget: undefined },
    terrain: { label: 'Terreno', budget: budgetForCategory(s, 'Terreno') },
  };
  return [
    {
      category: 'documentation',
      ...map.documentation,
      total: totalDocumentation(s),
      count: s.documentation.rows.length,
    },
    {
      category: 'materials',
      ...map.materials,
      total: totalMaterials(s),
      count: s.materials.rows.length,
    },
    { category: 'labor', ...map.labor, total: totalLabor(s), count: s.labor.rows.length },
    {
      category: 'extraLabor',
      ...map.extraLabor,
      total: totalExtraLabor(s),
      count: s.extraLabor.rows.length,
    },
    {
      category: 'clientExtras',
      ...map.clientExtras,
      total: totalClientExtras(s),
      count: s.clientExtras.rows.length,
    },
    { category: 'terrain', ...map.terrain, total: terrainValue(s), count: terrainValue(s) > 0 ? 1 : 0 },
  ];
}

function budgetForCategory(s: ProjectState, name: string): number | undefined {
  return s.budgetBreakdown.find((b) => b.category.toLowerCase() === name.toLowerCase())?.value;
}

interface MonthBucket {
  monthKey: string;
  date: Date;
  documentation: number;
  materials: number;
  labor: number;
  extraLabor: number;
  total: number;
}

function pushToBucket(
  buckets: Map<string, MonthBucket>,
  iso: string | null | undefined,
  field: keyof Pick<MonthBucket, 'documentation' | 'materials' | 'labor' | 'extraLabor'>,
  value: number,
) {
  if (!iso) return;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return;
  const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  const existing = buckets.get(key);
  if (existing) {
    existing[field] += value;
    existing.total += value;
  } else {
    const bucket: MonthBucket = {
      monthKey: key,
      date: new Date(d.getFullYear(), d.getMonth(), 1),
      documentation: 0,
      materials: 0,
      labor: 0,
      extraLabor: 0,
      total: 0,
    };
    bucket[field] = value;
    bucket.total = value;
    buckets.set(key, bucket);
  }
}

function readNum(r: Row, key: string): number {
  const v = r.values[key];
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const n = parseFloat(v.replace(',', '.'));
    return Number.isNaN(n) ? 0 : n;
  }
  return 0;
}

function readStr(r: Row, key: string): string | null {
  const v = r.values[key];
  return typeof v === 'string' ? v : null;
}

export interface MonthlySeries extends MonthBucket {
  monthLabel: string;
  cumulative: number;
}

export function monthlyExpenses(s: ProjectState): MonthlySeries[] {
  const buckets = new Map<string, MonthBucket>();

  for (const r of s.documentation.rows) {
    pushToBucket(buckets, readStr(r, 'date'), 'documentation', readNum(r, 'value'));
  }
  for (const r of s.materials.rows) {
    pushToBucket(buckets, readStr(r, 'date'), 'materials', readNum(r, 'value'));
  }
  for (const r of s.labor.rows) {
    pushToBucket(buckets, readStr(r, 'date'), 'labor', readNum(r, 'value'));
  }
  for (const r of s.extraLabor.rows) {
    pushToBucket(buckets, readStr(r, 'date'), 'extraLabor', readNum(r, 'value'));
  }

  const fmt = new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit' });
  const arr = Array.from(buckets.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
  let cum = 0;
  return arr.map((b) => {
    cum += b.total;
    return { ...b, monthLabel: fmt.format(b.date).replace('.', ''), cumulative: cum };
  });
}

export interface TopMaterial {
  name: string;
  total: number;
  count: number;
}

export function topMaterials(s: ProjectState, limit = 8): TopMaterial[] {
  const map = new Map<string, TopMaterial>();
  for (const r of s.materials.rows) {
    const name = (readStr(r, 'name') || 'Sem nome').trim().toUpperCase();
    const value = readNum(r, 'value');
    const existing = map.get(name);
    if (existing) {
      existing.total += value;
      existing.count += 1;
    } else {
      map.set(name, { name: capitalize(name), total: value, count: 1 });
    }
  }
  return Array.from(map.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

function capitalize(s: string): string {
  return s
    .toLowerCase()
    .split(' ')
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(' ');
}

export function projectProgress(s: ProjectState): {
  spent: number;
  budget: number;
  percent: number;
  remaining: number;
  estimatedProfit: number;
} {
  const spent = totalSpent(s);
  const budget = s.project.budget;
  const percent = budget > 0 ? (spent / budget) * 100 : 0;
  const remaining = budget - spent;
  return {
    spent,
    budget,
    percent,
    remaining,
    estimatedProfit: budget - totalBudgetPlanned(s),
  };
}

export function ceramicTotalArea(s: ProjectState): number {
  return s.ceramics.reduce((acc, c) => {
    const m = parseFloat(String(c.size).replace(/[^\d,.]/g, '').replace(',', '.'));
    return Number.isNaN(m) ? acc : acc + m;
  }, 0);
}
