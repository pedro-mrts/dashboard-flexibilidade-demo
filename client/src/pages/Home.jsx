import { Link } from "react-router-dom";
import { useApiData } from "../hooks";
import { fetchOverview } from "../api";
import { LoadingState, ErrorState } from "../components/ui";

const ICONS = {
  activity: "📈",
  coins: "💰",
  handshake: "🤝",
  "git-compare": "🔀",
  shield: "🛡️",
  map: "🗺️",
};

export default function Home() {
  const { data, loading, error } = useApiData(fetchOverview, []);

  if (loading) return <LoadingState label="Carregando visão geral do projeto…" />;
  if (error) return <ErrorState error={error} />;

  const { projeto, resultadosCentrais } = data;

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>{projeto.titulo}</h1>
          <p className="hero__lead">{projeto.subtitulo}</p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 28 }}>
            <a href="#paineis" className="btn btn--primary">Explorar os 6 painéis ↓</a>
            <a href={`mailto:${projeto.contato}`} className="btn btn--ghost">Fale com a equipe</a>
          </div>
          <div className="hero__meta">
            <div>
              <strong>6</strong>
              painéis temáticos
            </div>
            <div>
              <strong>12</strong>
              recomendações regulatórias
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="paineis">
        <div className="container">
          <div className="section__head">
            <h2>Principais frentes e resultados do estudo</h2>
            <p className="text-muted">{projeto.resumo}</p>
          </div>

          <div className="panel-grid">
            {resultadosCentrais.map((p) => (
              <Link to={`/${p.id}`} className="panel-card" key={p.id}>
                <span className="panel-card__num">{ICONS[p.icone] || p.numero}</span>
                <h3>{p.titulo}</h3>
                <p>{p.resumo}</p>
                <span className="panel-card__cta">Ver resultados →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="card" style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ maxWidth: 640 }}>
              <h3 style={{ marginBottom: 8 }}>Sobre o projeto</h3>
              <p className="text-muted" style={{ marginBottom: 0 }}>
                Estudo realizado por {projeto.executoras.join(", ")}, com apoio e financiamento de {projeto.financiadoras.join(", ")}.
                Este dashboard traduz, em linguagem acessível, os principais resultados técnicos apresentados em {projeto.local}, {projeto.data}.
              </p>
            </div>
            <a href={`mailto:${projeto.contato}`} className="btn btn--primary" style={{ background: "var(--color-navy)" }}>
              {projeto.contato}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
