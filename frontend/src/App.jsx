// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardCliente from './pages/DashboardCliente';
import ProveedoresAdmin from './pages/ProveedoresAdmin';
import MaquinasAdmin from './pages/MaquinasAdmin';
import TecnicosAdmin from './pages/TecnicosAdmin';
import MantenimientosAdmin from './pages/MantenimientosAdmin';
import MaquinasPorCliente from './pages/MaquinasPorCliente';
import CostesYRendimientoAdmin from './pages/CostesYRendimientoAdmin';
import ClientesAdmin from './pages/ClientesAdmin';
import InsumosAdmin from './pages/InsumosAdmin';
import MaquinasPorClienteAdmin from './pages/MaquinasPorClienteAdmin';
import GananciasAdmin from './pages/GananciasAdmin';
import AtenderMantenimientosAdmin from './pages/AtenderMantenimientosAdmin';
import GastosCliente from './pages/GastosCliente';
import MisMaquinasCliente from './pages/MisMaquinasCliente';
import AlquilarMaquinaCliente from './pages/AlquilarMaquinaCliente';
import CafesAdmin from './pages/CafesAdmin';
import VentasAdmin from './pages/VentasAdmin';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard-admin" element={<DashboardAdmin />} />
      <Route path="/dashboard-cliente" element={<DashboardCliente />} />
      <Route path="/admin/proveedores" element={<ProveedoresAdmin />} />
      <Route path="/admin/maquinas" element={<MaquinasAdmin />} />
      <Route path="/admin/tecnicos" element={<TecnicosAdmin />} />
      <Route path="/admin/mantenimientos" element={<MantenimientosAdmin />} />
      <Route path="/admin/maquinas-por-cliente" element={<MaquinasPorClienteAdmin />} />
      <Route path="/admin/ganancias" element={<GananciasAdmin />} />
      <Route path="/admin/costes-rendimiento" element={<CostesYRendimientoAdmin />} />
      <Route path="/admin/clientes" element={<ClientesAdmin />} />
      <Route path="/admin/insumos" element={<InsumosAdmin />} />
      <Route path="/admin/cafes" element={<CafesAdmin />} />
      <Route path="/admin/ventas" element={<VentasAdmin />} />
      <Route path="/admin/atender-mantenimientos" element={<AtenderMantenimientosAdmin />} />
      <Route path="/mis-maquinas" element={<MaquinasPorCliente />} />
      <Route path="/gastos-cliente" element={<GastosCliente />} />
      <Route path="/cliente/mis-maquinas" element={<MisMaquinasCliente />} />
      <Route path="/cliente/alquilar-maquina" element={<AlquilarMaquinaCliente />} />
    </Routes>
  );
};

export default App;

/* */
