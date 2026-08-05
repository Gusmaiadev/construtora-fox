/**
 * Constrói um `ProjectState` (modelo do painel "8ª Yanna") a partir dos dados
 * estruturados importados das planilhas .ods, ou um estado vazio para projetos
 * novos. Mantém EXATAMENTE as mesmas colunas/estrutura do dashboard original.
 */
import type {
  BudgetCategory,
  CeramicSpec,
  ColumnDef,
  DataSheet,
  Measurement,
  ProjectState,
  Row,
} from '@/types/domain';
import { uid } from '@/lib/id';

export interface ImportedRow {
  name: string;
  date: string | null;
  value: number;
}
export interface ImportedLaborRow {
  order: number;
  date: string | null;
  value: number;
  description: string;
}
export interface ImportedExtraRow {
  name: string;
  value: number;
}
export interface ImportedProject {
  name: string;
  project: { name: string; code: string; dimensions: string; budget: number; investment: number };
  documentation: ImportedRow[];
  materials: ImportedRow[];
  labor: ImportedLaborRow[];
  extraLabor: ImportedLaborRow[];
  clientExtras: ImportedExtraRow[];
  measurements: { order: number; type: string; value: number; date: string | null }[];
  budgetBreakdown: { category: string; value: number }[];
  ceramics: { area: string; size: string; type: string }[];
}

const baseColumns = (): ColumnDef[] => [
  { id: uid(), key: 'name', label: 'Saída', type: 'text', width: 280, locked: true },
  { id: uid(), key: 'date', label: 'Data', type: 'date', width: 140, locked: true },
  { id: uid(), key: 'value', label: 'Valor', type: 'currency', width: 140, locked: true },
];

const laborColumns = (): ColumnDef[] => [
  { id: uid(), key: 'order', label: '#', type: 'number', width: 60, locked: true },
  { id: uid(), key: 'date', label: 'Data', type: 'date', width: 140, locked: true },
  { id: uid(), key: 'value', label: 'Valor', type: 'currency', width: 140, locked: true },
  { id: uid(), key: 'description', label: 'Especificação', type: 'text', width: 200, locked: true },
];

const clientExtrasColumns = (): ColumnDef[] => [
  { id: uid(), key: 'name', label: 'Item', type: 'text', width: 240, locked: true },
  { id: uid(), key: 'value', label: 'Valor', type: 'currency', width: 140, locked: true },
];

function makeRow(values: Record<string, string | number | null>): Row {
  const now = new Date().toISOString();
  return { id: uid(), values, createdAt: now, updatedAt: now };
}

const DEFAULT_BUDGET: { category: string; value: number }[] = [
  { category: 'Corretagem', value: 5200 },
  { category: 'Mão de obra', value: 32000 },
  { category: 'Documentação', value: 10000 },
  { category: 'Material', value: 60000 },
  { category: 'Terreno', value: 10000 },
];

function budgetCats(list: { category: string; value: number }[]): BudgetCategory[] {
  const src = list && list.length ? list : DEFAULT_BUDGET;
  return src.map((b) => ({ id: uid(), category: b.category, value: b.value }));
}

function measurements(list: ImportedProject['measurements']): Measurement[] {
  return (list ?? []).map((m) => ({
    id: uid(),
    order: m.order,
    type: m.type,
    value: m.value,
    date: m.date ?? undefined,
  }));
}

function ceramics(list: ImportedProject['ceramics']): CeramicSpec[] {
  return (list ?? []).map((c) => ({ id: uid(), area: c.area, size: c.size, type: c.type }));
}

export function buildStateFromImport(ip: ImportedProject): ProjectState {
  const documentation: DataSheet = {
    id: uid(),
    name: 'Documentação Inicial',
    description: 'Despesas de documentação, taxas e regularização do imóvel',
    columns: baseColumns(),
    rows: (ip.documentation ?? []).map((r) => makeRow({ name: r.name, date: r.date, value: r.value })),
  };
  const materials: DataSheet = {
    id: uid(),
    name: 'Materiais da Construção',
    description: 'Materiais adquiridos para a obra',
    columns: baseColumns(),
    rows: (ip.materials ?? []).map((r) => makeRow({ name: r.name, date: r.date, value: r.value })),
  };
  const labor: DataSheet = {
    id: uid(),
    name: 'Mão de Obra',
    description: 'Pagamentos por medição da obra principal',
    columns: laborColumns(),
    rows: (ip.labor ?? []).map((r) =>
      makeRow({ order: r.order, date: r.date, value: r.value, description: r.description }),
    ),
  };
  const extraLabor: DataSheet = {
    id: uid(),
    name: 'Mão de Obra Extra',
    description: 'Pagamentos avulsos: hidráulica, gesso, pintura, elétrica',
    columns: laborColumns(),
    rows: (ip.extraLabor ?? []).map((r) =>
      makeRow({ order: r.order, date: r.date, value: r.value, description: r.description }),
    ),
  };
  const clientExtras: DataSheet = {
    id: uid(),
    name: 'Adicionais do Cliente',
    description: 'Itens cobrados como adicionais ao cliente',
    columns: clientExtrasColumns(),
    rows: (ip.clientExtras ?? []).map((r) => makeRow({ name: r.name, value: r.value })),
  };

  return {
    schemaVersion: 1,
    project: ip.project,
    documentation,
    materials,
    labor,
    extraLabor,
    clientExtras,
    measurements: measurements(ip.measurements),
    budgetBreakdown: budgetCats(ip.budgetBreakdown),
    ceramics: ceramics(ip.ceramics),
    meta: { lastUpdated: new Date().toISOString() },
  };
}

/** Projeto novo: tudo zerado, inclusive orçamento e Ajustes. */
export function buildEmptyState(name: string): ProjectState {
  const state = buildStateFromImport({
    name,
    project: { name, code: '', dimensions: '', budget: 0, investment: 0 },
    documentation: [],
    materials: [],
    labor: [],
    extraLabor: [],
    clientExtras: [],
    measurements: [],
    budgetBreakdown: [],
    ceramics: [],
  });
  // `budgetCats` cai no padrão quando a lista vem vazia — para projeto novo
  // queremos realmente sem orçamento por categoria.
  state.budgetBreakdown = [];
  return state;
}
