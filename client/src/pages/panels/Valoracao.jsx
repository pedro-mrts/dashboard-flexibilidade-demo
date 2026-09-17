import { useApiData } from "../../hooks";
import { fetchPanel } from "../../api";
import { LoadingState, ErrorState, KpiRow, Section, ChartCard, StepFlow } from "../../components/ui";
import { DuoBarChart } from "../../components/charts";
import PanelShell from "./PanelShell";

export default function Valoracao() {
  const { data, loading, error } = useApiData(() => fetchPanel("valoracao"), []);
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  const { kpis, charts, secoes } = data;
  const comparacoes = charts.comparacaoCustos.series.map((s) => ({
    ...s,
    curto: s.comparacao.split("\n")[0],
  }));

  return (
    <PanelShell data={data}>
      <KpiRow kpis={kpis} />

      <ChartCard title={charts.cenarios.titulo} description={charts.cenarios.descricao}>
        <div className="card-grid">
          {charts.cenarios.itens.map((c) => (
            <div className="card" key={c.codigo} style={{ boxShadow: "none" }}>
              <h4 style={{ color: "var(--color-orange)" }}>{c.codigo}</h4>
              <p style={{ fontWeight: 700, marginBottom: 4 }}>{c.nome}</p>
              <p className="text-muted" style={{ fontSize: "0.88rem", margin: 0 }}>{c.descricao}</p>
            </div>
          ))}
        </div>
      </ChartCard>

      <div className="card-grid card-grid--2">
        <ChartCard
          title={charts.comparacaoCustos.titulo}
          description="Valor econômico da flexibilidade hidrelétrica, em bilhões de reais, entre 2026 e 2030."
        >
          <DuoBarChart data={comparacoes} categoryKey="curto" valueKey="valorTotal" unit=" bi" height={240} />
        </ChartCard>
        <ChartCard
          title="Valor econômico anual da flexibilidade hidrelétrica"
          description="Valor estimado a partir da diferença dos custos de expansão e operação do SIN entre os cenários, em R$ bilhões/ano."
        >
          <DuoBarChart data={comparacoes} categoryKey="curto" valueKey="valorAnual" unit=" bi/ano" height={240} />
        </ChartCard>
      </div>

      <Section section={secoes[0]} />

      <ChartCard title={charts.composicaoValorReferencia.titulo} description={charts.composicaoValorReferencia.descricao}>
        <StepFlow steps={charts.composicaoValorReferencia.passos} />
      </ChartCard>

      <Section section={secoes[1]} />
      <Section section={secoes[2]} />
      <Section section={secoes[3]} />
    </PanelShell>
  );
}
