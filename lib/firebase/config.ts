/**
 * Inicialização do Firebase (cliente): Firestore + Authentication.
 *
 * O `firebaseConfig` é público por natureza — vai no bundle do navegador. A
 * proteção dos dados vem do Firebase Auth (login) + das REGRAS do Firestore.
 */
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from 'firebase/firestore';
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
//
// No navegador ligamos o CACHE LOCAL PERSISTENTE (IndexedDB): as leituras
// passam a ser servidas instantaneamente do cache e revalidadas em segundo
// plano — loads e reaberturas de projeto ficam muito mais rápidos. No
// servidor (SSR/build) não há IndexedDB, então usamos o Firestore padrão.
let db: Firestore;
try {
  db =
    typeof window === 'undefined'
      ? initializeFirestore(app, { ignoreUndefinedProperties: true })
      : initializeFirestore(app, {
          ignoreUndefinedProperties: true,
          localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager(),
          }),
        });
} catch {
  db = getFirestore(app);
}

export const auth: Auth = getAuth(app);
export { app, db };
