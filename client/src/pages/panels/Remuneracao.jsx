import { useApiData } from "../../hooks";
import { fetchPanel } from "../../api";
import { LoadingState, ErrorState, KpiRow, Section, ChartCard } from "../../components/ui";
import PanelShell from "./PanelShell";

export default function Remuneracao() {
  const { data, loading, error } = useApiData(() => fetchPanel("remuneracao"), []);
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  const { kpis, charts, secoes } = data;

  return (
    <PanelShell data={data}>
      <KpiRow kpis={kpis} />

      <Section section={secoes[0]} />

      <ChartCard title={charts.benchmarkInternacional.titulo} description={charts.benchmarkInternacional.descricao}>
        <div className="card-grid">
          {charts.benchmarkInternacional.linhas.map((l, i) => (
            <div className="card" key={i} style={{ boxShadow: "none" }}>
              <h4 style={{ marginBottom: 2 }}>{l.pais}</h4>
              <p style={{ fontWeight: 700, color: "var(--color-orange)", marginBottom: 2 }}>{l.produto}</p>
              <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--color-muted)", marginBottom: 8 }}>
                Remunera: {l.atributo}
              </p>
              <p className="text-muted" style={{ fontSize: "0.86rem", margin: 0 }}>{l.detalhe}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 18 }}>
          <p style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: 8 }}>Elementos em comum entre os mercados:</p>
          <ul className="pill-list" style={{ flexWrap: "wrap" }}>
            {charts.benchmarkInternacional.elementosComuns.map((e, i) => (
              <li key={i} style={{ background: "var(--color-bg-navy-tint)", color: "var(--color-navy)", border: "1px solid #d7e2ec" }}>
                {e}
              </li>
            ))}
          </ul>
        </div>
      </ChartCard>

      <Section section={secoes[1]} />
      <Section section={secoes[2]} />

      <ChartCard title={charts.produtos.titulo}>
        <div className="card-grid">
          {charts.produtos.itens.map((p) => (
            <div className="card" key={p.codigo} style={{ boxShadow: "none", borderTop: "4px solid var(--color-navy)" }}>
              <h4 style={{ color: "var(--color-navy)" }}>Produto {p.codigo}</h4>
              <p style={{ fontWeight: 700, marginBottom: 10 }}>{p.nome}</p>
              <p style={{ fontSize: "0.82rem", margin: "4px 0" }}><strong>Horizonte:</strong> {p.horizonte}</p>
              <p style={{ fontSize: "0.82rem", margin: "4px 0" }}><strong>Pagamento:</strong> {p.pagamento} ({p.unidade})</p>
              <p className="text-muted" style={{ fontSize: "0.84rem", marginTop: 8, marginBottom: 0 }}>{p.objetivo}</p>
            </div>
          ))}
        </div>
      </ChartCard>

      <Section section={secoes[3]} />
      <Section section={secoes[4]} />
    </PanelShell>
  );
}
