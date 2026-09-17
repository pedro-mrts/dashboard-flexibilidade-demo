import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "Visão geral", end: true },
  { to: "/diagnostico", label: "1. Diagnóstico" },
  { to: "/valoracao", label: "2. Valoração" },
  { to: "/remuneracao", label: "3. Remuneração" },
  { to: "/unit-commitment", label: "4. Unit Commitment" },
  { to: "/servicos-ancilares", label: "5. Serviços ancilares" },
  { to: "/politicas", label: "6. Políticas e plano" },
];

export function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="brand" onClick={() => setOpen(false)}>
            {/* import.meta.env.BASE_URL (não uma string fixa) porque em
                GitHub Pages o site fica em um subpath, ex. /repositorio/ */}
            <img src={`${import.meta.env.BASE_URL}logo-emais.png`} alt="Instituto E+ Transição Energética" />
            <span className="brand-name">
              Flexibilidade do SIN
              <small>Instituto E+ Transição Energética</small>
            </span>
          </Link>

          <button
            className="nav-toggle"
            aria-label="Abrir menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            ☰
          </button>

          <nav className={`main-nav ${open ? "open" : ""}`} aria-label="Painéis do projeto">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div>
            <div className="site-footer__title">O projeto</div>
            <p style={{ fontSize: "0.85rem", maxWidth: 280 }}>
              "Otimização da Flexibilidade e Critérios de Rateio de Custos e Benefícios no Sistema Elétrico":
              um estudo sobre o papel da flexibilidade na transformação do sistema elétrico brasileiro e os caminhos para seu adequado provimento e remuneração.
            </p>
          </div>
          <div>
            <div className="site-footer__title">Realização</div>
            <ul className="pill-list">
              <li>MRTS Consultoria</li>
              <li>Ampere Consultoria</li>
              <li aria-hidden="true" style={{ flexBasis: "100%", width: 0, padding: 0, margin: 0, border: "none" }} />
              <li>HPPA</li>
            </ul>
          </div>
          <div>
            <div className="site-footer__title">Apoio e financiamento</div>
            <ul className="pill-list">
              <li>Instituto Clima e Sociedade (iCS)</li>
              <li>Crux Alliance</li>
              <li>Instituto E+ Transição Energética</li>
            </ul>
          </div>
          <div>
            <div className="site-footer__title">Contato</div>
            <p style={{ fontSize: "0.85rem" }}>
              <a href="mailto:contato@mrtsconsultoria.com">contato@mrtsconsultoria.com</a>
            </p>
          </div>
        </div>
        <div className="site-footer__bottom">
          <span>© {new Date().getFullYear()} Projeto Flexibilidade do SIN. Dashboard de divulgação de resultados.</span>
        </div>
      </div>
    </footer>
  );
}
