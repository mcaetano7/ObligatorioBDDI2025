import React from 'react';
import { Link } from 'react-router-dom';

const DashboardCliente = () => {
  return (
    <div style={{ padding: 20 }}>
      <h2>Panel de Cliente</h2>
      <ul>
        <li><Link to="/cliente/alquilar-maquina">Ver máquinas disponibles</Link></li>
        <li><Link to="/cliente/mis-maquinas">Mis máquinas alquiladas</Link></li>
        <li><Link to="/cliente/ganancias">Facturación y reportes</Link></li>
      </ul>
    </div>
  );
};

export default DashboardCliente; 