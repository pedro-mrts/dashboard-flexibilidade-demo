import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
];

// Como as CSS custom properties não são resolvidas pelo SVG do Recharts em
// todos os navegadores, mantemos também os valores hex equivalentes.
const CHART_COLORS_HEX = ["#2a5d96", "#f9461c", "#0d9488", "#6b5ca5", "#2e8b57", "#b8860b"];

function CustomTooltip({ active, payload, label, unit = "" }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="custom-tooltip">
      {label && <div className="custom-tooltip__label">{label}</div>}
      {payload.map((p, i) => (
        <div key={i}>
          {p.name}: <strong>{p.value}{unit}</strong>
        </div>
      ))}
    </div>
  );
}

// Gráfico de barras agrupadas — usado, por exemplo, para comparar Média vs
// P95 nas rampas de 1h e 4h (dois valores por categoria).
export function GroupedBarChart({ data, categoryKey, series, unit = "%", height = 300 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
        <CartesianGrid stroke="var(--color-line)" vertical={false} />
        <XAxis dataKey={categoryKey} tick={{ fontSize: 12, fill: "var(--color-muted)" }} axisLine={{ stroke: "var(--color-line)" }} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} unit={unit} width={54} />
        <Tooltip content={<CustomTooltip unit={unit} />} cursor={{ fill: "rgba(5,39,75,0.05)" }} />
        <Legend wrapperStyle={{ fontSize: 13 }} />
        {series.map((s, i) => (
          <Bar key={s.key} dataKey={s.key} name={s.label} fill={CHART_COLORS_HEX[i % CHART_COLORS_HEX.length]} radius={[4, 4, 0, 0]} maxBarSize={48} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

// Gráfico de barras horizontais de série única, ranqueado por magnitude —
// usado para o diagnóstico de causas do ONS (classificação % de ocorrências).
// A maior barra é destacada em laranja (cor de marca) para guiar o olhar.
export function RankedBarChart({ data, categoryKey, valueKey, unit = "%", height = 320, highlightMax = true }) {
  const maxValue = Math.max(...data.map((d) => d[valueKey]));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
        <CartesianGrid stroke="var(--color-line)" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 12, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} unit={unit} />
        <YAxis
          type="category"
          dataKey={categoryKey}
          tick={{ fontSize: 12, fill: "var(--color-ink)" }}
          axisLine={false}
          tickLine={false}
          width={170}
        />
        <Tooltip content={<CustomTooltip unit={unit} />} cursor={{ fill: "rgba(5,39,75,0.05)" }} />
        <Bar dataKey={valueKey} radius={[0, 4, 4, 0]} maxBarSize={26}>
          {data.map((entry, i) => (
            <Cell key={i} fill={highlightMax && entry[valueKey] === maxValue ? "#f9461c" : "#2a5d96"} />
          ))}
          <LabelList dataKey={valueKey} position="right" formatter={(v) => `${v}${unit}`} style={{ fill: "var(--color-ink)", fontSize: 12, fontWeight: 600 }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// Duas barras simples lado a lado (comparação binária: antes/depois,
// caso base/com mitigação, cenário A/cenário B).
export function DuoBarChart({ data, categoryKey, valueKey, unit = "", height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
        <CartesianGrid stroke="var(--color-line)" vertical={false} />
        <XAxis dataKey={categoryKey} tick={{ fontSize: 12, fill: "var(--color-muted)" }} axisLine={{ stroke: "var(--color-line)" }} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} unit={unit} width={60} />
        <Tooltip content={<CustomTooltip unit={unit} />} cursor={{ fill: "rgba(5,39,75,0.05)" }} />
        <Bar dataKey={valueKey} radius={[4, 4, 0, 0]} maxBarSize={70}>
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS_HEX[i % CHART_COLORS_HEX.length]} />
          ))}
          <LabelList dataKey={valueKey} position="top" formatter={(v) => `${v}${unit}`} style={{ fill: "var(--color-ink)", fontSize: 12, fontWeight: 700 }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export { CHART_COLORS, CHART_COLORS_HEX };
