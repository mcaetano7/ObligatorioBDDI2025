import React from 'react';
import { Link } from 'react-router-dom';

const DashboardAdmin = () => {
  return (
    <div style={{ padding: 20 }}>
      <h2>Panel de Administrador</h2>
      <ul>
        <li><Link to="/admin/proveedores">ABM Proveedores</Link></li>
        <li><Link to="/admin/insumos">ABM Insumos</Link></li>
        <li><Link to="/admin/cafes">ABM Cafés</Link></li>
        <li><Link to="/admin/clientes">ABM Clientes</Link></li>
        <li><Link to="/admin/maquinas">ABM Máquinas</Link></li>
        <li><Link to="/admin/tecnicos">ABM Técnicos</Link></li>
        <li><Link to="/admin/mantenimientos">ABM Mantenimientos</Link></li>
        <li><Link to="/admin/atender-mantenimientos">Atender Solicitudes de Mantenimiento</Link></li>
        <li><Link to="/admin/maquinas-por-cliente">Alquileres activos</Link></li>
        <li><Link to="/admin/ventas">Registro de Ventas</Link></li>
        <li><Link to="/admin/ganancias">Reporte: Ganancias</Link></li>
        <li><Link to="/admin/costes-rendimiento">Reporte: Costes y Rendimiento</Link></li>
      </ul>
    </div>
  );
};

export default DashboardAdmin; 