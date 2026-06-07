'use client';

import { Menu, RefreshCw, Download } from 'lucide-react';
import { Button } from '@/components/dashboard/ui/Button';
import { IconButton } from '@/components/dashboard/ui/IconButton';
import { UserMenu } from './UserMenu';
import { useProject } from '@/lib/store/ProjectContext';
import { useMemo, useState } from 'react';

interface TopBarProps {
  onToggleSidebar: () => void;
  pageTitle: string;
  pageSubtitle?: string;
}

export function TopBar({ onToggleSidebar, pageTitle, pageSubtitle }: TopBarProps) {
  const { state, exportJSON, reset } = useProject();
  const [confirmReset, setConfirmReset] = useState(false);

  const today = useMemo(
    () =>
      new Intl.DateTimeFormat('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
      }).format(new Date()),
    [],
  );

  const handleExport = () => {
    const data = exportJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fox-${state.project.code.replace(/\s+/g, '-').toLowerCase()}-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (confirmReset) {
      reset();
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 4000);
    }
  };

  return (
    <header className="sticky top-0 z-20 backdrop-blur-xl bg-midnight-950/40 border-b border-white/[0.05]">
      <div className="flex items-center gap-4 px-6 h-16">
        <IconButton
          icon={<Menu className="h-5 w-5" />}
          label="Alternar menu"
          onClick={onToggleSidebar}
        />

        <div className="hidden md:block">
          <h1 className="text-lg font-display font-semibold tracking-tight text-white">
            {pageTitle}
          </h1>
          <p className="text-xs text-midnight-200 -mt-0.5">{pageSubtitle ?? today}</p>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Download className="h-4 w-4" />}
            onClick={handleExport}
          >
            Exportar
          </Button>
          <Button
            variant={confirmReset ? 'danger' : 'ghost'}
            size="sm"
            leftIcon={<RefreshCw className="h-4 w-4" />}
            onClick={handleReset}
          >
            {confirmReset ? 'Confirmar?' : 'Resetar'}
          </Button>
          <div className="ml-1 hidden sm:block">
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
