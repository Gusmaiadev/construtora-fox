/**
 * Inicialização do Firebase (cliente).
 *
 * O `firebaseConfig` é público por natureza — vai embutido no bundle do
 * navegador. A proteção dos dados depende das REGRAS do Firestore.
 *
 * ⚠️ Conforme definido, o projeto está SEM autenticação no momento, então as
 * regras do Firestore devem permitir acesso aberto (veja firestore.rules).
 * Quando quiser proteger, basta adicionar Firebase Auth + regras por usuário.
 */
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, initializeFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA_mPE_5RTG6QUEPPyfacw4LzOdAJTYRiY',
  authDomain: 'construtora-fox-c8f1b.firebaseapp.com',
  projectId: 'construtora-fox-c8f1b',
  storageBucket: 'construtora-fox-c8f1b.firebasestorage.app',
  messagingSenderId: '229146422502',
  appId: '1:229146422502:web:b66a28d032608987fe5f27',
};

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// `ignoreUndefinedProperties` evita erros ao gravar objetos com campos
// opcionais ausentes (ex.: `description`). initializeFirestore só pode rodar
// uma vez — em re-execuções (HMR) caímos no getFirestore.
let db: Firestore;
try {
  db = initializeFirestore(app, { ignoreUndefinedProperties: true });
} catch {
  db = getFirestore(app);
}

export { app, db };
