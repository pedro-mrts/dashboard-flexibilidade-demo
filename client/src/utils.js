// Converte uma lista de registros "longos" (uma linha por combinação de
// categoria + série) em uma lista "larga" (uma linha por categoria, com uma
// coluna por série) — formato exigido pelo Recharts para barras agrupadas.
export function pivotLongToWide(rows, categoryKey, seriesKey, valueKey) {
  const map = new Map();
  for (const row of rows) {
    const cat = row[categoryKey];
    if (!map.has(cat)) map.set(cat, { [categoryKey]: cat });
    map.get(cat)[row[seriesKey]] = row[valueKey];
  }
  return Array.from(map.values());
}

export function uniqueSeriesKeys(rows, seriesKey) {
  return Array.from(new Set(rows.map((r) => r[seriesKey])));
}
