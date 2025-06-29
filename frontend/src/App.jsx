import { Routes, Route } from 'react-router-dom';
import PaginaLoginRegister from './pages/PaginaLoginRegister';
import DashboardCliente from './pages/DashboardCliente';
import MaquinasCliente from './pages/MaquinasCliente';
import ProtectedRoute from './components/ProtectedRoute';
import GananciasCliente from './pages/GananciasCliente';

function App() {
  return (
    <Routes>
      <Route path="/" element={<PaginaLoginRegister />} />

      <Route element={<ProtectedRoute allowedRoles={[1]} />}>
        <Route path="/dashboard-cliente" element={<DashboardCliente />} />
        <Route path="/maquinas-cliente" element={<MaquinasCliente />} />
        <Route path="/ganancias-cliente" element={<GananciasCliente />} />
      </Route>
    </Routes>
  );
}

export default App;