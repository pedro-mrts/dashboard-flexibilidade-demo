import { useApiData } from "../../hooks";
import { fetchPanel } from "../../api";
import { LoadingState, ErrorState, KpiRow, Section, ChartCard, DataTable } from "../../components/ui";
import { GroupedBarChart } from "../../components/charts";
import { pivotLongToWide, uniqueSeriesKeys } from "../../utils";
import PanelShell from "./PanelShell";

export default function Diagnostico() {
  const { data, loading, error } = useApiData(() => fetchPanel("diagnostico"), []);
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  const { kpis, charts, secoes } = data;
  const rampas = charts.evolucaoRampas;
  const rampasData = pivotLongToWide(rampas.series, "janela", "metrica", "variacao");
  const rampasSeriesKeys = uniqueSeriesKeys(rampas.series, "metrica");

  return (
    <PanelShell data={data}>
      <KpiRow kpis={kpis} />

      <ChartCard title={charts.crescimentoRenovavel.titulo} description={charts.crescimentoRenovavel.descricao}>
        <div className="card-grid">
          {charts.crescimentoRenovavel.series.map((s, i) => (
            <div className="kpi-card" key={i} style={{ borderLeftColor: "var(--color-navy)" }}>
              <div className="kpi-card__value">
                {s.valor} <span style={{ fontSize: "1rem", fontWeight: 600 }}>{s.unidade}</span>
              </div>
              <div className="kpi-card__label">{s.categoria}</div>
            </div>
          ))}
        </div>
      </ChartCard>

      <Section section={secoes[0]} />

      <ChartCard
        title={rampas.titulo}
        description={rampas.descricao}
        note="Valores em variação percentual (%) entre 2022 e 2025. P95 representa as situações mais severas observadas (5% dos casos mais extremos)."
      >
        <GroupedBarChart
          data={rampasData}
          categoryKey="janela"
          series={rampasSeriesKeys.map((k) => ({ key: k, label: k }))}
          unit="%"
        />
      </ChartCard>

      <Section section={secoes[1]} />

      <ChartCard title={charts.metricasFlexibilidade.titulo} description={charts.metricasFlexibilidade.descricao}>
        <DataTable columns={charts.metricasFlexibilidade.colunas} rows={charts.metricasFlexibilidade.linhas} />
      </ChartCard>

      <Section section={secoes[2]} />
    </PanelShell>
  );
}
