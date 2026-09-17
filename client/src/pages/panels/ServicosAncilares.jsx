import { useApiData } from "../../hooks";
import { fetchPanel } from "../../api";
import { LoadingState, ErrorState, KpiRow, Section, ChartCard, DataTable } from "../../components/ui";
import { DuoBarChart } from "../../components/charts";
import PanelShell from "./PanelShell";

export default function ServicosAncilares() {
  const { data, loading, error } = useApiData(() => fetchPanel("servicos-ancilares"), []);
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  const { kpis, charts, secoes } = data;
  const naturezaRows = charts.servicosPorNatureza.linhas.map((l) => [l.servico, l.escopo, l.velocidade, l.recursos]);

  return (
    <PanelShell data={data}>
      <KpiRow kpis={kpis} />

      <Section section={secoes[0]} />

      <ChartCard title={charts.gflVsGfm.titulo}>
        <DataTable columns={charts.gflVsGfm.colunas} rows={charts.gflVsGfm.linhas} />
      </ChartCard>

      <Section section={secoes[1]} />

      <ChartCard title={charts.servicosPorNatureza.titulo}>
        <DataTable columns={["Serviço", "Escopo", "Velocidade de resposta", "Principais recursos"]} rows={naturezaRows} />
      </ChartCard>

      <Section section={secoes[2]} />

      <ChartCard
        title={charts.casoNordeste.titulo}
        description="Variação de tensão (dV/dt) medida em uma contingência simulada — quanto mais próximo de zero, melhor a resiliência operativa."
        note={charts.casoNordeste.nota}
      >
        <DuoBarChart data={charts.casoNordeste.series} categoryKey="cenario" valueKey="valor" unit=" V/s" height={240} />
      </ChartCard>

      <Section section={secoes[3]} />
    </PanelShell>
  );
}
