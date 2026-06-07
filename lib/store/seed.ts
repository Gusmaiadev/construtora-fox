/**
 * Seed inicial extraído da planilha "8° Yanna.xlsx".
 * Estes dados são carregados quando o LocalStorage está vazio.
 */
import type {
  BudgetCategory,
  CeramicSpec,
  ColumnDef,
  DataSheet,
  Measurement,
  ProjectInfo,
  ProjectState,
  Row,
} from '@/types/domain';
import { uid } from '@/lib/id';

export const PROJECT_INFO: ProjectInfo = {
  name: '8ª Yanna',
  code: '6ª Casa',
  dimensions: '5,60 × 25,00 m',
  budget: 150_000,
  investment: 26_568,
};

const baseColumns: ColumnDef[] = [
  { id: uid(), key: 'name', label: 'Saída', type: 'text', width: 280, locked: true },
  { id: uid(), key: 'date', label: 'Data', type: 'date', width: 140, locked: true },
  { id: uid(), key: 'value', label: 'Valor', type: 'currency', width: 140, locked: true },
];

function makeRow(values: Record<string, unknown>): Row {
  const now = new Date().toISOString();
  const cleaned: Record<string, string | number | null> = {};
  for (const [k, v] of Object.entries(values)) {
    if (v === undefined) continue;
    cleaned[k] = (v as string | number | null) ?? null;
  }
  return { id: uid(), values: cleaned, createdAt: now, updatedAt: now };
}

const documentationRows = [
  ['SEMAN', '2025-10-01', 90.45],
  ['Ordem de serviço', '2025-10-07', 750],
  ['Atualização Matrícula', '2025-10-09', 112.6],
  ['Atualização Matrícula', '2025-10-24', 112.6],
  ['ISS', '2025-10-28', 976.64],
  ['TEO', '2025-10-28', 44.85],
  ['IPTU', '2025-10-28', 40.11],
  ['Projeto Engenheiro', '2025-10-30', 600],
  ['Seguro Caixa', '2025-11-03', 1930],
  ['Averbação', '2025-11-10', 5533.56],
  ['Corretor Luciano 3%', '2025-11-15', 4200],
] as const;

const materialsRows = [
  ['Ferros', '2025-10-29', 1940.34],
  ['Pia WC / Tanquinho', '2025-10-31', 244],
  ['Tijolos', '2025-11-06', 4200],
  ['Blocos', '2025-11-18', 4000],
  ['Manta Asfáltica', '2025-11-19', 230],
  ['Brocha', '2025-11-19', 12],
  ['Cimento', '2025-11-19', 2526],
  ['Luzes', '2025-11-24', 168],
  ['Acal', '2025-11-24', 200],
  ['Treliças', '2025-11-25', 515],
  ['Cimento', '2025-12-17', 1407.33],
  ['Caixa de Água', '2025-12-17', 399.9],
  ['Telhas', '2025-12-17', 1250],
  ['Ferros', '2025-12-17', 737.5],
  ['Cimento', '2025-12-17', 2167.2],
  ['Treliças e Telhas', '2025-12-19', 1983.33],
  ['Forras', '2025-12-20', 600],
  ['Granitos', '2025-12-22', 600],
  ['Natal Graças', '2025-12-24', 160],
  ['Cimento', '2025-12-29', 560],
  ['Madeiramento Telhado', '2025-12-29', 2880],
  ['Goiano', '2025-12-29', 20],
  ['Caixa de Correio', '2026-01-06', 24],
  ['Caixa de Energia', '2026-01-19', 179.19],
  ['Telhas', '2026-01-21', 480],
  ['Fio de Conexão', '2026-01-21', 100],
  ['Água Hidráulica', '2026-01-23', 634.16],
  ['Energia', '2026-01-23', 467.96],
  ['Cimento', '2026-01-23', 225],
  ['Isopor Lage', '2026-01-23', 724.8],
  ['Lage', '2026-01-23', 2153.66],
  ['Portão Frente', '2026-01-26', 2400],
  ['Vaso Banheiro', '2026-02-04', 699.8],
  ['Chuv, Torn, Parafuso Vaso', '2026-02-04', 175.69],
  ['Pia Cozinha', '2026-02-04', 0],
  ['Kit Banheiro', '2026-02-04', 87.64],
  ['Água Material', '2025-12-30', 333.33],
  ['Mini Poste', '2025-12-30', 78],
  ['Louça', '2025-12-30', 8],
  ['Haste Aterramento', '2025-12-30', 60],
  ['Caixa de Teto', '2025-12-30', 26],
  ['Instalação Energia', '2025-12-30', 234.6],
  ['Cimento Apodi', '2025-12-30', 75],
  ['Isopor Lage', '2025-12-30', 652.8],
  ['Escorras Laje', '2025-12-30', 266.87],
  ['Argamassa AC II', '2026-02-09', 623],
  ['Fios', '2026-02-10', 350],
  ['Depósito', '2026-02-11', 411.54],
  ['Rejunte Branco', '2026-02-26', 120.6],
  ['Tao', '2026-03-04', 358.37],
  ['Pia Granito', '2026-03-11', 500],
  ['Depósito', '2026-03-16', 950.93],
  ['Tintas', '2026-03-17', 1926.98],
  ['Portas e Janelas de Vidros', '2026-03-17', 3000],
  ['Areia', '2026-03-17', 452],
  ['Tijolo', '2026-03-17', 1473.33],
  ['Barro', '2026-03-17', 340],
  ['Brita', '2026-03-17', 816.67],
  ['Extra', '2026-03-17', 1000],
  ['Cerâmica Aurora', '2026-03-17', 2668.07],
  ['Rejunte Preto', '2026-03-17', 99.5],
  ['AC3', '2026-03-18', 537],
  ['Porcelanato Preto', '2026-03-18', 1000],
  ['Portas dos Quartos', '2026-03-30', 1850],
  ['Água Casas', '2026-04-08', 953],
  ['Depósito', '2026-04-14', 216],
  ['Depósito', '2026-04-14', 70],
  ['Depósito', '2026-04-20', 300],
] as const;

const laborColumns: ColumnDef[] = [
  { id: uid(), key: 'order', label: '#', type: 'number', width: 60, locked: true },
  { id: uid(), key: 'date', label: 'Data', type: 'date', width: 140, locked: true },
  { id: uid(), key: 'value', label: 'Valor', type: 'currency', width: 140, locked: true },
  { id: uid(), key: 'description', label: 'Especificação', type: 'text', width: 200, locked: true },
];

const laborRows = [
  [1, '2025-11-28', 6500, 'Medição'],
  [2, '2025-12-10', 300, 'Adiantamento'],
  [3, '2025-12-24', 5000, 'Medição'],
  [4, '2025-12-31', 5500, 'Medição'],
  [5, '2026-01-16', 6500, 'Medição'],
  [6, null, 2768, 'Medição'],
] as const;

const extraLaborRows = [
  [1, '2025-12-25', 1200, 'Hidráulica'],
  [2, '2026-01-26', 1300, 'Gesso'],
  [3, '2026-04-23', 1200, 'Pintura'],
  [4, '2026-04-23', 650, 'Elétrica'],
] as const;

const clientExtrasColumns: ColumnDef[] = [
  { id: uid(), key: 'name', label: 'Item', type: 'text', width: 240, locked: true },
  { id: uid(), key: 'value', label: 'Valor', type: 'currency', width: 140, locked: true },
];

const clientExtrasRows = [
  ['Fachada Extra', 2075],
  ['8 Arandelas', 280],
  ['Nicho', 140],
  ['Cerâmica', 2385.3],
] as const;

export const MEASUREMENTS: Measurement[] = [
  { id: uid(), order: 1, type: 'Terreno', value: 23900, date: '2025-09-15' },
  { id: uid(), order: 2, type: 'Medição', value: 36425.93, date: '2025-11-30' },
  { id: uid(), order: 3, type: 'Medição', value: 29942.01, date: '2025-12-30' },
  { id: uid(), order: 4, type: 'Medição', value: 0 },
  { id: uid(), order: 5, type: 'Medição', value: 0 },
  { id: uid(), order: 6, type: 'Medição', value: 0 },
];

export const BUDGET_BREAKDOWN: BudgetCategory[] = [
  { id: uid(), category: 'Corretagem', value: 5600 },
  { id: uid(), category: 'Mão de obra', value: 32500 },
  { id: uid(), category: 'Documentação', value: 11000 },
  { id: uid(), category: 'Material', value: 65000 },
  { id: uid(), category: 'Terreno', value: 10000 },
];

export const CERAMICS: CeramicSpec[] = [
  { id: uid(), area: 'Parede Cozinha', size: '18 m²', type: 'Aurora Branca' },
  { id: uid(), area: 'Parede Box', size: '8 m²', type: 'Porcelanato' },
  { id: uid(), area: 'Balcão', size: '2,5 m²', type: 'Porcelanato' },
  { id: uid(), area: 'Fachada', size: '6 m²', type: 'Porcelanato' },
  { id: uid(), area: 'Casa Geral', size: '68 m²', type: 'Aurora Branca' },
  { id: uid(), area: 'Banheiro', size: '5 m²', type: 'Ipanema' },
  { id: uid(), area: 'Box Antiaderente', size: '1,5 m²', type: 'Antiderrapante Branco' },
];

function buildSimpleSheet(
  name: string,
  description: string,
  rowsData: ReadonlyArray<readonly [string, string | null, number]>,
): DataSheet {
  return {
    id: uid(),
    name,
    description,
    columns: baseColumns.map((c) => ({ ...c, id: uid() })),
    rows: rowsData.map(([n, d, v]) =>
      makeRow({ name: n, date: d, value: v }),
    ),
  };
}

export function buildInitialState(): ProjectState {
  const documentation = buildSimpleSheet(
    'Documentação Inicial',
    'Despesas de documentação, taxas e regularização do imóvel',
    documentationRows,
  );

  const materials = buildSimpleSheet(
    'Materiais da Construção',
    'Materiais adquiridos para a obra',
    materialsRows,
  );

  const labor: DataSheet = {
    id: uid(),
    name: 'Mão de Obra',
    description: 'Pagamentos por medição da obra principal',
    columns: laborColumns.map((c) => ({ ...c, id: uid() })),
    rows: laborRows.map(([o, d, v, desc]) =>
      makeRow({ order: o, date: d, value: v, description: desc }),
    ),
  };

  const extraLabor: DataSheet = {
    id: uid(),
    name: 'Mão de Obra Extra',
    description: 'Pagamentos avulsos: hidráulica, gesso, pintura, elétrica',
    columns: laborColumns.map((c) => ({
      ...c,
      id: uid(),
      key: c.key === 'description' ? 'description' : c.key,
      label: c.key === 'description' ? 'Especificação' : c.label,
    })),
    rows: extraLaborRows.map(([o, d, v, desc]) =>
      makeRow({ order: o, date: d, value: v, description: desc }),
    ),
  };

  const clientExtras: DataSheet = {
    id: uid(),
    name: 'Adicionais do Cliente',
    description: 'Itens cobrados como adicionais ao cliente',
    columns: clientExtrasColumns.map((c) => ({ ...c, id: uid() })),
    rows: clientExtrasRows.map(([n, v]) =>
      makeRow({ name: n, value: v }),
    ),
  };

  return {
    schemaVersion: 1,
    project: PROJECT_INFO,
    documentation,
    materials,
    labor,
    extraLabor,
    clientExtras,
    measurements: MEASUREMENTS,
    budgetBreakdown: BUDGET_BREAKDOWN,
    ceramics: CERAMICS,
    meta: { lastUpdated: new Date().toISOString() },
  };
}
