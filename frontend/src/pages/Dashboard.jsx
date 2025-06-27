import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const esAdmin = usuario && usuario.es_administrador;

  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <ul>
          <li><Link to="/clientes">Clientes</Link></li>
          <li><Link to="/maquinas">Máquinas</Link></li>
          <li><Link to="/insumos">Insumos</Link></li>
          <li><Link to="/mantenimientos">Mantenimientos</Link></li>
          <li><Link to="/registro-consumo">Registro de Consumo</Link></li>
          <li><Link to="/reportes">Reportes</Link></li>
          {esAdmin && <li><Link to="/proveedores">Proveedores</Link></li>}
          {esAdmin && <li><Link to="/tecnicos">Técnicos</Link></li>}
        </ul>
      </nav>
    </div>
  );
};

export default Dashboard; 