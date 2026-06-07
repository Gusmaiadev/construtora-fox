/**
 * Camada de acesso a dados (Firestore) do workspace multi-projeto.
 *
 * Coleções:
 *   folders/{id}   -> { name, createdAt }
 *   projects/{id}  -> { name, folderId, createdAt, updatedAt, state: ProjectState }
 *
 * Cada projeto é um dashboard completo (ProjectState — modelo "8ª Yanna").
 */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from './config';
import { uid } from '@/lib/id';
import type {
  BudgetCategory,
  CellValue,
  CeramicSpec,
  DataSheet,
  Measurement,
  ProjectState,
  Row,
} from '@/types/domain';
import type { DuplicateOptions, Folder, Project, ProjectSummary } from '@/types/workspace';
import { buildEmptyState, buildStateFromImport, type ImportedProject } from '@/lib/store/buildState';
import importedRaw from '@/lib/data/imported-projects.json';

const FOLDERS = 'folders';
const PROJECTS = 'projects';
const DEFAULT_FOLDER_NAME = 'Projetos';

function now(): string {
  return new Date().toISOString();
}

/* ------------------------------------------------------------------ */
/* Folders                                                             */
/* ------------------------------------------------------------------ */

export async function listFolders(): Promise<Folder[]> {
  const snap = await getDocs(collection(db, FOLDERS));
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<Folder, 'id'>) }))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function createFolder(name: string): Promise<Folder> {
  const ref = doc(collection(db, FOLDERS));
  const folder: Folder = { id: ref.id, name: name.trim() || 'Nova pasta', createdAt: now() };
  await setDoc(ref, { name: folder.name, createdAt: folder.createdAt });
  return folder;
}

export async function renameFolder(id: string, name: string): Promise<void> {
  await updateDoc(doc(db, FOLDERS, id), { name: name.trim() || 'Pasta' });
}

/** Remove a pasta e solta os projetos dela (folderId = null). */
export async function deleteFolder(id: string): Promise<void> {
  const projects = await listProjects();
  const batch = writeBatch(db);
  for (const p of projects) {
    if (p.folderId === id) batch.update(doc(db, PROJECTS, p.id), { folderId: null });
  }
  batch.delete(doc(db, FOLDERS, id));
  await batch.commit();
}

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export async function listProjects(): Promise<ProjectSummary[]> {
  const snap = await getDocs(collection(db, PROJECTS));
  return snap.docs
    .map((d) => {
      const data = d.data() as Omit<Project, 'id'>;
      return {
        id: d.id,
        name: data.name,
        folderId: data.folderId ?? null,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      } satisfies ProjectSummary;
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
}

export async function getProject(id: string): Promise<Project | null> {
  const d = await getDoc(doc(db, PROJECTS, id));
  if (!d.exists()) return null;
  const data = d.data() as Omit<Project, 'id'>;
  return {
    id: d.id,
    name: data.name,
    folderId: data.folderId ?? null,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    state: data.state,
  };
}

interface CreateProjectInput {
  name: string;
  folderId: string | null;
  state?: ProjectState;
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  const ref = doc(collection(db, PROJECTS));
  const ts = now();
  const name = input.name.trim() || 'Novo projeto';
  const state = input.state ?? buildEmptyState(name);
  // mantém o nome exibido em sincronia com o dos Ajustes
  state.project = { ...state.project, name };
  const project: Project = {
    id: ref.id,
    name,
    folderId: input.folderId,
    createdAt: ts,
    updatedAt: ts,
    state,
  };
  await setDoc(ref, stripId(project));
  return project;
}

export async function renameProject(id: string, name: string): Promise<void> {
  const trimmed = name.trim() || 'Projeto';
  await updateDoc(doc(db, PROJECTS, id), {
    name: trimmed,
    'state.project.name': trimmed,
    updatedAt: now(),
  });
}

export async function moveProject(id: string, folderId: string | null): Promise<void> {
  await updateDoc(doc(db, PROJECTS, id), { folderId, updatedAt: now() });
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, PROJECTS, id));
}

/** Salva o estado completo do dashboard (sincroniza o nome no nível superior). */
export async function saveProjectState(id: string, state: ProjectState): Promise<void> {
  await updateDoc(doc(db, PROJECTS, id), {
    state,
    name: state.project.name,
    updatedAt: now(),
  });
}

export async function duplicateProject(source: Project, opts: DuplicateOptions): Promise<Project> {
  return createProject({
    name: `${source.name} (cópia)`,
    folderId: source.folderId,
    state: cloneState(source.state, opts.withData),
  });
}

/* ------------------------------------------------------------------ */
/* Seed — importa as planilhas .ods na primeira vez                    */
/* ------------------------------------------------------------------ */

const imported = importedRaw as unknown as ImportedProject[];

export async function seedIfEmpty(): Promise<boolean> {
  const existing = await getDocs(collection(db, PROJECTS));
  if (!existing.empty) return false;

  const folder = await createFolder(DEFAULT_FOLDER_NAME);
  const batch = writeBatch(db);
  for (const ip of imported) {
    const ref = doc(collection(db, PROJECTS));
    const ts = now();
    const project: Omit<Project, 'id'> = {
      name: ip.name,
      folderId: folder.id,
      createdAt: ts,
      updatedAt: ts,
      state: buildStateFromImport(ip),
    };
    batch.set(ref, project);
  }
  await batch.commit();
  return true;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function stripId<T extends { id: string }>(obj: T): Omit<T, 'id'> {
  const { id: _omit, ...rest } = obj;
  return rest;
}

function cloneSheet(s: DataSheet, withData: boolean): DataSheet {
  const ts = now();
  const columns = s.columns.map((c) => ({ ...c, id: uid() }));
  let rows: Row[];
  if (withData) {
    rows = s.rows.map((r) => ({ id: uid(), values: { ...r.values }, createdAt: ts, updatedAt: ts }));
  } else {
    // "Só a estrutura": mantém as linhas (as Saídas/itens), mas limpa as
    // colunas de valor (currency) e data — em todas as tabelas.
    const clearKeys = new Set(
      s.columns.filter((c) => c.type === 'currency' || c.type === 'date').map((c) => c.key),
    );
    rows = s.rows.map((r) => {
      const values: Record<string, CellValue> = {};
      for (const [k, v] of Object.entries(r.values)) {
        values[k] = clearKeys.has(k) ? null : v;
      }
      return { id: uid(), values, createdAt: ts, updatedAt: ts };
    });
  }
  const sheet: DataSheet = { id: uid(), name: s.name, columns, rows };
  if (s.description) sheet.description = s.description;
  return sheet;
}

function cloneState(s: ProjectState, withData: boolean): ProjectState {
  // "Só estrutura" = mantém as colunas das tabelas, mas zera tudo o resto,
  // inclusive as informações do projeto (Ajustes).
  const project = withData
    ? { ...s.project }
    : { ...s.project, code: '', dimensions: '', budget: 0, investment: 0 };
  return {
    schemaVersion: s.schemaVersion,
    project,
    documentation: cloneSheet(s.documentation, withData),
    materials: cloneSheet(s.materials, withData),
    labor: cloneSheet(s.labor, withData),
    extraLabor: cloneSheet(s.extraLabor, withData),
    clientExtras: cloneSheet(s.clientExtras, withData),
    measurements: withData
      ? s.measurements.map((m) => ({ ...m, id: uid() }) as Measurement)
      : [],
    budgetBreakdown: withData
      ? s.budgetBreakdown.map((b) => ({ ...b, id: uid() }) as BudgetCategory)
      : [],
    ceramics: withData ? s.ceramics.map((c) => ({ ...c, id: uid() }) as CeramicSpec) : [],
    meta: { lastUpdated: now() },
  };
}
