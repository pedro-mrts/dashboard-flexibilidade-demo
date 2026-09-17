# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Visão geral

Dashboard de divulgação (em português) dos resultados do projeto de pesquisa
"Otimização da Flexibilidade e Critérios de Rateio de Custos e Benefícios no
Sistema Elétrico". É um site com 6 painéis temáticos, voltado a público leigo,
no estilo visual do Instituto E+ Transição Energética.

Monorepo simples com duas pastas independentes, **sem workspace/monorepo tool**
(cada uma tem seu próprio `package.json` e `node_modules`):

- `server/` — API Node + Express que lê `server/data/*.json` e expõe
  `/api/overview`, `/api/paineis` e `/api/paineis/:id`.
- `client/` — front-end React 19 (Vite) que consome essa API via
  `fetch('/api/...')` e nunca tem números "hard-coded" no código.

O contrato da API é o dado de verdade do produto: para atualizar qualquer
número, texto ou gráfico de um painel, edita-se o JSON correspondente em
`server/data/` (ex. `server/data/valoracao.json`) — não se mexe no código
React. O objetivo declarado é permitir trocar essa fonte por um banco de
dados ou por fontes oficiais (ONS, EPE, ANEEL) sem alterar o front-end.

## Comandos

Não há script de raiz nem workspaces — `client/` e `server/` são instalados e
rodados separadamente.

```bash
# Desenvolvimento (dois terminais)
cd server && npm install && npm run dev    # API em http://localhost:4000 (node --watch)
cd client && npm install && npm run dev    # front em http://localhost:5173, com proxy /api -> :4000

# Lint (apenas client; server não tem lint configurado)
cd client && npm run lint                  # oxlint

# Build de produção
cd client && npm run build                 # gera client/dist
cd server && npm start                     # serve a API + client/dist na porta 4000
```

Não existe suíte de testes configurada em nenhum dos dois pacotes.

## Arquitetura

- **Vite dev**: `client/vite.config.js` faz proxy de `/api` para
  `http://localhost:4000`, então o front-end sempre usa caminhos relativos
  (`fetch('/api/paineis/diagnostico')`) tanto em dev quanto em produção.
- **Produção Node**: `server/index.js` serve o build estático de
  `client/dist` (`express.static`) e faz catch-all de rotas não-`/api` para
  `index.html`, permitindo que o React Router (`BrowserRouter`) funcione com
  um único processo Node por trás de um domínio/proxy reverso.
- **Cache de dados**: `server/index.js` mantém um cache em memória por painel,
  invalidado por `mtimeMs` do arquivo — os dados são recarregados
  automaticamente quando o JSON muda em disco, sem reiniciar o processo.
- **IDs de painel fixos**: a lista `PANEL_IDS` em `server/index.js` (e a lista
  `ORDER` espelhada em `client/src/pages/panels/PanelShell.jsx`) define os 6
  painéis: `diagnostico`, `valoracao`, `remuneracao`, `unit-commitment`,
  `servicos-ancilares`, `politicas`. Ao adicionar/remover um painel, os dois
  lugares (mais as rotas em `client/src/App.jsx`) precisam ser atualizados
  juntos.
- **Camada de API do client**: toda chamada de rede passa por
  `client/src/api.js` (`fetchOverview`, `fetchPanel`) e pelo hook
  `client/src/hooks.js` (`useApiData`), que padroniza estado de
  loading/erro. Cada página de painel (`client/src/pages/panels/*.jsx`) busca
  seus próprios dados com `fetchPanel(id)` e renderiza via
  `PanelShell.jsx`, que também cuida da navegação anterior/próximo painel.
- **Identidade visual**: tokens de cor/tipografia extraídos do site do
  Instituto E+ Transição Energética estão centralizados em
  `client/src/styles.css`. A fonte original "obvia-narrow" é proprietária e
  foi substituída por **Barlow Condensed** (títulos) + **Inter** (corpo),
  ambas do Google Fonts.
- **Conteúdo-fonte**: os textos de cada painel foram extraídos/adaptados de
  apresentações do projeto localizadas fora deste repositório (pasta
  `../referencias`); a identidade visual de referência está em
  `../site_emais`.

## Publicação como site estático (GitHub Pages)

O `server/index.js` (Express) não roda em hospedagem puramente estática como
o GitHub Pages. Por isso existe um segundo caminho de build, paralelo ao
`npm run build` normal, que não altera `client/src/api.js`:

- `client/scripts/sync-static-data.js` copia cada `server/data/*.json` para
  `client/public/api/overview` e `client/public/api/paineis/<id>` (sem
  extensão, mesmo caminho que o Express expõe). Isso é gerado, não editado —
  a fonte de verdade continua `server/data/*.json`.
- `npm run build:pages` (em `client/`) roda esse sync e depois `vite build`,
  então `fetch('/api/overview')` e `fetch('/api/paineis/:id')` funcionam
  tanto contra o Express (dev/produção Node) quanto contra os arquivos
  estáticos copiados para `dist/` — o código do client não sabe a diferença.
- `vite.config.js` lê `VITE_BASE_PATH` (padrão `/`) para o `base` do Vite,
  necessário porque um "project page" do GitHub Pages fica em
  `usuario.github.io/<repo>/`, não na raiz.
- `App.jsx` usa `HashRouter` (URLs `/#/painel`) em vez de `BrowserRouter`,
  porque o GitHub Pages não tem servidor para redirecionar rotas
  desconhecidas de volta a `index.html`.
- `client/public/robots.txt` e a tag `<meta name="robots" content="noindex, nofollow">`
  em `client/index.html` impedem indexação por buscadores — o site fica
  público (qualquer um com o link acessa), só não aparece em buscas.
- O deploy automatizado está em `.github/workflows/deploy-pages.yml`
  (dispara em push para `main`, builda `client/` com `VITE_BASE_PATH`
  derivado do nome do repositório e publica via GitHub Actions Pages).
