'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Folder as FolderIcon,
  FolderPlus,
  Plus,
  MoreVertical,
  Copy,
  FolderInput,
  Pencil,
  Trash2,
  ArrowUpRight,
  LayoutGrid,
  Loader2,
  Inbox,
} from 'lucide-react';
import { Button } from '@/components/dashboard/ui/Button';
import { IconButton } from '@/components/dashboard/ui/IconButton';
import { Modal } from '@/components/dashboard/ui/Modal';
import { Input, Field, Select } from '@/components/dashboard/ui/Input';
import { Empty } from '@/components/dashboard/ui/Empty';
import { cn } from '@/lib/cn';
import type { Folder, ProjectSummary } from '@/types/workspace';
import {
  seedIfEmpty,
  listFolders,
  listProjects,
  createFolder,
  renameFolder,
  deleteFolder,
  createProject,
  renameProject,
  moveProject,
  deleteProject,
  duplicateProject,
  getProject,
} from '@/lib/firebase/repository';

const ORPHAN = '__orphan__';

type Dialog =
  | { kind: 'new-folder' }
  | { kind: 'rename-folder'; id: string; name: string }
  | { kind: 'new-project' }
  | { kind: 'rename-project'; id: string; name: string }
  | { kind: 'move-project'; id: string; name: string; folderId: string | null }
  | { kind: 'duplicate-project'; id: string; name: string }
  | { kind: 'delete-folder'; id: string; name: string }
  | { kind: 'delete-project'; id: string; name: string }
  | null;

export function ProjectsBrowser() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [menuId, setMenuId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        await seedIfEmpty();
        const [f, p] = await Promise.all([listFolders(), listProjects()]);
        if (!active) return;
        setFolders(f);
        setProjects(p);
      } catch (e) {
        if (active) setError(errorMessage(e));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const byFolder = useMemo(() => {
    const map = new Map<string, ProjectSummary[]>();
    for (const p of projects) {
      const key = p.folderId ?? ORPHAN;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    }
    return map;
  }, [projects]);

  /* ---- mutations (otimistas após sucesso no Firestore) ---- */

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      setDialog(null);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const handleNewFolder = (name: string) =>
    run(async () => {
      const f = await createFolder(name);
      setFolders((prev) => [...prev, f]);
    });

  const handleRenameFolder = (id: string, name: string) =>
    run(async () => {
      await renameFolder(id, name);
      setFolders((prev) => prev.map((f) => (f.id === id ? { ...f, name } : f)));
    });

  const handleDeleteFolder = (id: string) =>
    run(async () => {
      await deleteFolder(id);
      setFolders((prev) => prev.filter((f) => f.id !== id));
      setProjects((prev) => prev.map((p) => (p.folderId === id ? { ...p, folderId: null } : p)));
    });

  const handleNewProject = (name: string, folderId: string | null) =>
    run(async () => {
      const p = await createProject({ name, folderId });
      setProjects((prev) => [...prev, summaryOf(p)]);
    });

  const handleRenameProject = (id: string, name: string) =>
    run(async () => {
      await renameProject(id, name);
      setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
    });

  const handleMoveProject = (id: string, folderId: string | null) =>
    run(async () => {
      await moveProject(id, folderId);
      setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, folderId } : p)));
    });

  const handleDeleteProject = (id: string) =>
    run(async () => {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    });

  const handleDuplicate = (id: string, withData: boolean) =>
    run(async () => {
      const full = await getProject(id);
      if (!full) throw new Error('Projeto não encontrado.');
      const dup = await duplicateProject(full, { withData });
      setProjects((prev) => [...prev, summaryOf(dup)]);
    });

  /* ---- render ---- */

  const sections: { id: string | null; name: string; items: ProjectSummary[] }[] = [
    ...folders.map((f) => ({ id: f.id, name: f.name, items: byFolder.get(f.id) ?? [] })),
  ];
  const orphans = byFolder.get(ORPHAN) ?? [];
  if (orphans.length) sections.push({ id: null, name: 'Sem pasta', items: orphans });

  return (
    <div className="mx-auto w-full max-w-[1500px] px-6 py-8">
      {/* header */}
      <header className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-fox-500 to-fox-700 shadow-glow-fox"
            aria-label="Ir para o site"
          >
            <span className="font-display font-bold text-white text-lg">F</span>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">Projetos</h1>
            <p className="text-sm text-midnight-200">
              Gestão de obras · {projects.length} {projects.length === 1 ? 'projeto' : 'projetos'} ·{' '}
              {folders.length} {folders.length === 1 ? 'pasta' : 'pastas'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            leftIcon={<FolderPlus className="h-4 w-4" />}
            onClick={() => setDialog({ kind: 'new-folder' })}
          >
            Nova pasta
          </Button>
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setDialog({ kind: 'new-project' })}
          >
            Novo projeto
          </Button>
        </div>
      </header>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-32 text-midnight-200">
          <Loader2 className="h-7 w-7 animate-spin text-fox-400" />
          <p className="text-sm">Carregando projetos…</p>
        </div>
      ) : sections.length === 0 ? (
        <Empty
          icon={Inbox}
          title="Nenhum projeto ainda"
          description="Crie sua primeira pasta e projeto para começar."
          action={
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setDialog({ kind: 'new-project' })}>
              Novo projeto
            </Button>
          }
        />
      ) : (
        <div className="space-y-10">
          {sections.map((sec) => (
            <section key={sec.id ?? ORPHAN}>
              <div className="flex items-center gap-2 mb-4">
                <FolderIcon className="h-4 w-4 text-fox-300" strokeWidth={1.75} />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-midnight-100">
                  {sec.name}
                </h2>
                <span className="text-xs text-midnight-300">({sec.items.length})</span>
                {sec.id && (
                  <div className="ml-1 flex items-center gap-0.5">
                    <IconButton
                      icon={<Pencil className="h-3.5 w-3.5" />}
                      label="Renomear pasta"
                      onClick={() => setDialog({ kind: 'rename-folder', id: sec.id!, name: sec.name })}
                    />
                    <IconButton
                      icon={<Trash2 className="h-3.5 w-3.5" />}
                      label="Excluir pasta"
                      tone="danger"
                      onClick={() => setDialog({ kind: 'delete-folder', id: sec.id!, name: sec.name })}
                    />
                  </div>
                )}
              </div>

              {sec.items.length === 0 ? (
                <p className="text-sm text-midnight-300 italic pl-6">Pasta vazia.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {sec.items.map((p) => (
                    <ProjectCard
                      key={p.id}
                      project={p}
                      menuOpen={menuId === p.id}
                      onToggleMenu={() => setMenuId((id) => (id === p.id ? null : p.id))}
                      onCloseMenu={() => setMenuId(null)}
                      onRename={() => setDialog({ kind: 'rename-project', id: p.id, name: p.name })}
                      onMove={() =>
                        setDialog({ kind: 'move-project', id: p.id, name: p.name, folderId: p.folderId })
                      }
                      onDuplicate={() => setDialog({ kind: 'duplicate-project', id: p.id, name: p.name })}
                      onDelete={() => setDialog({ kind: 'delete-project', id: p.id, name: p.name })}
                    />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}

      {/* dialogs */}
      <NameDialog
        open={dialog?.kind === 'new-folder'}
        title="Nova pasta"
        label="Nome da pasta"
        confirmLabel="Criar pasta"
        busy={busy}
        onClose={() => setDialog(null)}
        onConfirm={(name) => handleNewFolder(name)}
      />
      <NameDialog
        open={dialog?.kind === 'rename-folder'}
        title="Renomear pasta"
        label="Nome da pasta"
        confirmLabel="Salvar"
        initial={dialog?.kind === 'rename-folder' ? dialog.name : ''}
        busy={busy}
        onClose={() => setDialog(null)}
        onConfirm={(name) =>
          dialog?.kind === 'rename-folder' && handleRenameFolder(dialog.id, name)
        }
      />
      <NameDialog
        open={dialog?.kind === 'rename-project'}
        title="Renomear projeto"
        label="Nome do projeto"
        confirmLabel="Salvar"
        initial={dialog?.kind === 'rename-project' ? dialog.name : ''}
        busy={busy}
        onClose={() => setDialog(null)}
        onConfirm={(name) =>
          dialog?.kind === 'rename-project' && handleRenameProject(dialog.id, name)
        }
      />

      {/* new project (name + folder) */}
      <NewProjectDialog
        open={dialog?.kind === 'new-project'}
        folders={folders}
        busy={busy}
        onClose={() => setDialog(null)}
        onConfirm={(name, folderId) => handleNewProject(name, folderId)}
      />

      {/* move project */}
      <MoveDialog
        open={dialog?.kind === 'move-project'}
        folders={folders}
        current={dialog?.kind === 'move-project' ? dialog.folderId : null}
        name={dialog?.kind === 'move-project' ? dialog.name : ''}
        busy={busy}
        onClose={() => setDialog(null)}
        onConfirm={(folderId) =>
          dialog?.kind === 'move-project' && handleMoveProject(dialog.id, folderId)
        }
      />

      {/* duplicate */}
      <DuplicateDialog
        open={dialog?.kind === 'duplicate-project'}
        name={dialog?.kind === 'duplicate-project' ? dialog.name : ''}
        busy={busy}
        onClose={() => setDialog(null)}
        onConfirm={(withData) =>
          dialog?.kind === 'duplicate-project' && handleDuplicate(dialog.id, withData)
        }
      />

      {/* delete confirmations */}
      <ConfirmDialog
        open={dialog?.kind === 'delete-folder'}
        title="Excluir pasta"
        message={
          dialog?.kind === 'delete-folder'
            ? `Excluir a pasta "${dialog.name}"? Os projetos dentro dela voltam para "Sem pasta" (não serão apagados).`
            : ''
        }
        confirmLabel="Excluir pasta"
        busy={busy}
        onClose={() => setDialog(null)}
        onConfirm={() => dialog?.kind === 'delete-folder' && handleDeleteFolder(dialog.id)}
      />
      <ConfirmDialog
        open={dialog?.kind === 'delete-project'}
        title="Excluir projeto"
        message={
          dialog?.kind === 'delete-project'
            ? `Excluir o projeto "${dialog.name}"? Esta ação não pode ser desfeita.`
            : ''
        }
        confirmLabel="Excluir projeto"
        busy={busy}
        onClose={() => setDialog(null)}
        onConfirm={() => dialog?.kind === 'delete-project' && handleDeleteProject(dialog.id)}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Project card                                                        */
/* ------------------------------------------------------------------ */

function ProjectCard({
  project,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  onRename,
  onMove,
  onDuplicate,
  onDelete,
}: {
  project: ProjectSummary;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onRename: () => void;
  onMove: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={cn(
        'group relative glass rounded-2xl p-5 transition-all hover:bg-white/[0.04] hover:-translate-y-0.5',
        menuOpen && 'z-50',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/admin/projeto/${project.id}`}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-fox-500/20 to-fox-600/10 ring-1 ring-fox-500/20 text-fox-200"
        >
          <LayoutGrid className="h-5 w-5" strokeWidth={1.75} />
        </Link>
        <div className="relative">
          <IconButton
            icon={<MoreVertical className="h-4 w-4" />}
            label="Ações"
            onClick={onToggleMenu}
          />
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={onCloseMenu} />
              <div className="absolute right-0 top-9 z-50 w-52 overflow-hidden rounded-xl border border-white/10 bg-midnight-800 py-1.5 shadow-2xl shadow-black/60">
                <MenuItem icon={<Copy className="h-4 w-4" />} label="Duplicar" onClick={() => { onCloseMenu(); onDuplicate(); }} />
                <MenuItem icon={<FolderInput className="h-4 w-4" />} label="Mover para pasta" onClick={() => { onCloseMenu(); onMove(); }} />
                <MenuItem icon={<Pencil className="h-4 w-4" />} label="Renomear" onClick={() => { onCloseMenu(); onRename(); }} />
                <div className="my-1 h-px bg-white/[0.06]" />
                <MenuItem icon={<Trash2 className="h-4 w-4" />} label="Excluir" danger onClick={() => { onCloseMenu(); onDelete(); }} />
              </div>
            </>
          )}
        </div>
      </div>

      <Link href={`/admin/projeto/${project.id}`} className="block mt-4">
        <h3 className="text-base font-semibold text-white truncate group-hover:text-fox-100 transition-colors">
          {project.name}
        </h3>
        <p className="mt-1 text-xs text-midnight-300">
          Atualizado em {formatDate(project.updatedAt)}
        </p>
      </Link>

      <Link
        href={`/admin/projeto/${project.id}`}
        className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-fox-300 hover:text-fox-200"
      >
        Abrir dashboard <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors',
        danger
          ? 'text-rose-300 hover:bg-rose-500/10 hover:text-rose-200'
          : 'text-midnight-100 hover:bg-white/[0.05] hover:text-white',
      )}
    >
      {icon}
      {label}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Dialogs                                                             */
/* ------------------------------------------------------------------ */

function NameDialog({
  open,
  title,
  label,
  confirmLabel,
  initial = '',
  busy,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  label: string;
  confirmLabel: string;
  initial?: string;
  busy: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
}) {
  const [value, setValue] = useState(initial);
  useEffect(() => {
    if (open) setValue(initial);
  }, [open, initial]);

  return (
    <Modal open={open} onClose={onClose} title={title} width="sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim()) onConfirm(value.trim());
        }}
      >
        <Field label={label}>
          <Input autoFocus value={value} onChange={(e) => setValue(e.target.value)} placeholder={label} />
        </Field>
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={busy || !value.trim()}>
            {confirmLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function NewProjectDialog({
  open,
  folders,
  busy,
  onClose,
  onConfirm,
}: {
  open: boolean;
  folders: Folder[];
  busy: boolean;
  onClose: () => void;
  onConfirm: (name: string, folderId: string | null) => void;
}) {
  const [name, setName] = useState('');
  const [folderId, setFolderId] = useState<string>('');
  useEffect(() => {
    if (open) {
      setName('');
      setFolderId(folders[0]?.id ?? '');
    }
  }, [open, folders]);

  return (
    <Modal open={open} onClose={onClose} title="Novo projeto" width="sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim()) onConfirm(name.trim(), folderId || null);
        }}
      >
        <div className="space-y-4">
          <Field label="Nome do projeto">
            <Input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: 10° João Silva" />
          </Field>
          <Field label="Pasta">
            <Select value={folderId} onChange={(e) => setFolderId(e.target.value)}>
              <option value="">Sem pasta</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={busy || !name.trim()}>
            Criar projeto
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function MoveDialog({
  open,
  folders,
  current,
  name,
  busy,
  onClose,
  onConfirm,
}: {
  open: boolean;
  folders: Folder[];
  current: string | null;
  name: string;
  busy: boolean;
  onClose: () => void;
  onConfirm: (folderId: string | null) => void;
}) {
  const [folderId, setFolderId] = useState<string>(current ?? '');
  useEffect(() => {
    if (open) setFolderId(current ?? '');
  }, [open, current]);

  return (
    <Modal open={open} onClose={onClose} title={`Mover "${name}"`} width="sm">
      <Field label="Mover para a pasta">
        <Select value={folderId} onChange={(e) => setFolderId(e.target.value)}>
          <option value="">Sem pasta</option>
          {folders.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </Select>
      </Field>
      <div className="mt-5 flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button disabled={busy} onClick={() => onConfirm(folderId || null)}>
          Mover
        </Button>
      </div>
    </Modal>
  );
}

function DuplicateDialog({
  open,
  name,
  busy,
  onClose,
  onConfirm,
}: {
  open: boolean;
  name: string;
  busy: boolean;
  onClose: () => void;
  onConfirm: (withData: boolean) => void;
}) {
  const [withData, setWithData] = useState(true);
  useEffect(() => {
    if (open) setWithData(true);
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} title={`Duplicar "${name}"`} width="sm">
      <p className="text-sm text-midnight-200 mb-4">O que copiar do projeto?</p>
      <div className="space-y-2">
        <RadioRow
          checked={withData}
          onChange={() => setWithData(true)}
          title="Com os dados"
          desc="Copia colunas e todas as linhas preenchidas."
        />
        <RadioRow
          checked={!withData}
          onChange={() => setWithData(false)}
          title="Só a estrutura"
          desc="Copia apenas as colunas (planilhas vazias)."
        />
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button disabled={busy} onClick={() => onConfirm(withData)}>
          Duplicar
        </Button>
      </div>
    </Modal>
  );
}

function RadioRow({
  checked,
  onChange,
  title,
  desc,
}: {
  checked: boolean;
  onChange: () => void;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        'flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all',
        checked
          ? 'border-fox-500/40 bg-fox-500/10'
          : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]',
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded-full border-2',
          checked ? 'border-fox-400' : 'border-midnight-300',
        )}
      >
        {checked && <span className="h-2 w-2 rounded-full bg-fox-400" />}
      </span>
      <span>
        <span className="block text-sm font-medium text-white">{title}</span>
        <span className="block text-xs text-midnight-300">{desc}</span>
      </span>
    </button>
  );
}

function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  busy,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  busy: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} width="sm">
      <p className="text-sm text-midnight-100">{message}</p>
      <div className="mt-5 flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="danger" disabled={busy} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* utils                                                               */
/* ------------------------------------------------------------------ */

function summaryOf(p: { id: string; name: string; folderId: string | null; createdAt: string; updatedAt: string }): ProjectSummary {
  return { id: p.id, name: p.name, folderId: p.folderId, createdAt: p.createdAt, updatedAt: p.updatedAt };
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return '—';
  }
}

function errorMessage(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  if (/permission|insufficient/i.test(msg)) {
    return 'Sem permissão no Firestore. Verifique se o banco foi criado e as regras publicadas (firestore.rules).';
  }
  if (/offline|network|unavailable/i.test(msg)) {
    return 'Não foi possível conectar ao Firestore. Verifique a conexão e se o banco está ativo.';
  }
  return `Erro: ${msg}`;
}
