// Acrescenta o projeto "8° Yanna" ao imported-projects.json usando os dados
// limpos originais (mesma fonte do antigo seed.ts — a planilha .xlsx tem datas
// em formato serial do Excel, então usamos os valores já consolidados).
import { readFileSync, writeFileSync } from 'node:fs';

const path = new URL('./lib/data/imported-projects.json', import.meta.url);

const documentation = [
  ['SEMAN', '2025-10-01', 90.45],
  ['Ordem de serviço', '2025-10-07', 750],
  ['Atualização Matrícula', '2025-10-09', 112.6],
  ['Atualização Matrícula', '2025-10-24', 112.6],
  ['ISS', '2025-10-28', 976.64],
  ['TEO', '2025-10-28', 44.85],
  ['IPTU', '2025-10-28', 40.11],
  ['Projeto Engenheiro', '2025-10-30', 600],
  ['Seguro Caixa', '2025-11-03', 1930],
  ['Averbação', '2025-11-10', 5533.56],
  ['Corretor Luciano 3%', '2025-11-15', 4200],
];

const materials = [
  ['Ferros', '2025-10-29', 1940.34], ['Pia WC / Tanquinho', '2025-10-31', 244], ['Tijolos', '2025-11-06', 4200],
  ['Blocos', '2025-11-18', 4000], ['Manta Asfáltica', '2025-11-19', 230], ['Brocha', '2025-11-19', 12],
  ['Cimento', '2025-11-19', 2526], ['Luzes', '2025-11-24', 168], ['Acal', '2025-11-24', 200],
  ['Treliças', '2025-11-25', 515], ['Cimento', '2025-12-17', 1407.33], ['Caixa de Água', '2025-12-17', 399.9],
  ['Telhas', '2025-12-17', 1250], ['Ferros', '2025-12-17', 737.5], ['Cimento', '2025-12-17', 2167.2],
  ['Treliças e Telhas', '2025-12-19', 1983.33], ['Forras', '2025-12-20', 600], ['Granitos', '2025-12-22', 600],
  ['Natal Graças', '2025-12-24', 160], ['Cimento', '2025-12-29', 560], ['Madeiramento Telhado', '2025-12-29', 2880],
  ['Goiano', '2025-12-29', 20], ['Caixa de Correio', '2026-01-06', 24], ['Caixa de Energia', '2026-01-19', 179.19],
  ['Telhas', '2026-01-21', 480], ['Fio de Conexão', '2026-01-21', 100], ['Água Hidráulica', '2026-01-23', 634.16],
  ['Energia', '2026-01-23', 467.96], ['Cimento', '2026-01-23', 225], ['Isopor Lage', '2026-01-23', 724.8],
  ['Lage', '2026-01-23', 2153.66], ['Portão Frente', '2026-01-26', 2400], ['Vaso Banheiro', '2026-02-04', 699.8],
  ['Chuv, Torn, Parafuso Vaso', '2026-02-04', 175.69], ['Pia Cozinha', '2026-02-04', 0], ['Kit Banheiro', '2026-02-04', 87.64],
  ['Água Material', '2025-12-30', 333.33], ['Mini Poste', '2025-12-30', 78], ['Louça', '2025-12-30', 8],
  ['Haste Aterramento', '2025-12-30', 60], ['Caixa de Teto', '2025-12-30', 26], ['Instalação Energia', '2025-12-30', 234.6],
  ['Cimento Apodi', '2025-12-30', 75], ['Isopor Lage', '2025-12-30', 652.8], ['Escorras Laje', '2025-12-30', 266.87],
  ['Argamassa AC II', '2026-02-09', 623], ['Fios', '2026-02-10', 350], ['Depósito', '2026-02-11', 411.54],
  ['Rejunte Branco', '2026-02-26', 120.6], ['Tao', '2026-03-04', 358.37], ['Pia Granito', '2026-03-11', 500],
  ['Depósito', '2026-03-16', 950.93], ['Tintas', '2026-03-17', 1926.98], ['Portas e Janelas de Vidros', '2026-03-17', 3000],
  ['Areia', '2026-03-17', 452], ['Tijolo', '2026-03-17', 1473.33], ['Barro', '2026-03-17', 340],
  ['Brita', '2026-03-17', 816.67], ['Extra', '2026-03-17', 1000], ['Cerâmica Aurora', '2026-03-17', 2668.07],
  ['Rejunte Preto', '2026-03-17', 99.5], ['AC3', '2026-03-18', 537], ['Porcelanato Preto', '2026-03-18', 1000],
  ['Portas dos Quartos', '2026-03-30', 1850], ['Água Casas', '2026-04-08', 953], ['Depósito', '2026-04-14', 216],
  ['Depósito', '2026-04-14', 70], ['Depósito', '2026-04-20', 300],
];

const labor = [
  [1, '2025-11-28', 6500, 'Medição'], [2, '2025-12-10', 300, 'Adiantamento'], [3, '2025-12-24', 5000, 'Medição'],
  [4, '2025-12-31', 5500, 'Medição'], [5, '2026-01-16', 6500, 'Medição'], [6, null, 2768, 'Medição'],
];

const extraLabor = [
  [1, '2025-12-25', 1200, 'Hidráulica'], [2, '2026-01-26', 1300, 'Gesso'],
  [3, '2026-04-23', 1200, 'Pintura'], [4, '2026-04-23', 650, 'Elétrica'],
];

const clientExtras = [
  ['Fachada Extra', 2075], ['8 Arandelas', 280], ['Nicho', 140], ['Cerâmica', 2385.3],
];

const measurements = [
  { order: 1, type: 'Terreno', value: 23900, date: '2025-09-15' },
  { order: 2, type: 'Medição', value: 36425.93, date: '2025-11-30' },
  { order: 3, type: 'Medição', value: 29942.01, date: '2025-12-30' },
  { order: 4, type: 'Medição', value: 0, date: null },
  { order: 5, type: 'Medição', value: 0, date: null },
  { order: 6, type: 'Medição', value: 0, date: null },
];

const budgetBreakdown = [
  { category: 'Corretagem', value: 5600 }, { category: 'Mão de obra', value: 32500 },
  { category: 'Documentação', value: 11000 }, { category: 'Material', value: 65000 }, { category: 'Terreno', value: 10000 },
];

const ceramics = [
  { area: 'Parede Cozinha', size: '18 m²', type: 'Aurora Branca' },
  { area: 'Parede Box', size: '8 m²', type: 'Porcelanato' },
  { area: 'Balcão', size: '2,5 m²', type: 'Porcelanato' },
  { area: 'Fachada', size: '6 m²', type: 'Porcelanato' },
  { area: 'Casa Geral', size: '68 m²', type: 'Aurora Branca' },
  { area: 'Banheiro', size: '5 m²', type: 'Ipanema' },
  { area: 'Box Antiaderente', size: '1,5 m²', type: 'Antiderrapante Branco' },
];

const yanna = {
  name: '8° Yanna',
  project: { name: '8° Yanna', code: '8ª Casa', dimensions: '5,60 × 25,00 m', budget: 150000, investment: 26568 },
  documentation: documentation.map(([name, date, value]) => ({ name, date, value })),
  materials: materials.map(([name, date, value]) => ({ name, date, value })),
  labor: labor.map(([order, date, value, description]) => ({ order, date, value, description })),
  extraLabor: extraLabor.map(([order, date, value, description]) => ({ order, date, value, description })),
  clientExtras: clientExtras.map(([name, value]) => ({ name, value })),
  measurements,
  budgetBreakdown,
  ceramics,
};

const arr = JSON.parse(readFileSync(path, 'utf8')).filter((p) => p.name !== '8° Yanna');
arr.push(yanna);
arr.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
writeFileSync(path, JSON.stringify(arr), 'utf8');
console.log(`Total projetos: ${arr.length}`);
console.log(`Yanna -> doc=${yanna.documentation.length} mat=${yanna.materials.length} lab=${yanna.labor.length} xlab=${yanna.extraLabor.length} med=${yanna.measurements.length} cer=${yanna.ceramics.length} cli=${yanna.clientExtras.length}`);
