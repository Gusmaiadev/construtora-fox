'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface AppShellProps {
  children: ReactNode;
  projectId: string;
}

const SEG_META: Record<string, { title: string; subtitle: string }> = {
  '': { title: 'Visão Geral', subtitle: 'Indicadores do projeto em tempo real' },
  documentacao: { title: 'Documentação', subtitle: 'Taxas, regularização e custos iniciais' },
  materiais: { title: 'Materiais', subtitle: 'Compras, estoques e acabamentos' },
  'mao-de-obra': { title: 'Mão de Obra', subtitle: 'Pagamentos e medições da obra' },
  extras: { title: 'Extras & Acabamentos', subtitle: 'Adicionais cobrados e cerâmicas' },
  ajustes: { title: 'Ajustes', subtitle: 'Configurações do projeto e dados' },
};

export function AppShell({ children, projectId }: AppShellProps) {
  const [open, setOpen] = useState(false); // menu mobile (overlay)
  const pathname = usePathname();

  // Fecha o menu mobile ao trocar de página.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const base = `/admin/projeto/${projectId}`;
  const seg = (pathname ?? base).replace(base, '').replace(/^\//, '').split('/')[0] ?? '';
  const meta = SEG_META[seg] ?? { title: 'Construtora Fox', subtitle: 'Painel de gestão' };

  return (
    <div className="min-h-screen flex text-midnight-50">
      {/* Fundo escuro só no mobile quando o menu está aberto (fecha ao tocar) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <Sidebar open={open} projectId={projectId} />

      <div className="relative flex-1 flex flex-col min-w-0">
        <TopBar
          onToggleSidebar={() => setOpen((o) => !o)}
          pageTitle={meta.title}
          pageSubtitle={meta.subtitle}
        />
        <main className="flex-1 px-6 py-6 max-w-[1600px] w-full mx-auto">{children}</main>
        <footer className="px-6 py-4 border-t border-white/[0.04] text-xs text-midnight-300 text-center">
          Construtora Fox · Dashboard de Obras · Dados sincronizados no Firestore
        </footer>
      </div>
    </div>
  );
}
