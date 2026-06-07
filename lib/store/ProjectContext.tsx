'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { ProjectState } from '@/types/domain';
import { reducer } from './reducer';
import type { Action } from './actions';
import { buildEmptyState } from './buildState';
import { getProject, saveProjectState } from '@/lib/firebase/repository';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface ProjectContextValue {
  state: ProjectState;
  dispatch: React.Dispatch<Action>;
  reset: () => void;
  exportJSON: () => string;
  saveStatus: SaveStatus;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({
  projectId,
  children,
}: {
  projectId: string;
  children: ReactNode;
}) {
  const [state, baseDispatch] = useReducer(reducer, null, () => buildEmptyState(''));
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const dirtyRef = useRef(false);

  // Carrega o estado do projeto do Firestore.
  useEffect(() => {
    let active = true;
    setLoaded(false);
    setError(null);
    dirtyRef.current = false;
    getProject(projectId)
      .then((p) => {
        if (!active) return;
        if (!p) {
          setError('Projeto não encontrado.');
          return;
        }
        baseDispatch({ type: 'HYDRATE', state: p.state });
        setLoaded(true);
      })
      .catch((e) => {
        if (active) setError(errorMessage(e));
      });
    return () => {
      active = false;
    };
  }, [projectId]);

  const dispatch = useCallback<React.Dispatch<Action>>((action) => {
    if (action.type !== 'HYDRATE') dirtyRef.current = true;
    baseDispatch(action);
  }, []);

  // Salva (debounced) quando o estado muda por edição do usuário.
  useEffect(() => {
    if (!loaded || !dirtyRef.current) return;
    setSaveStatus('saving');
    const t = setTimeout(() => {
      dirtyRef.current = false;
      saveProjectState(projectId, state)
        .then(() => setSaveStatus('saved'))
        .catch((e) => {
          setSaveStatus('error');
          setError(errorMessage(e));
        });
    }, 700);
    return () => clearTimeout(t);
  }, [state, loaded, projectId]);

  const reset = useCallback(() => {
    getProject(projectId)
      .then((p) => {
        if (p) {
          dirtyRef.current = false;
          baseDispatch({ type: 'HYDRATE', state: p.state });
          setSaveStatus('idle');
        }
      })
      .catch((e) => setError(errorMessage(e)));
  }, [projectId]);

  const exportJSON = useCallback(() => JSON.stringify(state, null, 2), [state]);

  const value = useMemo<ProjectContextValue>(
    () => ({ state, dispatch, reset, exportJSON, saveStatus }),
    [state, dispatch, reset, exportJSON, saveStatus],
  );

  if (error && !loaded) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-6">
        <p className="text-sm text-rose-200 max-w-md">{error}</p>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-midnight-100 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar aos projetos
        </Link>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center text-midnight-200">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-fox-400" />
          <p className="text-sm">Carregando projeto…</p>
        </div>
      </div>
    );
  }

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProject(): ProjectContextValue {
  const ctx = useContext(ProjectContext);
  if (!ctx) {
    throw new Error('useProject deve ser usado dentro de <ProjectProvider>');
  }
  return ctx;
}

function errorMessage(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  if (/permission|insufficient/i.test(msg)) {
    return 'Sem permissão no Firestore. Verifique as regras (firestore.rules).';
  }
  if (/offline|network|unavailable/i.test(msg)) {
    return 'Sem conexão com o Firestore. Verifique a internet e se o banco está ativo.';
  }
  return `Erro: ${msg}`;
}
