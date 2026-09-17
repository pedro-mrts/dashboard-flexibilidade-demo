import { useApiData } from "../../hooks";
import { fetchPanel } from "../../api";
import { LoadingState, ErrorState, KpiRow, Section, ChartCard, Accordion, DataTable } from "../../components/ui";
import PanelShell from "./PanelShell";

export default function Politicas() {
  const { data, loading, error } = useApiData(() => fetchPanel("politicas"), []);
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  const { kpis, charts, secoes } = data;
  const riscoRows = charts.riscos.linhas.map((r) => [r.risco, r.impacto, r.mitigacao]);

  return (
    <PanelShell data={data}>
      <KpiRow kpis={kpis} />

      <ChartCard title={charts.lacunas.titulo}>
        <div className="card-grid">
          {charts.lacunas.itens.map((l, i) => (
            <div className="card" key={i} style={{ boxShadow: "none", borderLeft: "4px solid var(--color-orange-dark)" }}>
              <h4 style={{ color: "var(--color-navy)" }}>{l.categoria}</h4>
              <p className="text-muted" style={{ fontSize: "0.88rem", margin: 0 }}>{l.problema}</p>
            </div>
          ))}
        </div>
      </ChartCard>

      <Section section={secoes[0]} />

      <ChartCard title={charts.recomendacoes.titulo} description="As doze diretrizes regulatórias propostas pelo estudo — clique para ler cada uma.">
        <Accordion items={charts.recomendacoes.itens} />
      </ChartCard>

      <Section section={secoes[1]} />

      <ChartCard title={charts.roadmap.titulo}>
        <div className="timeline">
          {charts.roadmap.fases.map((f) => (
            <div className="timeline__phase" key={f.fase}>
              <div className="timeline__badge">Fase {f.fase}</div>
              <h4 style={{ margin: "4px 0 0", textTransform: "none", letterSpacing: 0 }}>{f.nome}</h4>
              <span className="timeline__prazo">{f.prazo}</span>
              <p className="text-muted" style={{ fontSize: "0.85rem" }}>{f.objetivo}</p>
              <ul>
                {f.acoes.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
              <div className="timeline__marco">🏁 {f.marco}</div>
            </div>
          ))}
        </div>
      </ChartCard>

      <ChartCard title={charts.governanca.titulo}>
        <div className="card-grid">
          {charts.governanca.itens.map((g, i) => (
            <div className="card" key={i} style={{ boxShadow: "none" }}>
              <h4 style={{ marginBottom: 2 }}>{g.instituicao}</h4>
              <p style={{ fontWeight: 700, color: "var(--color-orange)", fontSize: "0.85rem", marginBottom: 8 }}>{g.papel}</p>
              <ul className="text-muted" style={{ fontSize: "0.85rem", margin: 0, paddingLeft: 18 }}>
                {g.responsabilidades.map((r, j) => (
                  <li key={j}>{r}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ChartCard>

      <ChartCard title={charts.monitoramento.titulo}>
        <div className="card-grid">
          {charts.monitoramento.itens.map((m, i) => (
            <div className="card" key={i} style={{ boxShadow: "none", borderTop: "4px solid var(--chart-1)" }}>
              <h4 style={{ marginBottom: 2 }}>{m.nivel}</h4>
              <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--color-muted)", marginBottom: 8 }}>Foco: {m.foco}</p>
              <ul style={{ fontSize: "0.85rem", margin: 0, paddingLeft: 18 }}>
                {m.exemplos.map((e, j) => (
                  <li key={j}>{e}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ChartCard>

      <ChartCard title={charts.riscos.titulo}>
        <DataTable columns={["Risco", "Possível impacto", "Medida mitigadora"]} rows={riscoRows} />
      </ChartCard>

      <ChartCard title={charts.impactosEsperados.titulo}>
        <div className="card-grid">
          {charts.impactosEsperados.itens.map((imp, i) => (
            <div className="card" key={i} style={{ boxShadow: "none" }}>
              <h4 style={{ marginBottom: 2 }}>{imp.publico}</h4>
              <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--color-muted)", marginBottom: 8 }}>{imp.foco}</p>
              <ul style={{ fontSize: "0.85rem", margin: 0, paddingLeft: 18 }}>
                {imp.beneficios.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ChartCard>

      <Section section={secoes[2]} />
      <Section section={secoes[3]} />
    </PanelShell>
  );
}
