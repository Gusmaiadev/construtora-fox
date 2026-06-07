/**
 * Modelo do "workspace" multi-projeto.
 *
 * Estrutura: Pastas (Folder) contêm Projetos (Project). Cada projeto é um
 * dashboard completo (ProjectState — o mesmo modelo do painel "8ª Yanna":
 * documentação, materiais, mão de obra, extras, medições, orçamento, cerâmica).
 *
 * Persistência: Firestore (coleções `folders` e `projects`).
 */
import type { ID, ProjectState } from './domain';

export interface Folder {
  id: ID;
  name: string;
  createdAt: string;
}

/** Campos leves usados na listagem do /admin (sem o estado completo). */
export interface ProjectSummary {
  id: ID;
  name: string;
  /** Pasta a que pertence; `null` = solto (sem pasta). */
  folderId: ID | null;
  createdAt: string;
  updatedAt: string;
}

/** Projeto completo, com o estado do dashboard. */
export interface Project extends ProjectSummary {
  state: ProjectState;
}

/** Opções de duplicação de projeto. */
export interface DuplicateOptions {
  /** Mantém as linhas (dados). Se `false`, copia só a estrutura/colunas. */
  withData: boolean;
}
