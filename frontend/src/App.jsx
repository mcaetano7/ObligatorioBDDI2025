// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import PaginaLoginRegister from './pages/PaginaLoginRegister';
import DashboardCliente from './pages/DashboardCliente';
import MaquinasCliente from './pages/MaquinasCliente';
import GananciasCliente from './pages/GananciasCliente';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardAdmin from './pages/DashboardAdmin';
import ProveedoresAdmin from './pages/ProveedoresAdmin';
import MaquinasAdmin from './pages/MaquinasAdmin';
import TecnicosAdmin from './pages/TecnicosAdmin';
import MantenimientosAdmin from './pages/MantenimientosAdmin';
import MaquinasPorCliente from './pages/MaquinasPorCliente';
import GananciasAdmin from './pages/GananciasAdmin';
import CostesAdmin from './pages/CostesAdmin';
import RendimientoAdmin from './pages/RendimientoAdmin';

function App() {
  return (
    <Routes>
      <Route path="/" element={<PaginaLoginRegister />} />

      {/* Cliente */}
      <Route element={<ProtectedRoute allowedRoles={[1]} />}>
        <Route path="/dashboard-cliente" element={<DashboardCliente />} />
        <Route path="/maquinas-cliente" element={<MaquinasCliente />} />
        <Route path="/ganancias-cliente" element={<GananciasCliente />} />
      </Route>

      {/* Administrador */}
      <Route element={<ProtectedRoute allowedRoles={[2]} />}>
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        <Route path="/admin/proveedores" element={<ProveedoresAdmin />} />
        <Route path="/admin/maquinas" element={<MaquinasAdmin />} />
        <Route path="/admin/tecnicos" element={<TecnicosAdmin />} />
        <Route path="/admin/mantenimientos" element={<MantenimientosAdmin />} />
        <Route path="/admin/maquinas-cliente" element={<MaquinasPorCliente />} />
        <Route path="/admin/ganancias" element={<GananciasAdmin />} />
        <Route path="/admin/costes" element={<CostesAdmin />} />
        <Route path="/admin/rendimiento" element={<RendimientoAdmin />} />
      </Route>
    </Routes>
  );
}

export default App;
