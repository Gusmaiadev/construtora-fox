/**
 * Inicialização do Firebase (cliente): Firestore + Authentication.
 *
 * O `firebaseConfig` é público por natureza — vai no bundle do navegador. A
 * proteção dos dados vem do Firebase Auth (login) + das REGRAS do Firestore.
 */
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, initializeFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

// Lê do .env.local (NEXT_PUBLIC_*) com fallback para os valores do projeto —
// assim funciona mesmo sem o .env presente (os valores são públicos).
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? 'AIzaSyA_mPE_5RTG6QUEPPyfacw4LzOdAJTYRiY',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'construtora-fox-c8f1b.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'construtora-fox-c8f1b',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? 'construtora-fox-c8f1b.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '229146422502',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '1:229146422502:web:b66a28d032608987fe5f27',
};

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// `ignoreUndefinedProperties` evita erros ao gravar objetos com campos
// opcionais ausentes. initializeFirestore só roda uma vez (HMR -> getFirestore).
let db: Firestore;
try {
  db = initializeFirestore(app, { ignoreUndefinedProperties: true });
} catch {
  db = getFirestore(app);
}

export const auth: Auth = getAuth(app);
export { app, db };
