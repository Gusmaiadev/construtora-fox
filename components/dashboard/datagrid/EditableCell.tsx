'use client';

import { useEffect, useRef, useState } from 'react';
import type { CellValue, ColumnDef } from '@/types/domain';
import { formatCurrency, formatDate, parseNumberInput } from '@/lib/format';
import { cn } from '@/lib/cn';

interface EditableCellProps {
  column: ColumnDef;
  value: CellValue;
  onChange: (next: CellValue) => void;
  rowIndex: number;
}

export function EditableCell({ column, value, onChange }: EditableCellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string>('');
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      if (inputRef.current && 'select' in inputRef.current) {
        (inputRef.current as HTMLInputElement).select?.();
      }
    }
  }, [editing]);

  const startEdit = () => {
    setEditing(true);
    if (column.type === 'currency' || column.type === 'number') {
      setDraft(value === null || value === '' ? '' : String(value).replace('.', ','));
    } else {
      setDraft(value === null ? '' : String(value));
    }
  };

  const commit = () => {
    let next: CellValue = draft;
    if (column.type === 'number' || column.type === 'currency') {
      next = draft.trim() === '' ? null : parseNumberInput(draft);
    } else if (column.type === 'date') {
      next = draft || null;
    } else {
      next = draft;
    }
    onChange(next);
    setEditing(false);
  };

  const cancel = () => {
    setEditing(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    }
  };

  const renderDisplay = () => {
    if (value === null || value === '' || value === undefined) {
      return <span className="text-midnight-300/70 italic text-xs">—</span>;
    }
    if (column.type === 'currency') {
      return (
        <span className="font-mono tabular-nums text-white">
          {formatCurrency(typeof value === 'number' ? value : parseFloat(String(value)) || 0)}
        </span>
      );
    }
    if (column.type === 'number') {
      return <span className="font-mono tabular-nums text-white">{String(value)}</span>;
    }
    if (column.type === 'date') {
      return (
        <span className="font-mono tabular-nums text-midnight-100 text-xs">
          {formatDate(String(value))}
        </span>
      );
    }
    return <span className="text-white">{String(value)}</span>;
  };

  if (editing) {
    if (column.type === 'select' && column.options) {
      return (
        <select
          ref={inputRef as React.RefObject<HTMLSelectElement>}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={onKey}
          className="w-full h-full bg-fox-500/10 ring-1 ring-fox-500/40 px-2 text-sm text-white outline-none rounded"
        >
          <option value="">—</option>
          {column.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    }
    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type={column.type === 'date' ? 'date' : 'text'}
        inputMode={
          column.type === 'currency' || column.type === 'number' ? 'decimal' : undefined
        }
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={onKey}
        className={cn(
          'w-full h-full bg-fox-500/10 ring-1 ring-fox-500/40 px-3 text-sm text-white outline-none rounded',
          (column.type === 'currency' || column.type === 'number') &&
            'font-mono tabular-nums text-right',
        )}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={startEdit}
      onFocus={startEdit}
      className={cn(
        'w-full h-full px-3 text-left flex items-center hover:bg-white/[0.03] transition-colors rounded',
        (column.type === 'currency' || column.type === 'number') && 'justify-end',
      )}
    >
      {renderDisplay()}
    </button>
  );
}
