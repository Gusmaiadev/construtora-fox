'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import type { ProjectState } from '@/types/domain';
import { storage } from '@/lib/storage';
import { reducer } from './reducer';
import type { Action } from './actions';

interface ProjectContextValue {
  state: ProjectState;
  dispatch: React.Dispatch<Action>;
  reset: () => void;
  exportJSON: () => string;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    reducer,
    undefined,
    () => storage.load(),
  );

  useEffect(() => {
    storage.save(state);
  }, [state]);

  const reset = useCallback(() => {
    const fresh = storage.reset();
    dispatch({ type: 'HYDRATE', state: fresh });
  }, []);

  const exportJSON = useCallback(() => storage.exportJSON(state), [state]);

  const value = useMemo<ProjectContextValue>(
    () => ({ state, dispatch, reset, exportJSON }),
    [state, reset, exportJSON],
  );

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProject(): ProjectContextValue {
  const ctx = useContext(ProjectContext);
  if (!ctx) {
    throw new Error('useProject deve ser usado dentro de <ProjectProvider>');
  }
  return ctx;
}
