import { Fragment, useState } from "react";

export function LoadingState({ label = "Carregando dados do painel…" }) {
  return (
    <div className="container" style={{ padding: "80px 24px", textAlign: "center", color: "var(--color-muted)" }}>
      {label}
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <div className="container" style={{ padding: "80px 24px", textAlign: "center" }}>
      <p style={{ color: "var(--color-orange-dark)", fontWeight: 600 }}>
        Não foi possível carregar os dados agora.
      </p>
      <p className="text-muted">{error?.message}</p>
      {onRetry && (
        <button className="btn btn--primary" onClick={onRetry} style={{ marginTop: 12 }}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}

export function KpiRow({ kpis = [] }) {
  if (!kpis.length) return null;
  return (
    <div className="kpi-row">
      {kpis.map((kpi, i) => (
        <div className="kpi-card" key={i}>
          <div className="kpi-card__value">{kpi.valor}</div>
          <div className="kpi-card__label">{kpi.label}</div>
          {kpi.contexto && <div className="kpi-card__context">{kpi.contexto}</div>}
        </div>
      ))}
    </div>
  );
}

export function Callout({ children, tone = "info", final = false }) {
  const icon = final ? "✓" : tone === "warning" ? "⚠" : "ℹ";
  return (
    <div className={`callout ${final ? "callout--final" : ""}`}>
      <span className="callout__icon" aria-hidden="true">{icon}</span>
      <div>{children}</div>
    </div>
  );
}

export function GlossaryBox({ termos = [] }) {
  const [open, setOpen] = useState(false);
  if (!termos.length) return null;
  return (
    <div className="glossary">
      <button className="glossary__toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        {open ? "Ocultar" : "Entender os termos técnicos"} <span aria-hidden="true">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="glossary__list">
          {termos.map((t, i) => (
            <div className="glossary__item" key={i}>
              <div className="glossary__term">{t.termo}</div>
              <p className="glossary__def">{t.definicao}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function NumberedList({ itens = [] }) {
  return (
    <div className="card-grid card-grid--2">
      {itens.map((item, i) => (
        <div className="numbered-item" key={i}>
          <div className="numbered-item__num">{i + 1}</div>
          <div>
            <h4>{item.titulo}</h4>
            <p>{item.texto}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DataTable({ caption, columns = [], rows = [] }) {
  return (
    <div className="data-table-wrap">
      <table className="data-table">
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th key={i}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ChartCard({ title, description, note, children }) {
  return (
    <div className="chart-card">
      {title && <div className="chart-card__title">{title}</div>}
      {description && <div className="chart-card__desc">{description}</div>}
      {children}
      {note && <div className="chart-card__note">{note}</div>}
    </div>
  );
}

export function StepFlow({ steps = [] }) {
  return (
    <div className="step-flow">
      {steps.map((s, i) => (
        <Fragment key={i}>
          <div className="step-flow__item">
            <div className="step-flow__label">{s.rotulo}</div>
            <div className="step-flow__value">{s.valor}</div>
            {s.detalhe && <div className="step-flow__detail">{s.detalhe}</div>}
          </div>
          {i < steps.length - 1 && (
            <div className="step-flow__arrow" aria-hidden="true">→</div>
          )}
        </Fragment>
      ))}
    </div>
  );
}

export function Accordion({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <div className="accordion">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div className={`accordion__item ${isOpen ? "open" : ""}`} key={i}>
            <button className="accordion__trigger" onClick={() => setOpenIndex(isOpen ? null : i)} aria-expanded={isOpen}>
              <span className="accordion__badge">{item.numero ?? i + 1}</span>
              <span>{item.titulo}</span>
              <span className="accordion__chevron" aria-hidden="true">▾</span>
            </button>
            {isOpen && <div className="accordion__panel">{item.texto}</div>}
          </div>
        );
      })}
    </div>
  );
}

export function Section({ section }) {
  const { titulo, texto, tipo, itens } = section;
  return (
    <div style={{ margin: "34px 0" }}>
      {titulo && <h3>{titulo}</h3>}
      {texto && tipo !== "callout" && <p className="text-muted" style={{ maxWidth: 780 }}>{texto}</p>}
      {tipo === "callout" && <Callout>{texto}</Callout>}
      {tipo === "lista" && <NumberedList itens={itens} />}
    </div>
  );
}
