# Dashboard — Projeto de Flexibilidade do SIN

Dashboard de divulgação dos resultados do projeto **"Otimização da Flexibilidade e
Critérios de Rateio de Custos e Benefícios no Sistema Elétrico"**, com 6 painéis
temáticos, voltado ao público leigo, no estilo visual do site do Instituto E+
Transição Energética.

Painéis: (1) Diagnóstico do déficit de flexibilidade, (2) Valoração da
flexibilidade, (3) Proposta de remuneração, (4) Unit Commitment Hidráulico,
(5) Serviços ancilares e resiliência operacional, (6) Políticas, propostas e
plano de implementação.

## Como está organizado

```
dashboard-flexibilidade-app/
├── server/              API Node + Express
│   ├── data/*.json      Conteúdo de cada painel (edite aqui para atualizar números/textos)
│   └── index.js         Serve /api/overview, /api/paineis, /api/paineis/:id
└── client/              Front-end React (Vite)
    ├── src/pages/panels/  Uma página por painel
    ├── src/components/    Nav, Footer, cartões, tabelas, gráficos (Recharts)
    └── src/styles.css     Tokens de cor/tipografia extraídos da identidade do E+
```

Os dados são "dinâmicos" no sentido de que o React nunca tem números
"hard-coded": tudo vem de `fetch('/api/...')`. Hoje a API lê arquivos JSON em
`server/data/`, mas o mesmo contrato (`/api/paineis/:id`) pode futuramente ser
trocado por um banco de dados ou por fontes oficiais (ONS, EPE, ANEEL) sem
qualquer mudança no front-end.

## Rodando localmente (desenvolvimento)

Abra dois terminais:

```bash
# Terminal 1 — API
cd server
npm install
npm run dev        # http://localhost:4000

# Terminal 2 — Front-end
cd client
npm install
npm run dev         # http://localhost:5173 (com proxy automático para a API)
```

Acesse **http://localhost:5173**.

## Gerando a versão de produção

```bash
cd client && npm install && npm run build
cd ../server && npm install
npm start            # serve a API + o build do React na mesma porta (4000)
```

Depois disso, `http://localhost:4000` já serve o dashboard completo — é esse
processo Node único que deve ser publicado no servidor/landing page final
(por trás de um domínio próprio ou de um proxy reverso, por exemplo Nginx).

## Atualizando o conteúdo depois

Para atualizar qualquer número, texto ou gráfico de um painel, edite o
arquivo JSON correspondente em `server/data/` (por exemplo,
`server/data/valoracao.json`) e reinicie (ou aguarde o `npm run dev`, que
recarrega automaticamente). Não é necessário mexer no código React.

## Identidade visual

As cores, tipografia e o logo foram extraídos do site institucional do
Instituto E+ Transição Energética (salvo em `../site_emais`), um dos
financiadores do projeto. A fonte original do site (Adobe/Typekit
"obvia-narrow") é proprietária e não foi incluída; usamos como substituta
próxima e de uso livre a fonte **Barlow Condensed** (Google Fonts) para
títulos, combinada com **Inter** para o corpo do texto.

## Conteúdo-fonte

Os textos de cada painel foram extraídos e adaptados para linguagem
acessível a partir de três apresentações do projeto (pasta `../referencias`):
Resumo Executivo, Plano de Implementação e Acompanhamento, e Recomendações
para Políticas e Regulações.
