import type { ProjectState, DataSheet, Row } from '@/types/domain';
import { uid } from '@/lib/id';
import type { Action, SheetKey } from './actions';

function withSheet(state: ProjectState, key: SheetKey, updater: (s: DataSheet) => DataSheet): ProjectState {
  return { ...state, [key]: updater(state[key]) };
}

function emptyRowFromColumns(sheet: DataSheet, override?: Record<string, string | number | null>): Row {
  const now = new Date().toISOString();
  const values: Record<string, string | number | null> = {};
  for (const col of sheet.columns) {
    values[col.key] = override?.[col.key] ?? (col.type === 'number' || col.type === 'currency' ? 0 : '');
  }
  return { id: uid(), values, createdAt: now, updatedAt: now };
}

function touch(state: ProjectState): ProjectState {
  return { ...state, meta: { lastUpdated: new Date().toISOString() } };
}

export function reducer(state: ProjectState, action: Action): ProjectState {
  switch (action.type) {
    case 'HYDRATE':
      return action.state;

    case 'RESET':
      return state;

    case 'PROJECT_UPDATE':
      return touch({ ...state, project: { ...state.project, ...action.patch } });

    case 'SHEET_ADD_ROW':
      return touch(
        withSheet(state, action.sheet, (s) => ({
          ...s,
          rows: [...s.rows, emptyRowFromColumns(s, action.values)],
        }))
      );

    case 'SHEET_UPDATE_ROW':
      return touch(
        withSheet(state, action.sheet, (s) => ({
          ...s,
          rows: s.rows.map((r) =>
            r.id === action.rowId
              ? {
                  ...r,
                  values: { ...r.values, ...action.values },
                  updatedAt: new Date().toISOString(),
                }
              : r,
          ),
        }))
      );

    case 'SHEET_DELETE_ROW':
      return touch(
        withSheet(state, action.sheet, (s) => ({
          ...s,
          rows: s.rows.filter((r) => r.id !== action.rowId),
        }))
      );

    case 'SHEET_ADD_COLUMN':
      return touch(
        withSheet(state, action.sheet, (s) => ({
          ...s,
          columns: [...s.columns, action.column],
          rows: s.rows.map((r) => ({
            ...r,
            values: {
              ...r.values,
              [action.column.key]: action.column.type === 'number' || action.column.type === 'currency' ? 0 : '',
            },
          })),
        }))
      );

    case 'SHEET_UPDATE_COLUMN':
      return touch(
        withSheet(state, action.sheet, (s) => ({
          ...s,
          columns: s.columns.map((c) =>
            c.id === action.columnId ? { ...c, ...action.patch } : c,
          ),
        }))
      );

    case 'SHEET_DELETE_COLUMN':
      return touch(
        withSheet(state, action.sheet, (s) => {
          const col = s.columns.find((c) => c.id === action.columnId);
          if (!col || col.locked) return s;
          return {
            ...s,
            columns: s.columns.filter((c) => c.id !== action.columnId),
            rows: s.rows.map((r) => {
              const next = { ...r.values };
              delete next[col.key];
              return { ...r, values: next };
            }),
          };
        })
      );

    case 'SHEET_REORDER_ROWS':
      return touch(
        withSheet(state, action.sheet, (s) => ({ ...s, rows: action.rows }))
      );

    case 'MEASUREMENT_UPDATE':
      return touch({
        ...state,
        measurements: state.measurements.map((m) =>
          m.id === action.measurement.id ? action.measurement : m,
        ),
      });

    case 'MEASUREMENT_ADD':
      return touch({ ...state, measurements: [...state.measurements, action.measurement] });

    case 'MEASUREMENT_DELETE':
      return touch({
        ...state,
        measurements: state.measurements.filter((m) => m.id !== action.id),
      });

    case 'BUDGET_UPDATE':
      return touch({
        ...state,
        budgetBreakdown: state.budgetBreakdown.map((b) =>
          b.id === action.budget.id ? action.budget : b,
        ),
      });

    case 'BUDGET_ADD':
      return touch({ ...state, budgetBreakdown: [...state.budgetBreakdown, action.budget] });

    case 'BUDGET_DELETE':
      return touch({
        ...state,
        budgetBreakdown: state.budgetBreakdown.filter((b) => b.id !== action.id),
      });

    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}
