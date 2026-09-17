import { useApiData } from "../../hooks";
import { fetchPanel } from "../../api";
import { LoadingState, ErrorState, KpiRow, Section, ChartCard, DataTable } from "../../components/ui";
import { RankedBarChart } from "../../components/charts";
import PanelShell from "./PanelShell";

export default function UnitCommitment() {
  const { data, loading, error } = useApiData(() => fetchPanel("unit-commitment"), []);
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  const { kpis, charts, secoes } = data;
  const reotimRows = charts.reotimizacao.itens.map((i) => [i.indicador, i.antes, i.depois, i.variacao]);

  return (
    <PanelShell data={data}>
      <KpiRow kpis={kpis} />

      <Section section={secoes[0]} />

      <ChartCard
        title={charts.classificacaoONS.titulo}
        description={charts.classificacaoONS.descricao}
        note="Total de 1.217 casos analisados; 766 casos dentro da tolerância não entram no percentual de participação."
      >
        <RankedBarChart data={charts.classificacaoONS.series} categoryKey="categoria" valueKey="participacao" unit="%" />
      </ChartCard>

      <Section section={secoes[1]} />

      <ChartCard title={charts.reotimizacao.titulo} description="Efeito de reotimizar o despacho do DESSEM para respeitar melhor as zonas proibidas de geração, em um caso-teste no subsistema Sul.">
        <DataTable columns={["Indicador", "Antes", "Depois", "Leitura"]} rows={reotimRows} />
      </ChartCard>

      <Section section={secoes[2]} />
      <Section section={secoes[3]} />
    </PanelShell>
  );
}
