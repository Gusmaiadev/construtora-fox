/**
 * Tipos de ações suportadas pelo reducer principal.
 *
 * O reducer é a única fonte de mutação do estado. Camadas de UI dispararão
 * `dispatch(action)` via hooks em vez de manipular o estado diretamente.
 */
import type {
  CellValue,
  ColumnDef,
  Row,
  ProjectInfo,
  BudgetCategory,
  Measurement,
  ProjectState,
} from '@/types/domain';

export type SheetKey =
  | 'documentation'
  | 'materials'
  | 'labor'
  | 'extraLabor'
  | 'clientExtras';

export type Action =
  | { type: 'HYDRATE'; state: ProjectState }
  | { type: 'RESET' }
  | { type: 'PROJECT_UPDATE'; patch: Partial<ProjectInfo> }
  | { type: 'SHEET_ADD_ROW'; sheet: SheetKey; values?: Record<string, CellValue> }
  | { type: 'SHEET_UPDATE_ROW'; sheet: SheetKey; rowId: string; values: Record<string, CellValue> }
  | { type: 'SHEET_DELETE_ROW'; sheet: SheetKey; rowId: string }
  | { type: 'SHEET_ADD_COLUMN'; sheet: SheetKey; column: ColumnDef }
  | { type: 'SHEET_UPDATE_COLUMN'; sheet: SheetKey; columnId: string; patch: Partial<ColumnDef> }
  | { type: 'SHEET_DELETE_COLUMN'; sheet: SheetKey; columnId: string }
  | { type: 'SHEET_REORDER_ROWS'; sheet: SheetKey; rows: Row[] }
  | { type: 'MEASUREMENT_UPDATE'; measurement: Measurement }
  | { type: 'MEASUREMENT_ADD'; measurement: Measurement }
  | { type: 'MEASUREMENT_DELETE'; id: string }
  | { type: 'BUDGET_UPDATE'; budget: BudgetCategory }
  | { type: 'BUDGET_ADD'; budget: BudgetCategory }
  | { type: 'BUDGET_DELETE'; id: string };
