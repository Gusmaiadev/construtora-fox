'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Columns3,
  X,
  Inbox,
} from 'lucide-react';
import { useProject } from '@/lib/store/ProjectContext';
import type { SheetKey } from '@/lib/store/actions';
import type { CellValue, ColumnDef } from '@/types/domain';
import { Button } from '@/components/dashboard/ui/Button';
import { IconButton } from '@/components/dashboard/ui/IconButton';
import { EditableCell } from './EditableCell';
import { AddColumnModal } from './AddColumnModal';
import { Empty } from '@/components/dashboard/ui/Empty';
import { sumValueColumn } from '@/lib/store/selectors';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/cn';

interface DataGridProps {
  sheet: SheetKey;
  /** Permite remover linhas? Padrão: true. */
  allowDelete?: boolean;
  /** Coluna numérica usada para totalização. */
  totalKey?: string;
}

type SortDir = 'asc' | 'desc' | null;

export function DataGrid({
  sheet,
  allowDelete = true,
  totalKey = 'value',
}: DataGridProps) {
  const { state, dispatch } = useProject();
  const data = state[sheet];

  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const columns = data.columns;

  const filteredRows = useMemo(() => {
    let rows = data.rows;
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((r) =>
        Object.values(r.values).some((v) => String(v ?? '').toLowerCase().includes(q)),
      );
    }
    if (sortKey && sortDir) {
      rows = [...rows].sort((a, b) => {
        const va = a.values[sortKey];
        const vb = b.values[sortKey];
        const na = typeof va === 'number' ? va : parseFloat(String(va ?? '')) || 0;
        const nb = typeof vb === 'number' ? vb : parseFloat(String(vb ?? '')) || 0;
        const isNum = !Number.isNaN(na) && !Number.isNaN(nb) && (typeof va === 'number' || typeof vb === 'number');
        if (isNum) {
          return sortDir === 'asc' ? na - nb : nb - na;
        }
        const sa = String(va ?? '').toLowerCase();
        const sb = String(vb ?? '').toLowerCase();
        return sortDir === 'asc' ? sa.localeCompare(sb) : sb.localeCompare(sa);
      });
    }
    return rows;
  }, [data.rows, search, sortKey, sortDir]);

  const total = useMemo(() => sumValueColumn(data, totalKey), [data, totalKey]);

  const handleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir('asc');
    } else if (sortDir === 'asc') {
      setSortDir('desc');
    } else if (sortDir === 'desc') {
      setSortKey(null);
      setSortDir(null);
    }
  };

  const handleAddRow = () => {
    dispatch({ type: 'SHEET_ADD_ROW', sheet });
  };

  const handleDeleteRow = (rowId: string) => {
    if (confirmDeleteId === rowId) {
      dispatch({ type: 'SHEET_DELETE_ROW', sheet, rowId });
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(rowId);
      setTimeout(() => setConfirmDeleteId((id) => (id === rowId ? null : id)), 3000);
    }
  };

  const handleAddColumn = (col: ColumnDef) => {
    dispatch({ type: 'SHEET_ADD_COLUMN', sheet, column: col });
  };

  const handleDeleteColumn = (col: ColumnDef) => {
    if (col.locked) return;
    if (window.confirm(`Remover a coluna "${col.label}"? Os dados nessa coluna serão perdidos.`)) {
      dispatch({ type: 'SHEET_DELETE_COLUMN', sheet, columnId: col.id });
    }
  };

  const updateCell = (rowId: string, key: string, val: CellValue) => {
    dispatch({ type: 'SHEET_UPDATE_ROW', sheet, rowId, values: { [key]: val } });
  };

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-white/[0.05]">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-midnight-300" />
          <input
            type="text"
            placeholder={`Buscar em ${data.name}…`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] pl-9 pr-9 text-sm text-white placeholder:text-midnight-300 outline-none focus:border-fox-500/40 focus:bg-white/[0.04]"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-midnight-300 hover:text-white"
              aria-label="Limpar"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="text-xs text-midnight-200">
          <span className="font-mono tabular-nums text-white text-sm">
            {filteredRows.length}
          </span>{' '}
          {filteredRows.length === 1 ? 'item' : 'itens'} ·{' '}
          <span className="font-mono tabular-nums text-fox-300 text-sm">
            {formatCurrency(total)}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Columns3 className="h-4 w-4" />}
            onClick={() => setShowAddColumn(true)}
          >
            Coluna
          </Button>
          <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={handleAddRow}>
            Novo registro
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredRows.length === 0 ? (
          <Empty
            icon={Inbox}
            title="Nenhum registro encontrado"
            description={
              search
                ? 'Tente ajustar o termo de busca.'
                : 'Adicione o primeiro item desta categoria.'
            }
            action={
              !search && (
                <Button leftIcon={<Plus className="h-4 w-4" />} onClick={handleAddRow}>
                  Adicionar registro
                </Button>
              )
            }
          />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.015]">
                <th className="w-10 text-center text-[11px] font-medium uppercase tracking-wider text-midnight-300 py-3">
                  #
                </th>
                {columns.map((col) => (
                  <ColumnHeader
                    key={col.id}
                    col={col}
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={handleSort}
                    onDelete={handleDeleteColumn}
                  />
                ))}
                {allowDelete && (
                  <th className="w-12 text-right pr-3 text-[11px] font-medium uppercase tracking-wider text-midnight-300 py-3" />
                )}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {filteredRows.map((row, idx) => (
                  <motion.tr
                    key={row.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.18 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors"
                  >
                    <td className="w-10 text-center text-xs text-midnight-300 font-mono tabular-nums py-2">
                      {idx + 1}
                    </td>
                    {columns.map((col) => (
                      <td
                        key={col.id}
                        className="py-1 align-middle"
                        style={{ minWidth: col.width ?? 160 }}
                      >
                        <div className="h-9 flex items-center">
                          <EditableCell
                            column={col}
                            value={row.values[col.key] ?? null}
                            rowIndex={idx}
                            onChange={(v) => updateCell(row.id, col.key, v)}
                          />
                        </div>
                      </td>
                    ))}
                    {allowDelete && (
                      <td className="w-12 text-right pr-3">
                        <IconButton
                          icon={<Trash2 className="h-4 w-4" />}
                          label="Remover linha"
                          tone={confirmDeleteId === row.id ? 'danger' : 'default'}
                          onClick={() => handleDeleteRow(row.id)}
                        />
                      </td>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
            <tfoot>
              <tr className="border-t border-white/[0.06] bg-white/[0.02]">
                <td colSpan={columns.length} className="py-3 px-3 text-xs text-midnight-200 font-medium uppercase tracking-wider text-right">
                  Total
                </td>
                <td colSpan={allowDelete ? 2 : 1} className="py-3 pr-5 text-right">
                  <span className="font-mono tabular-nums text-fox-300 font-semibold">
                    {formatCurrency(total)}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      <AddColumnModal
        open={showAddColumn}
        onClose={() => setShowAddColumn(false)}
        onAdd={handleAddColumn}
        existingKeys={columns.map((c) => c.key)}
      />
    </div>
  );
}

function ColumnHeader({
  col,
  sortKey,
  sortDir,
  onSort,
  onDelete,
}: {
  col: ColumnDef;
  sortKey: string | null;
  sortDir: SortDir;
  onSort: (key: string) => void;
  onDelete: (col: ColumnDef) => void;
}) {
  const isActive = sortKey === col.key && sortDir;
  return (
    <th
      className={cn(
        'group text-left text-[11px] font-medium uppercase tracking-wider text-midnight-200 py-3 px-3',
        (col.type === 'currency' || col.type === 'number') && 'text-right',
      )}
      style={{ minWidth: col.width ?? 160 }}
    >
      <div
        className={cn(
          'flex items-center gap-1.5',
          (col.type === 'currency' || col.type === 'number') && 'justify-end',
        )}
      >
        <button
          type="button"
          onClick={() => onSort(col.key)}
          className="inline-flex items-center gap-1 hover:text-white transition"
        >
          <span>{col.label}</span>
          {isActive ? (
            sortDir === 'asc' ? (
              <ArrowUp className="h-3 w-3 text-fox-300" />
            ) : (
              <ArrowDown className="h-3 w-3 text-fox-300" />
            )
          ) : (
            <ArrowUpDown className="h-3 w-3 opacity-40" />
          )}
        </button>
        {col.custom && !col.locked && (
          <button
            type="button"
            className="opacity-0 group-hover:opacity-100 transition text-rose-300 hover:text-rose-200"
            onClick={() => onDelete(col)}
            aria-label={`Remover coluna ${col.label}`}
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    </th>
  );
}
