/**
 * Autenticação e gerenciamento de administradores.
 *
 * - Firebase Auth (e-mail/senha) cuida de identidade e senhas.
 * - Coleção `admins/{uid}` guarda o perfil (nome, role, projetos).
 * - `config/app` marca que o sistema já tem Super Admin (bootstrap feito).
 * - Acesso por projeto é desnormalizado em `projects/{id}.allowedAdmins` para
 *   permitir consulta filtrada respeitando as regras do Firestore.
 */
import { initializeApp, deleteApp } from 'firebase/app';
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  updateEmail,
  updatePassword,
  getAuth,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  getDocs,
  collection,
  writeBatch,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { auth, db, firebaseConfig } from './config';
import type { Admin } from '@/types/auth';

const ADMINS = 'admins';
const CONFIG_DOC = ['config', 'app'] as const;

function now(): string {
  return new Date().toISOString();
}

/* ------------------------------------------------------------------ */
/* Bootstrap / sessão                                                  */
/* ------------------------------------------------------------------ */

/** O sistema já tem um Super Admin? (se não, mostramos o cadastro inicial) */
export async function isInitialized(): Promise<boolean> {
  const snap = await getDoc(doc(db, CONFIG_DOC[0], CONFIG_DOC[1]));
  return snap.exists();
}

export async function signIn(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function signOutAdmin(): Promise<void> {
  await signOut(auth);
}

/** Cria o primeiro administrador (Super Admin) e marca o sistema como iniciado. */
export async function createSuperAdmin(name: string, email: string, password: string): Promise<void> {
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const uid = cred.user.uid;
  await updateProfile(cred.user, { displayName: name }).catch(() => {});
  const batch = writeBatch(db);
  batch.set(doc(db, ADMINS, uid), {
    name: name.trim(),
    email: email.trim(),
    role: 'super',
    projectIds: [],
    createdAt: now(),
  });
  batch.set(doc(db, CONFIG_DOC[0], CONFIG_DOC[1]), {
    initialized: true,
    superAdminUid: uid,
    createdAt: now(),
  });
  await batch.commit();
}

/* ------------------------------------------------------------------ */
/* Perfis                                                              */
/* ------------------------------------------------------------------ */

export async function getAdminProfile(uid: string): Promise<Admin | null> {
  const snap = await getDoc(doc(db, ADMINS, uid));
  if (!snap.exists()) return null;
  return { uid, ...(snap.data() as Omit<Admin, 'uid'>) };
}

export async function listAdmins(): Promise<Admin[]> {
  const snap = await getDocs(collection(db, ADMINS));
  return snap.docs
    .map((d) => ({ uid: d.id, ...(d.data() as Omit<Admin, 'uid'>) }))
    .sort((a, b) => {
      if (a.role !== b.role) return a.role === 'super' ? -1 : 1;
      return a.name.localeCompare(b.name, 'pt-BR');
    });
}

interface CreateAdminInput {
  name: string;
  email: string;
  password: string;
  projectIds: string[];
}

/**
 * Super Admin cria um novo admin. Usa um app Firebase secundário para criar a
 * conta sem trocar a sessão do Super Admin. O perfil é gravado com a sessão
 * principal (autorizada pelas regras como Super Admin).
 */
export async function createAdmin(input: CreateAdminInput): Promise<Admin> {
  const secondary = initializeApp(firebaseConfig, `admin-create-${Date.now()}`);
  try {
    const secAuth = getAuth(secondary);
    const cred = await createUserWithEmailAndPassword(secAuth, input.email.trim(), input.password);
    const uid = cred.user.uid;
    await updateProfile(cred.user, { displayName: input.name }).catch(() => {});

    const admin: Admin = {
      uid,
      name: input.name.trim(),
      email: input.email.trim(),
      role: 'admin',
      projectIds: input.projectIds,
      createdAt: now(),
    };

    const batch = writeBatch(db);
    batch.set(doc(db, ADMINS, uid), {
      name: admin.name,
      email: admin.email,
      role: 'admin',
      projectIds: admin.projectIds,
      createdAt: admin.createdAt,
    });
    for (const pid of input.projectIds) {
      batch.update(doc(db, 'projects', pid), { allowedAdmins: arrayUnion(uid) });
    }
    await batch.commit();

    await signOut(secAuth).catch(() => {});
    return admin;
  } finally {
    await deleteApp(secondary).catch(() => {});
  }
}

/** Remove o perfil e o acesso do admin (a conta de login permanece até a Fase 2). */
export async function removeAdmin(admin: Admin): Promise<void> {
  const batch = writeBatch(db);
  for (const pid of admin.projectIds) {
    batch.update(doc(db, 'projects', pid), { allowedAdmins: arrayRemove(admin.uid) });
  }
  batch.delete(doc(db, ADMINS, admin.uid));
  await batch.commit();
}

/** Atualiza os projetos de um admin, sincronizando `allowedAdmins` nos projetos. */
export async function setProjectAccess(uid: string, projectIds: string[]): Promise<void> {
  const ref = doc(db, ADMINS, uid);
  const snap = await getDoc(ref);
  const old = ((snap.data()?.projectIds as string[]) ?? []);
  const added = projectIds.filter((id) => !old.includes(id));
  const removed = old.filter((id) => !projectIds.includes(id));
  const batch = writeBatch(db);
  batch.update(ref, { projectIds });
  for (const id of added) batch.update(doc(db, 'projects', id), { allowedAdmins: arrayUnion(uid) });
  for (const id of removed) batch.update(doc(db, 'projects', id), { allowedAdmins: arrayRemove(uid) });
  await batch.commit();
}

/* ------------------------------------------------------------------ */
/* Conta própria                                                       */
/* ------------------------------------------------------------------ */

interface AccountUpdate {
  name?: string;
  email?: string;
  password?: string;
}

export async function updateMyAccount(patch: AccountUpdate): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('Sessão expirada. Faça login novamente.');

  if (patch.password) await updatePassword(user, patch.password);
  if (patch.email && patch.email.trim() !== user.email) await updateEmail(user, patch.email.trim());
  if (patch.name) await updateProfile(user, { displayName: patch.name }).catch(() => {});

  const profilePatch: Record<string, string> = {};
  if (patch.name !== undefined) profilePatch.name = patch.name.trim();
  if (patch.email !== undefined) profilePatch.email = patch.email.trim();
  if (Object.keys(profilePatch).length) await updateDoc(doc(db, ADMINS, user.uid), profilePatch);
}

/** Mensagens de erro amigáveis para o Firebase Auth. */
export function authErrorMessage(e: unknown): string {
  const code = (e as { code?: string })?.code ?? '';
  const map: Record<string, string> = {
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/invalid-email': 'E-mail inválido.',
    'auth/user-not-found': 'Usuário não encontrado.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
    'auth/requires-recent-login': 'Por segurança, saia e entre de novo antes de alterar e-mail/senha.',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde um pouco e tente de novo.',
    'auth/network-request-failed': 'Falha de conexão. Verifique a internet.',
    'auth/operation-not-allowed': 'Ative o login por E-mail/Senha no console do Firebase.',
  };
  if (map[code]) return map[code];
  if (/permission|insufficient/i.test(String((e as Error)?.message))) {
    return 'Sem permissão. Verifique as regras do Firestore (firestore.rules).';
  }
  return (e as Error)?.message ?? 'Erro inesperado.';
}
