'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { type ReactNode } from 'react';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ icon: Icon, title, subtitle, actions }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-end justify-between gap-4 mb-6 flex-wrap"
    >
      <div className="flex items-end gap-4">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-fox-500/30 via-fox-600/20 to-purple-500/10 ring-1 ring-white/10 flex items-center justify-center shadow-glow-fox">
          <Icon className="h-6 w-6 text-fox-300" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-semibold text-white tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-midnight-200 mt-1 max-w-xl">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </motion.div>
  );
}
