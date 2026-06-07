'use client';

import { type ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface AppShellProps {
  children: ReactNode;
}

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  '/admin': { title: 'Visão Geral', subtitle: 'Indicadores do projeto em tempo real' },
  '/admin/documentacao': { title: 'Documentação', subtitle: 'Taxas, regularização e custos iniciais' },
  '/admin/materiais': { title: 'Materiais', subtitle: 'Compras, estoques e acabamentos' },
  '/admin/mao-de-obra': { title: 'Mão de Obra', subtitle: 'Pagamentos e medições da obra' },
  '/admin/extras': { title: 'Extras & Acabamentos', subtitle: 'Adicionais cobrados e cerâmicas' },
  '/admin/ajustes': { title: 'Ajustes', subtitle: 'Configurações do projeto e dados' },
};

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const meta =
    PAGE_META[pathname ?? '/admin'] ?? { title: 'Construtora Fox', subtitle: 'Painel de gestão' };

  return (
    <div className="min-h-screen flex bg-midnight-950 text-midnight-50">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-fox-500/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute inset-0 grid-bg opacity-30" />
      </div>

      <Sidebar collapsed={collapsed} />

      <div className="relative flex-1 flex flex-col min-w-0">
        <TopBar
          onToggleSidebar={() => setCollapsed((c) => !c)}
          pageTitle={meta.title}
          pageSubtitle={meta.subtitle}
        />
        <main className="flex-1 px-6 py-6 max-w-[1600px] w-full mx-auto">{children}</main>
        <footer className="px-6 py-4 border-t border-white/[0.04] text-xs text-midnight-300 text-center">
          Construtora Fox · Dashboard de Obras · Dados persistidos localmente
        </footer>
      </div>
    </div>
  );
}
