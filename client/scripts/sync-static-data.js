// Gera, dentro de client/public/api/, uma cópia estática das mesmas
// respostas que server/index.js serve dinamicamente em /api/overview e
// /api/paineis/:id. Isso permite publicar client/dist como site 100%
// estático (GitHub Pages) sem tocar em client/src/api.js: os caminhos
// fetch('/api/overview') e fetch('/api/paineis/:id') continuam os mesmos,
// só que respondidos por arquivos em vez do Express.
//
// Fonte de verdade continua sendo server/data/*.json — rode este script
// sempre que esses arquivos mudarem antes de gerar o build de GitHub Pages
// (o script "build:pages" já faz isso automaticamente).

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "..", "server", "data");
const OUT_DIR = path.join(__dirname, "..", "public", "api");

const PANEL_IDS = [
  "diagnostico",
  "valoracao",
  "remuneracao",
  "unit-commitment",
  "servicos-ancilares",
  "politicas",
];

mkdirSync(path.join(OUT_DIR, "paineis"), { recursive: true });

function copyJson(sourceFile, destFile) {
  const raw = readFileSync(path.join(DATA_DIR, sourceFile), "utf-8");
  JSON.parse(raw); // valida antes de publicar
  writeFileSync(destFile, raw);
}

copyJson("meta.json", path.join(OUT_DIR, "overview"));
for (const id of PANEL_IDS) {
  copyJson(`${id}.json`, path.join(OUT_DIR, "paineis", id));
}

console.log(`Dados estáticos gerados em ${path.relative(process.cwd(), OUT_DIR)}`);
