'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Loader2, LogIn, ShieldCheck, LogOut, MailCheck, KeyRound, RefreshCw } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  signIn,
  createSuperAdmin,
  isInitialized,
  signOutAdmin,
  authErrorMessage,
} from '@/lib/firebase/auth';
import { auth } from '@/lib/firebase/config';
import { Button } from '@/components/dashboard/ui/Button';
import { Input, Field } from '@/components/dashboard/ui/Input';
import { BrandLogo } from '@/components/dashboard/ui/BrandLogo';

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, admin, loading } = useAuth();
  const [initialized, setInitialized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      isInitialized()
        .then(setInitialized)
        .catch(() => setInitialized(true));
    }
  }, [loading, user]);

  if (loading) return <FullScreenLoader label="Carregando…" />;

  if (user && admin) return <TwoFactorGate>{children}</TwoFactorGate>;

  // Logado mas sem perfil ainda: pode ser a corrida do cadastro inicial
  // (perfil acabou de ser gravado). Re-verifica antes de concluir "Sem acesso".
  if (user && !admin) return <ProfileRecheck />;

  // não logado
  if (initialized === null) return <FullScreenLoader label="Carregando…" />;
  return (
    <AuthShell>{initialized ? <LoginForm /> : <BootstrapForm />}</AuthShell>
  );
}

function FullScreenLoader({ label }: { label: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center text-midnight-200">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-7 w-7 animate-spin text-fox-400" />
        <p className="text-sm">{label}</p>
      </div>
    </div>
  );
}

function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <BrandLogo size={64} />
          <h1 className="mt-4 text-xl font-semibold text-white">Construtora Fox</h1>
          <p className="text-sm text-midnight-200">Painel de gestão de obras</p>
        </div>
        <div className="glass-strong rounded-2xl p-6">{children}</div>
      </div>
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn(email, password);
      // onAuthStateChanged cuida da transição para o painel.
    } catch (err) {
      setError(authErrorMessage(err));
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-white">Entrar</h2>
        <p className="text-xs text-midnight-200 mt-0.5">Acesse com seu e-mail e senha.</p>
      </div>
      <Field label="E-mail">
        <Input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@empresa.com" autoFocus />
      </Field>
      <Field label="Senha">
        <Input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
      </Field>
      {error && <p className="text-sm text-rose-300">{error}</p>}
      <Button type="submit" className="w-full" disabled={busy || !email || !password} leftIcon={<LogIn className="h-4 w-4" />}>
        {busy ? 'Entrando…' : 'Entrar'}
      </Button>
    </form>
  );
}

function BootstrapForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await createSuperAdmin(name, email, password);
    } catch (err) {
      setError(authErrorMessage(err));
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex items-start gap-2">
        <ShieldCheck className="h-5 w-5 text-fox-300 mt-0.5 flex-none" />
        <div>
          <h2 className="text-base font-semibold text-white">Criar conta principal</h2>
          <p className="text-xs text-midnight-200 mt-0.5">
            Esta é a primeira conta — será o <strong className="text-white">Administrador Principal</strong>, com acesso a todos os projetos.
          </p>
        </div>
      </div>
      <Field label="Nome">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" autoFocus />
      </Field>
      <Field label="E-mail">
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@empresa.com" />
      </Field>
      <Field label="Senha" hint="Mínimo de 6 caracteres.">
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
      </Field>
      {error && <p className="text-sm text-rose-300">{error}</p>}
      <Button type="submit" className="w-full" disabled={busy || !name || !email || password.length < 6}>
        {busy ? 'Criando…' : 'Criar Administrador Principal'}
      </Button>
    </form>
  );
}

/** Re-verifica o perfil algumas vezes (cobre a corrida do cadastro). */
function ProfileRecheck() {
  const { refreshProfile } = useAuth();
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (let i = 0; i < 5 && !cancelled; i++) {
        await new Promise((r) => setTimeout(r, 600));
        await refreshProfile();
        // Se o perfil aparecer, o AuthGate (pai) re-renderiza e some com este componente.
      }
      if (!cancelled) setDone(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshProfile]);

  if (!done) return <FullScreenLoader label="Verificando acesso…" />;
  return <NoAccess />;
}

function NoAccess() {
  const { user } = useAuth();
  return (
    <AuthShell>
      <div className="text-center space-y-4">
        <h2 className="text-base font-semibold text-white">Sem acesso</h2>
        <p className="text-sm text-midnight-200">
          Esta conta {user?.email ? <strong className="text-white">({user.email})</strong> : null} não tem acesso ao painel. Use a conta do Administrador Principal, ou peça para liberarem seu acesso.
        </p>
        <Button variant="ghost" className="w-full" leftIcon={<LogOut className="h-4 w-4" />} onClick={() => signOutAdmin()}>
          Sair e entrar com outra conta
        </Button>
      </div>
    </AuthShell>
  );
}

/* ------------------------------------------------------------------ */
/* 2FA por e-mail (verificação em duas etapas)                         */
/* ------------------------------------------------------------------ */

async function getIdToken(): Promise<string> {
  const u = auth.currentUser;
  if (!u) throw new Error('Sessão expirada. Entre novamente.');
  return u.getIdToken();
}

function TwoFactorGate({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<'checking' | 'need' | 'ok'>('checking');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const idToken = await getIdToken();
        const r = await fetch('/api/2fa/status', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ idToken }),
        });
        const j = await r.json();
        if (active) setPhase(j.trusted ? 'ok' : 'need');
      } catch {
        if (active) setPhase('need');
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (phase === 'checking') return <FullScreenLoader label="Verificando dispositivo…" />;
  if (phase === 'ok') return <>{children}</>;
  return <TwoFactorScreen onVerified={() => setPhase('ok')} />;
}

function TwoFactorScreen({ onVerified }: { onVerified: () => void }) {
  const [code, setCode] = useState('');
  const [maskedEmail, setMaskedEmail] = useState<string | null>(null);
  const [sending, setSending] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const sentRef = useRef(false);

  const send = async () => {
    setSending(true);
    setError(null);
    setInfo(null);
    try {
      const idToken = await getIdToken();
      const r = await fetch('/api/2fa/send', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? 'Falha ao enviar o código.');
      setMaskedEmail(j.email ?? null);
      setInfo('Código enviado. Verifique seu e-mail.');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (sentRef.current) return;
    sentRef.current = true;
    send();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setError(null);
    try {
      const idToken = await getIdToken();
      const r = await fetch('/api/2fa/verify', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ idToken, code }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? 'Código inválido.');
      onVerified();
    } catch (err) {
      setError((err as Error).message);
      setVerifying(false);
    }
  };

  return (
    <AuthShell>
      <form onSubmit={verify} className="space-y-4">
        <div className="flex items-start gap-2">
          <ShieldCheck className="h-5 w-5 text-fox-300 mt-0.5 flex-none" />
          <div>
            <h2 className="text-base font-semibold text-white">Verificação em duas etapas</h2>
            <p className="text-xs text-midnight-200 mt-0.5">
              {sending ? (
                'Enviando código…'
              ) : maskedEmail ? (
                <>
                  Enviamos um código para <strong className="text-white">{maskedEmail}</strong>.
                </>
              ) : (
                'Enviamos um código para o seu e-mail.'
              )}
            </p>
          </div>
        </div>
        <Field label="Código de 6 dígitos">
          <Input
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            autoFocus
            className="text-center text-lg font-mono tracking-[0.4em]"
          />
        </Field>
        {error && <p className="text-sm text-rose-300">{error}</p>}
        {info && !error && (
          <p className="inline-flex items-center gap-1.5 text-sm text-emerald-300">
            <MailCheck className="h-4 w-4" /> {info}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={verifying || code.length < 6} leftIcon={<KeyRound className="h-4 w-4" />}>
          {verifying ? 'Verificando…' : 'Confirmar'}
        </Button>
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={send}
            disabled={sending}
            className="inline-flex items-center gap-1.5 text-xs text-midnight-200 hover:text-white disabled:opacity-50"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Reenviar código
          </button>
          <button
            type="button"
            onClick={() => signOutAdmin()}
            className="inline-flex items-center gap-1.5 text-xs text-midnight-300 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" /> Sair
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
