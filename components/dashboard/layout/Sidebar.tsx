'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  HardHat,
  Hammer,
  Sparkles,
  Settings,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { BrandLogo } from '@/components/dashboard/ui/BrandLogo';

interface NavItem {
  suffix: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

const NAV: NavItem[] = [
  { suffix: '', label: 'Visão Geral', icon: LayoutDashboard, description: 'KPIs e gráficos' },
  { suffix: 'documentacao', label: 'Documentação', icon: FileText, description: 'Taxas e regularização' },
  { suffix: 'materiais', label: 'Materiais', icon: HardHat, description: 'Compras da obra' },
  { suffix: 'mao-de-obra', label: 'Mão de Obra', icon: Hammer, description: 'Pagamentos e medições' },
  { suffix: 'extras', label: 'Extras', icon: Sparkles, description: 'Adicionais e acabamentos' },
  { suffix: 'ajustes', label: 'Ajustes', icon: Settings, description: 'Projeto e dados' },
];

interface SidebarProps {
  /** Aberto no mobile (overlay). No desktop fica sempre visível. */
  open: boolean;
  projectId: string;
}

export function Sidebar({ open, projectId }: SidebarProps) {
  const pathname = usePathname();
  const base = `/admin/projeto/${projectId}`;

  const isActive = (suffix: string): boolean => {
    if (!pathname) return false;
    const href = suffix ? `${base}/${suffix}` : base;
    if (!suffix) return pathname === base;
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <aside
      className={cn(
        'h-screen w-[264px] shrink-0 z-50 transition-transform duration-300 ease-out',
        // Mobile: overlay fixo que desliza; Desktop: fixo na coluna (sticky).
        'fixed inset-y-0 left-0',
        'lg:sticky lg:inset-auto lg:top-0 lg:z-30 lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      <div className="flex h-full flex-col glass-strong border-r border-white/[0.06]">
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/[0.06]">
          <Link href="/admin" className="flex-none" aria-label="Voltar aos projetos">
            <BrandLogo size={38} />
          </Link>
          <div className="min-w-0">
            <div className="font-display font-semibold text-white text-sm tracking-tight">
              Construtora Fox
            </div>
            <div className="text-[11px] text-midnight-200 -mt-0.5">Painel de Obras</div>
          </div>
        </div>

        <div className="px-2 pt-3">
          <Link
            href="/admin"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-midnight-100 hover:bg-white/[0.04] hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4 flex-none" />
            <span>Todos os projetos</span>
          </Link>
        </div>

        <nav className="flex-1 px-2 py-3 overflow-y-auto no-scrollbar">
          <div className="space-y-1">
            {NAV.map((item) => {
              const active = isActive(item.suffix);
              const href = item.suffix ? `${base}/${item.suffix}` : base;
              return (
                <Link
                  key={item.suffix || 'home'}
                  href={href}
                  className={cn(
                    'group relative w-full flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-xl transition-all',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fox-500/40',
                    active
                      ? 'text-white bg-gradient-to-r from-fox-500/20 via-fox-500/10 to-transparent ring-1 ring-fox-500/30'
                      : 'text-midnight-100 hover:bg-white/[0.04] hover:text-white',
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-fox-400 to-fox-600" />
                  )}
                  <item.icon
                    className={cn('h-5 w-5 flex-none', active ? 'text-fox-300' : '')}
                    strokeWidth={1.5}
                  />
                  <div className="flex-1 text-left min-w-0">
                    <div className="text-sm font-medium truncate">{item.label}</div>
                    <div className="text-[11px] text-midnight-300 truncate">{item.description}</div>
                  </div>
                  {active && <ChevronRight className="h-4 w-4 text-fox-300 flex-none" />}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-white/[0.02]">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-[11px] font-bold text-white">
              ON
            </div>
            <div className="text-[11px] text-midnight-200 leading-tight">
              <div className="text-emerald-300 font-medium">Sistema online</div>
              <div>Sincronizado · Firestore</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
