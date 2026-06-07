'use client';

import { useState } from 'react';
import { Modal } from '@/components/dashboard/ui/Modal';
import { Input, Field, Select } from '@/components/dashboard/ui/Input';
import { Button } from '@/components/dashboard/ui/Button';
import type { ColumnDef, ColumnType } from '@/types/domain';
import { uid } from '@/lib/id';

interface AddColumnModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (column: ColumnDef) => void;
  existingKeys: string[];
}

const TYPE_OPTIONS: { value: ColumnType; label: string }[] = [
  { value: 'text', label: 'Texto' },
  { value: 'number', label: 'Número' },
  { value: 'currency', label: 'Valor (R$)' },
  { value: 'date', label: 'Data' },
  { value: 'select', label: 'Seleção' },
];

export function AddColumnModal({ open, onClose, onAdd, existingKeys }: AddColumnModalProps) {
  const [label, setLabel] = useState('');
  const [type, setType] = useState<ColumnType>('text');
  const [optionsRaw, setOptionsRaw] = useState('');

  const reset = () => {
    setLabel('');
    setType('text');
    setOptionsRaw('');
  };

  const handleAdd = () => {
    const trimmed = label.trim();
    if (!trimmed) return;
    let key = trimmed
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');
    if (!key) key = `col_${Date.now()}`;
    if (existingKeys.includes(key)) {
      key = `${key}_${Math.random().toString(36).slice(2, 5)}`;
    }
    const col: ColumnDef = {
      id: uid(),
      key,
      label: trimmed,
      type,
      custom: true,
      width: type === 'date' ? 140 : 180,
    };
    if (type === 'select') {
      col.options = optionsRaw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    onAdd(col);
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Nova coluna">
      <div className="space-y-4">
        <Field label="Nome">
          <Input
            placeholder="Ex.: Fornecedor"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            autoFocus
          />
        </Field>
        <Field label="Tipo">
          <Select value={type} onChange={(e) => setType(e.target.value as ColumnType)}>
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
        {type === 'select' && (
          <Field label="Opções" hint="Separe por vírgula. Ex.: Pago, Pendente, Atrasado">
            <Input
              placeholder="Pago, Pendente, Atrasado"
              value={optionsRaw}
              onChange={(e) => setOptionsRaw(e.target.value)}
            />
          </Field>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleAdd} disabled={!label.trim()}>
            Adicionar coluna
          </Button>
        </div>
      </div>
    </Modal>
  );
}
