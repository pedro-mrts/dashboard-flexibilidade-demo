// HashRouter (URLs com "/#/painel") em vez de BrowserRouter: o GitHub Pages
// não tem servidor para redirecionar rotas desconhecidas de volta ao
// index.html, então o roteamento client-side precisa viver no hash.
import { HashRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import Diagnostico from "./pages/panels/Diagnostico";
import Valoracao from "./pages/panels/Valoracao";
import Remuneracao from "./pages/panels/Remuneracao";
import UnitCommitment from "./pages/panels/UnitCommitment";
import ServicosAncilares from "./pages/panels/ServicosAncilares";
import Politicas from "./pages/panels/Politicas";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="diagnostico" element={<Diagnostico />} />
          <Route path="valoracao" element={<Valoracao />} />
          <Route path="remuneracao" element={<Remuneracao />} />
          <Route path="unit-commitment" element={<UnitCommitment />} />
          <Route path="servicos-ancilares" element={<ServicosAncilares />} />
          <Route path="politicas" element={<Politicas />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
