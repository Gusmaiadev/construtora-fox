/**
 * Modelo de domínio do dashboard.
 *
 * Modelado para refletir a estrutura da planilha "8° Yanna" mantendo
 * flexibilidade para novas colunas dinâmicas adicionadas via UI e
 * preparado para integração futura com API/banco.
 */

export type ID = string;

/** Tipos de dados aceitos por uma coluna dinâmica. */
export type ColumnType = 'text' | 'number' | 'currency' | 'date' | 'select';

export interface ColumnDef {
  id: ID;
  /** Identificador estável usado como chave em cada Row. */
  key: string;
  /** Nome exibido. */
  label: string;
  type: ColumnType;
  /** Para `select` — opções permitidas. */
  options?: string[];
  /** Largura sugerida (px) para a coluna na grade. */
  width?: number;
  /** Coluna criada pelo usuário (não vinda da planilha original). */
  custom?: boolean;
  /** Coluna fixa não removível (ex.: "Saída", "Data", "Valor"). */
  locked?: boolean;
}

export type CellValue = string | number | null;

export interface Row {
  id: ID;
  values: Record<string, CellValue>;
  /** Quando criado/modificado. */
  createdAt: string;
  updatedAt: string;
}

/** Uma "tabela" reutilizável no dashboard (lista de colunas + linhas). */
export interface DataSheet {
  id: ID;
  name: string;
  description?: string;
  columns: ColumnDef[];
  rows: Row[];
}

export interface CeramicSpec {
  id: ID;
  area: string;
  size: string;
  type: string;
}

export interface Measurement {
  id: ID;
  order: number;
  type: string;
  value: number;
  date?: string;
}

export interface BudgetCategory {
  id: ID;
  category: string;
  value: number;
}

export interface ProjectState {
  /** Versão do schema — usada para migrações futuras. */
  schemaVersion: number;
  project: ProjectInfo;
  documentation: DataSheet;
  materials: DataSheet;
  labor: DataSheet;
  extraLabor: DataSheet;
  clientExtras: DataSheet;
  measurements: Measurement[];
  budgetBreakdown: BudgetCategory[];
  ceramics: CeramicSpec[];
  meta: {
    lastUpdated: string;
  };
}

export interface ProjectInfo {
  name: string;
  code: string;
  dimensions: string;
  budget: number;
  /** Capital próprio investido. */
  investment: number;
}

/** Categorias-pai usadas em agregações (gráficos). */
export type ExpenseCategory =
  | 'documentation'
  | 'materials'
  | 'labor'
  | 'extraLabor'
  | 'clientExtras'
  | 'terrain';

export interface CategoryAggregate {
  category: ExpenseCategory;
  label: string;
  total: number;
  count: number;
  budget?: number;
}
