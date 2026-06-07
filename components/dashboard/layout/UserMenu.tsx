'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Users, UserCog, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { signOutAdmin } from '@/lib/firebase/auth';

export function UserMenu() {
  const { admin, isSuper } = useAuth();
  const [open, setOpen] = useState(false);
  if (!admin) return null;

  const name = admin.name;
  const email = admin.email;
  const initial = (name || email || '?').trim().charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] pl-2 pr-2.5 py-1.5 text-sm text-midnight-100 hover:bg-white/[0.06] hover:text-white transition"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-fox-500 to-fox-700 text-xs font-bold text-white">
          {initial}
        </span>
        <span className="hidden md:block max-w-[140px] truncate text-left">{name || email}</span>
        <ChevronDown className="h-4 w-4 text-midnight-300" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 z-50 w-60 overflow-hidden rounded-xl border border-white/10 bg-midnight-800 py-1.5 shadow-2xl shadow-black/60">
            <div className="px-3 py-2 border-b border-white/[0.06]">
              <div className="text-sm font-medium text-white truncate">{name}</div>
              <div className="text-xs text-midnight-300 truncate">{email}</div>
              <div className="mt-1 inline-flex items-center rounded-md bg-fox-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-fox-200">
                {isSuper ? 'Administrador Principal' : 'Administrador'}
              </div>
            </div>
            <Link
              href="/admin/conta"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-midnight-100 hover:bg-white/[0.05] hover:text-white transition"
            >
              <UserCog className="h-4 w-4" /> Minha conta
            </Link>
            {isSuper && (
              <Link
                href="/admin/equipe"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-midnight-100 hover:bg-white/[0.05] hover:text-white transition"
              >
                <Users className="h-4 w-4" /> Equipe (admins)
              </Link>
            )}
            <div className="my-1 h-px bg-white/[0.06]" />
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                signOutAdmin();
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition"
            >
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </>
      )}
    </div>
  );
}
