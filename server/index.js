// API do Dashboard do Projeto de Flexibilidade do SIN
//
// Serve, de forma dinâmica, os dados dos 6 painéis temáticos a partir de
// arquivos JSON em ./data. A ideia é que, no futuro, esses JSONs possam ser
// trocados por consultas a um banco de dados ou a fontes oficiais (ONS, EPE,
// ANEEL) sem que o front-end precise mudar: o contrato da API continua o mesmo.

const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;
const DATA_DIR = path.join(__dirname, "data");

app.use(cors());
app.use(express.json());

const PANEL_IDS = [
  "diagnostico",
  "valoracao",
  "remuneracao",
  "unit-commitment",
  "servicos-ancilares",
  "politicas",
];

function readJson(fileName) {
  const filePath = path.join(DATA_DIR, fileName);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

// Pequeno cache em memória: os arquivos são lidos uma vez e mantidos em
// memória, mas recarregados automaticamente se o arquivo mudar no disco —
// o que facilita atualizar os números do estudo sem precisar reiniciar o
// servidor (basta editar o JSON correspondente em server/data).
const cache = new Map();
function getPanelData(id) {
  const fileName = `${id}.json`;
  const filePath = path.join(DATA_DIR, fileName);
  const stat = fs.statSync(filePath);
  const cached = cache.get(id);
  if (cached && cached.mtimeMs === stat.mtimeMs) {
    return cached.data;
  }
  const data = readJson(fileName);
  cache.set(id, { data, mtimeMs: stat.mtimeMs });
  return data;
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Metadados gerais do projeto + índice dos 6 painéis (usado na home)
app.get("/api/overview", (_req, res) => {
  try {
    const meta = getPanelData("meta");
    res.json(meta);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Não foi possível carregar os metadados do projeto." });
  }
});

// Lista os IDs de painéis disponíveis
app.get("/api/paineis", (_req, res) => {
  res.json({ paineis: PANEL_IDS });
});

// Dados completos de um painel específico
app.get("/api/paineis/:id", (req, res) => {
  const { id } = req.params;
  if (!PANEL_IDS.includes(id)) {
    return res.status(404).json({ error: `Painel "${id}" não encontrado.` });
  }
  try {
    const data = getPanelData(id);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Não foi possível carregar o painel "${id}".` });
  }
});

// Em produção, serve também o build estático do React (client/dist), para
// que o mesmo processo Node consiga responder tanto pela API quanto pelas
// páginas — útil para publicar o dashboard como uma landing page única.
const clientDist = path.join(__dirname, "..", "client", "dist");
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get(/^(?!\/api\/).*/, (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`API do Dashboard de Flexibilidade rodando em http://localhost:${PORT}`);
});
