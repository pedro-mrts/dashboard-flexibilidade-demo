import { Link } from "react-router-dom";
import { GlossaryBox, Callout } from "../../components/ui";

const ORDER = [
  { id: "diagnostico", to: "/diagnostico" },
  { id: "valoracao", to: "/valoracao" },
  { id: "remuneracao", to: "/remuneracao" },
  { id: "unit-commitment", to: "/unit-commitment" },
  { id: "servicos-ancilares", to: "/servicos-ancilares" },
  { id: "politicas", to: "/politicas" },
];

export default function PanelShell({ data, children }) {
  const { numero, titulo, tagline, introducao, glossario, conclusaoFinal } = data;
  const idx = ORDER.findIndex((o) => o.id === data.id);
  const prev = idx > 0 ? ORDER[idx - 1] : null;
  const next = idx < ORDER.length - 1 ? ORDER[idx + 1] : null;

  return (
    <>
      <section className="panel-hero">
        <div className="container">
          <div className="panel-hero__num">Painel {numero} de 6</div>
          <h1>{titulo}</h1>
          <p className="panel-hero__tagline">{tagline}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {introducao && <p className="intro-block">{introducao}</p>}
          {glossario && <GlossaryBox termos={glossario} />}

          {children}

          {conclusaoFinal && (
            <Callout final>
              <strong style={{ display: "block", marginBottom: 6 }}>Em resumo</strong>
              {conclusaoFinal}
            </Callout>
          )}

          <div className="panel-pager">
            {prev ? (
              <Link to={prev.to}>← Painel anterior</Link>
            ) : (
              <Link to="/">← Voltar à visão geral</Link>
            )}
            {next ? (
              <Link to={next.to}>Próximo painel →</Link>
            ) : (
              <Link to="/">Voltar à visão geral →</Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
