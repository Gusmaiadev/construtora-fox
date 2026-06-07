'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, UserCog, Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { updateMyAccount, authErrorMessage } from '@/lib/firebase/auth';
import { Button } from '@/components/dashboard/ui/Button';
import { Input, Field } from '@/components/dashboard/ui/Input';

export function AccountSettings() {
  const { admin, loading, refreshProfile, isSuper } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (admin) {
      setName(admin.name);
      setEmail(admin.email);
    }
  }, [admin]);

  if (loading || !admin) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-midnight-200">
        <Loader2 className="h-6 w-6 animate-spin text-fox-400" />
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    if (password && password !== confirm) {
      setError('A confirmação de senha não confere.');
      return;
    }
    if (password && password.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setBusy(true);
    try {
      await updateMyAccount({
        name,
        email,
        password: password || undefined,
      });
      await refreshProfile();
      setPassword('');
      setConfirm('');
      setSaved(true);
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[640px] px-6 py-8">
      <header className="flex items-center gap-3 mb-8">
        <Link href="/admin" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.06] text-midnight-100 hover:text-white hover:bg-white/[0.08] transition" aria-label="Voltar">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            <UserCog className="h-5 w-5 text-fox-300" /> Minha conta
          </h1>
          <p className="text-sm text-midnight-200">{isSuper ? 'Administrador Principal' : 'Administrador'}</p>
        </div>
      </header>

      <form onSubmit={submit} className="glass rounded-2xl p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nome"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
          <Field label="E-mail"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        </div>

        <div className="pt-2 border-t border-white/[0.06]">
          <p className="text-xs uppercase tracking-wider text-midnight-300 mb-3 mt-3">Alterar senha (opcional)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nova senha"><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" /></Field>
            <Field label="Confirmar senha"><Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" autoComplete="new-password" /></Field>
          </div>
        </div>

        {error && <p className="text-sm text-rose-300">{error}</p>}
        {saved && (
          <p className="inline-flex items-center gap-1.5 text-sm text-emerald-300">
            <Check className="h-4 w-4" /> Alterações salvas.
          </p>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={busy || !name.trim() || !email.trim()}>
            {busy ? 'Salvando…' : 'Salvar alterações'}
          </Button>
        </div>
      </form>

      <p className="mt-3 text-xs text-midnight-300">
        Por segurança, alterar e-mail ou senha pode exigir um login recente. Se aparecer esse aviso, saia e entre novamente.
      </p>
    </div>
  );
}
