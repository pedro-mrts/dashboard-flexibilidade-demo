// Camada de acesso aos dados dinâmicos servidos pela API Node/Express
// (ver server/index.js). Em desenvolvimento, o Vite faz proxy de /api para
// http://localhost:4000 (vite.config.js). Em produção, o próprio servidor
// Express serve o build do React e a API a partir da mesma origem, então
// caminhos relativos funcionam nos dois casos.

// import.meta.env.BASE_URL (não uma string fixa) porque em GitHub Pages
// o site fica em um subpath, ex. /dashboard-flexibilidade-demo/api
const BASE_URL = `${import.meta.env.BASE_URL}api`;

async function getJson(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Falha ao buscar ${path}: HTTP ${res.status}`);
  }
  return res.json();
}

export function fetchOverview() {
  return getJson("/overview");
}

export function fetchPanel(id) {
  return getJson(`/paineis/${id}`);
}
