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
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

const NAV: NavItem[] = [
  { href: '/admin', label: 'Visão Geral', icon: LayoutDashboard, description: 'KPIs e gráficos' },
  { href: '/admin/documentacao', label: 'Documentação', icon: FileText, description: 'Taxas e regularização' },
  { href: '/admin/materiais', label: 'Materiais', icon: HardHat, description: 'Compras da obra' },
  { href: '/admin/mao-de-obra', label: 'Mão de Obra', icon: Hammer, description: 'Pagamentos e medições' },
  { href: '/admin/extras', label: 'Extras', icon: Sparkles, description: 'Adicionais e acabamentos' },
  { href: '/admin/ajustes', label: 'Ajustes', icon: Settings, description: 'Projeto e dados' },
];

interface SidebarProps {
  collapsed: boolean;
}

function isActive(itemHref: string, pathname: string | null): boolean {
  if (!pathname) return false;
  if (itemHref === '/admin') return pathname === '/admin';
  return pathname === itemHref || pathname.startsWith(itemHref + '/');
}

export function Sidebar({ collapsed }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'h-screen sticky top-0 shrink-0 transition-[width] duration-300 ease-out z-30',
        collapsed ? 'w-[72px]' : 'w-[260px]',
      )}
    >
      <div className="flex h-full flex-col glass-strong border-r border-white/[0.06] rounded-none">
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/[0.06]">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fox-500 to-fox-700 shadow-glow-fox flex-none"
            aria-label="Ir para o site Construtora Fox"
          >
            <span className="font-display font-bold text-white text-base">F</span>
          </Link>
          {!collapsed && (
            <div className="min-w-0">
              <div className="font-display font-semibold text-white text-sm tracking-tight">
                Construtora Fox
              </div>
              <div className="text-[11px] text-midnight-200 -mt-0.5">Painel de Obras</div>
            </div>
          )}
        </div>

        <nav className="flex-1 px-2 py-4 overflow-y-auto no-scrollbar">
          <div className="space-y-1">
            {NAV.map((item) => {
              const active = isActive(item.href, pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fox-500/40',
                    active
                      ? 'text-white bg-gradient-to-r from-fox-500/20 via-fox-500/10 to-transparent ring-1 ring-fox-500/30'
                      : 'text-midnight-100 hover:bg-white/[0.04] hover:text-white',
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-gradient-to-b from-fox-400 to-fox-600 shadow-glow-fox"
                    />
                  )}
                  <item.icon className={cn('h-5 w-5 flex-none', active ? 'text-fox-300' : '')} strokeWidth={1.5} />
                  {!collapsed && (
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-sm font-medium truncate">{item.label}</div>
                      <div className="text-[11px] text-midnight-300 truncate">{item.description}</div>
                    </div>
                  )}
                  {!collapsed && active && <ChevronRight className="h-4 w-4 text-fox-300" />}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className={cn('p-3 border-t border-white/[0.06]', collapsed && 'px-2')}>
          <div
            className={cn(
              'flex items-center gap-3 px-2 py-2 rounded-xl bg-white/[0.02]',
              collapsed && 'justify-center px-0',
            )}
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-[11px] font-bold text-white">
              ON
            </div>
            {!collapsed && (
              <div className="text-[11px] text-midnight-200 leading-tight">
                <div className="text-emerald-300 font-medium">Sistema online</div>
                <div>Dados locais</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
