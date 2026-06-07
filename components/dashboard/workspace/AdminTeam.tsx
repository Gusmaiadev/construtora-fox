'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Trash2,
  ShieldCheck,
  FolderKey,
  Loader2,
  Users,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  listAdmins,
  createAdmin,
  removeAdmin,
  setProjectAccess,
  authErrorMessage,
} from '@/lib/firebase/auth';
import { listProjects } from '@/lib/firebase/repository';
import type { Admin } from '@/types/auth';
import type { ProjectSummary } from '@/types/workspace';
import { Button } from '@/components/dashboard/ui/Button';
import { Modal } from '@/components/dashboard/ui/Modal';
import { Input, Field } from '@/components/dashboard/ui/Input';
import { cn } from '@/lib/cn';

export function AdminTeam() {
  const { admin, isSuper, loading: authLoading } = useAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [dialog, setDialog] = useState<'new' | { kind: 'access'; admin: Admin } | { kind: 'remove'; admin: Admin } | null>(null);

  const reload = async () => {
    setLoading(true);
    try {
      const [a, p] = await Promise.all([
        listAdmins(),
        listProjects({ uid: admin!.uid, isSuper: true }),
      ]);
      setAdmins(a);
      setProjects(p);
    } catch (e) {
      setError(authErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin && isSuper) reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin, isSuper]);

  if (authLoading) return null;
  if (!isSuper) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-6">
        <ShieldCheck className="h-8 w-8 text-midnight-300" />
        <p className="text-sm text-midnight-200 max-w-sm">
          Apenas o Administrador Principal pode gerenciar a equipe.
        </p>
        <Link href="/admin">
          <Button variant="ghost" leftIcon={<ArrowLeft className="h-4 w-4" />}>Voltar aos projetos</Button>
        </Link>
      </div>
    );
  }

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      setDialog(null);
      await reload();
    } catch (e) {
      setError(authErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1100px] px-6 py-8">
      <header className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.06] text-midnight-100 hover:text-white hover:bg-white/[0.08] transition" aria-label="Voltar">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-fox-300" /> Equipe
            </h1>
            <p className="text-sm text-midnight-200">{admins.length} {admins.length === 1 ? 'administrador' : 'administradores'}</p>
          </div>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setDialog('new')}>
          Novo administrador
        </Button>
      </header>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-3 py-24 text-midnight-200">
          <Loader2 className="h-6 w-6 animate-spin text-fox-400" /> Carregando…
        </div>
      ) : (
        <div className="space-y-3">
          {admins.map((a) => (
            <div key={a.uid} className="glass rounded-2xl p-4 flex flex-wrap items-center gap-4">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-fox-500 to-fox-700 text-sm font-bold text-white">
                {(a.name || a.email).charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white truncate">{a.name}</h3>
                  {a.role === 'super' ? (
                    <Badge tone="fox">Principal</Badge>
                  ) : (
                    <Badge>Admin</Badge>
                  )}
                </div>
                <p className="text-xs text-midnight-300 truncate">{a.email}</p>
              </div>
              <div className="text-xs text-midnight-200">
                {a.role === 'super' ? (
                  <span className="text-fox-200">Todos os projetos</span>
                ) : (
                  <span>{a.projectIds.length} {a.projectIds.length === 1 ? 'projeto' : 'projetos'}</span>
                )}
              </div>
              {a.role !== 'super' && (
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" leftIcon={<FolderKey className="h-4 w-4" />} onClick={() => setDialog({ kind: 'access', admin: a })}>
                    Acesso
                  </Button>
                  <Button size="sm" variant="ghost" leftIcon={<Trash2 className="h-4 w-4" />} onClick={() => setDialog({ kind: 'remove', admin: a })}>
                    Remover
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <NewAdminDialog
        open={dialog === 'new'}
        projects={projects}
        busy={busy}
        onClose={() => setDialog(null)}
        onConfirm={(input) => run(() => createAdmin(input).then(() => {}))}
      />
      <AccessDialog
        open={typeof dialog === 'object' && dialog?.kind === 'access'}
        admin={typeof dialog === 'object' && dialog?.kind === 'access' ? dialog.admin : null}
        projects={projects}
        busy={busy}
        onClose={() => setDialog(null)}
        onConfirm={(uid, ids) => run(() => setProjectAccess(uid, ids))}
      />
      <Modal
        open={typeof dialog === 'object' && dialog?.kind === 'remove'}
        onClose={() => setDialog(null)}
        title="Remover administrador"
        width="sm"
      >
        {typeof dialog === 'object' && dialog?.kind === 'remove' && (
          <>
            <p className="text-sm text-midnight-100">
              Remover o acesso de <strong className="text-white">{dialog.admin.name}</strong>? Ele deixa de ver os projetos. (A conta de login só é apagada de fato na Fase 2.)
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setDialog(null)}>Cancelar</Button>
              <Button variant="danger" disabled={busy} onClick={() => run(() => removeAdmin(dialog.admin))}>
                Remover
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

function Badge({ children, tone }: { children: React.ReactNode; tone?: 'fox' }) {
  return (
    <span className={cn('inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider', tone === 'fox' ? 'bg-fox-500/15 text-fox-200' : 'bg-white/[0.06] text-midnight-100')}>
      {children}
    </span>
  );
}

function ProjectPicker({ projects, selected, onToggle }: { projects: ProjectSummary[]; selected: Set<string>; onToggle: (id: string) => void }) {
  return (
    <div className="max-h-56 overflow-auto rounded-xl border border-white/[0.06] divide-y divide-white/[0.04]">
      {projects.length === 0 && <p className="px-3 py-3 text-xs text-midnight-300">Nenhum projeto cadastrado.</p>}
      {projects.map((p) => {
        const on = selected.has(p.id);
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onToggle(p.id)}
            className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-white/[0.03] transition"
          >
            <span className={cn('flex h-4 w-4 flex-none items-center justify-center rounded border', on ? 'bg-fox-500 border-fox-500' : 'border-midnight-300')}>
              {on && <span className="text-[10px] font-bold text-white">✓</span>}
            </span>
            <span className="truncate text-midnight-100">{p.name}</span>
          </button>
        );
      })}
    </div>
  );
}

function NewAdminDialog({ open, projects, busy, onClose, onConfirm }: {
  open: boolean;
  projects: ProjectSummary[];
  busy: boolean;
  onClose: () => void;
  onConfirm: (input: { name: string; email: string; password: string; projectIds: string[] }) => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (open) { setName(''); setEmail(''); setPassword(''); setSelected(new Set()); }
  }, [open]);

  const toggle = (id: string) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <Modal open={open} onClose={onClose} title="Novo administrador" width="md">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Nome"><Input value={name} onChange={(e) => setName(e.target.value)} autoFocus placeholder="Nome do admin" /></Field>
          <Field label="E-mail"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@empresa.com" /></Field>
        </div>
        <Field label="Senha" hint="Mínimo de 6 caracteres."><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" /></Field>
        <div>
          <span className="block text-xs font-medium text-midnight-200 mb-1.5 uppercase tracking-wide">Projetos com acesso</span>
          <ProjectPicker projects={projects} selected={selected} onToggle={toggle} />
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button
          disabled={busy || !name.trim() || !email.trim() || password.length < 6}
          onClick={() => onConfirm({ name, email, password, projectIds: [...selected] })}
        >
          {busy ? 'Criando…' : 'Criar administrador'}
        </Button>
      </div>
    </Modal>
  );
}

function AccessDialog({ open, admin, projects, busy, onClose, onConfirm }: {
  open: boolean;
  admin: Admin | null;
  projects: ProjectSummary[];
  busy: boolean;
  onClose: () => void;
  onConfirm: (uid: string, projectIds: string[]) => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  useEffect(() => {
    if (open && admin) setSelected(new Set(admin.projectIds));
  }, [open, admin]);
  const toggle = (id: string) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <Modal open={open} onClose={onClose} title={admin ? `Acesso de ${admin.name}` : 'Acesso'} width="md">
      <span className="block text-xs font-medium text-midnight-200 mb-1.5 uppercase tracking-wide">Projetos com acesso</span>
      <ProjectPicker projects={projects} selected={selected} onToggle={toggle} />
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button disabled={busy} onClick={() => admin && onConfirm(admin.uid, [...selected])}>
          {busy ? 'Salvando…' : 'Salvar acesso'}
        </Button>
      </div>
    </Modal>
  );
}
