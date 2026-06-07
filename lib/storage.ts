/**
 * Persistência local com tratamento de erros e versionamento de schema.
 *
 * Estrutura preparada para troca futura por API: o ProjectStore consome
 * apenas `load`/`save` — basta substituir por chamadas HTTP.
 */
import type { ProjectState } from '@/types/domain';
import { buildInitialState } from '@/lib/store/seed';

const STORAGE_KEY = 'fox-dashboard:state';
const CURRENT_SCHEMA = 1;

function isProjectState(v: unknown): v is ProjectState {
  return (
    typeof v === 'object' &&
    v !== null &&
    'schemaVersion' in v &&
    'project' in v &&
    'documentation' in v
  );
}

export const storage = {
  load(): ProjectState {
    if (typeof window === 'undefined') return buildInitialState();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return buildInitialState();
      const parsed: unknown = JSON.parse(raw);
      if (!isProjectState(parsed)) return buildInitialState();
      if (parsed.schemaVersion !== CURRENT_SCHEMA) {
        return buildInitialState();
      }
      return parsed;
    } catch {
      return buildInitialState();
    }
  },
  save(state: ProjectState): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error('Falha ao salvar no LocalStorage:', err);
    }
  },
  reset(): ProjectState {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* noop */
      }
    }
    return buildInitialState();
  },
  exportJSON(state: ProjectState): string {
    return JSON.stringify(state, null, 2);
  },
};
