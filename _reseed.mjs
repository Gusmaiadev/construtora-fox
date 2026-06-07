import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, getDocs, doc, setDoc, writeBatch,
} from 'firebase/firestore';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';

const firebaseConfig = {
  apiKey: 'AIzaSyA_mPE_5RTG6QUEPPyfacw4LzOdAJTYRiY',
  authDomain: 'construtora-fox-c8f1b.firebaseapp.com',
  projectId: 'construtora-fox-c8f1b',
  storageBucket: 'construtora-fox-c8f1b.firebasestorage.app',
  messagingSenderId: '229146422502',
  appId: '1:229146422502:web:b66a28d032608987fe5f27',
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const uid = () => randomUUID();
const now = () => new Date().toISOString();

const baseColumns = () => [
  { id: uid(), key: 'name', label: 'Saída', type: 'text', width: 280, locked: true },
  { id: uid(), key: 'date', label: 'Data', type: 'date', width: 140, locked: true },
  { id: uid(), key: 'value', label: 'Valor', type: 'currency', width: 140, locked: true },
];
const laborColumns = () => [
  { id: uid(), key: 'order', label: '#', type: 'number', width: 60, locked: true },
  { id: uid(), key: 'date', label: 'Data', type: 'date', width: 140, locked: true },
  { id: uid(), key: 'value', label: 'Valor', type: 'currency', width: 140, locked: true },
  { id: uid(), key: 'description', label: 'Especificação', type: 'text', width: 200, locked: true },
];
const clientExtrasColumns = () => [
  { id: uid(), key: 'name', label: 'Item', type: 'text', width: 240, locked: true },
  { id: uid(), key: 'value', label: 'Valor', type: 'currency', width: 140, locked: true },
];
const makeRow = (values) => ({ id: uid(), values, createdAt: now(), updatedAt: now() });
const sheet = (name, description, columns, rows) => ({ id: uid(), name, description, columns, rows });

function buildState(ip) {
  return {
    schemaVersion: 1,
    project: ip.project,
    documentation: sheet('Documentação Inicial', 'Despesas de documentação, taxas e regularização do imóvel', baseColumns(),
      (ip.documentation || []).map((r) => makeRow({ name: r.name, date: r.date ?? null, value: r.value }))),
    materials: sheet('Materiais da Construção', 'Materiais adquiridos para a obra', baseColumns(),
      (ip.materials || []).map((r) => makeRow({ name: r.name, date: r.date ?? null, value: r.value }))),
    labor: sheet('Mão de Obra', 'Pagamentos por medição da obra principal', laborColumns(),
      (ip.labor || []).map((r) => makeRow({ order: r.order, date: r.date ?? null, value: r.value, description: r.description }))),
    extraLabor: sheet('Mão de Obra Extra', 'Pagamentos avulsos: hidráulica, gesso, pintura, elétrica', laborColumns(),
      (ip.extraLabor || []).map((r) => makeRow({ order: r.order, date: r.date ?? null, value: r.value, description: r.description }))),
    clientExtras: sheet('Adicionais do Cliente', 'Itens cobrados como adicionais ao cliente', clientExtrasColumns(),
      (ip.clientExtras || []).map((r) => makeRow({ name: r.name, value: r.value }))),
    measurements: (ip.measurements || []).map((m) => ({ id: uid(), order: m.order, type: m.type, value: m.value, date: m.date ?? null })),
    budgetBreakdown: (ip.budgetBreakdown || []).map((b) => ({ id: uid(), category: b.category, value: b.value })),
    ceramics: (ip.ceramics || []).map((c) => ({ id: uid(), area: c.area, size: c.size, type: c.type })),
    meta: { lastUpdated: now() },
  };
}

async function wipe(name) {
  const snap = await getDocs(collection(db, name));
  if (snap.empty) return 0;
  const batch = writeBatch(db);
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  return snap.size;
}

try {
  const dp = await wipe('projects');
  const df = await wipe('folders');
  console.log(`Apagados: ${dp} projetos, ${df} pastas`);

  const folderRef = doc(collection(db, 'folders'));
  await setDoc(folderRef, { name: 'Projetos', createdAt: now() });

  const imported = JSON.parse(readFileSync(new URL('./lib/data/imported-projects.json', import.meta.url), 'utf8'));
  for (const ip of imported) {
    const ref = doc(collection(db, 'projects'));
    const ts = now();
    const st = buildState(ip);
    await setDoc(ref, { name: ip.name, folderId: folderRef.id, createdAt: ts, updatedAt: ts, state: st });
    console.log(`  + ${ip.name}  doc=${st.documentation.rows.length} mat=${st.materials.rows.length} lab=${st.labor.rows.length} med=${st.measurements.length}`);
  }
  console.log('OK reseed completo');
  process.exit(0);
} catch (e) {
  console.log('FAIL', e?.code || '', e?.message || String(e));
  process.exit(1);
}
