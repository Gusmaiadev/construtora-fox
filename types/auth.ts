/**
 * Modelo de administradores e controle de acesso.
 *
 * Coleção `admins/{uid}` no Firestore. O primeiro admin criado é o Super Admin
 * (role 'super'), com acesso a todos os projetos. Os demais (role 'admin')
 * acessam apenas os projetos atribuídos (`projectIds`).
 */
import type { ID } from './domain';

export type AdminRole = 'super' | 'admin';

export interface Admin {
  /** ID do usuário no Firebase Auth. */
  uid: ID;
  name: string;
  email: string;
  role: AdminRole;
  /** Projetos a que tem acesso (Super Admin vê todos, independente desta lista). */
  projectIds: ID[];
  createdAt: string;
}
