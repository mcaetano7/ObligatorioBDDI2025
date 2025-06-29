import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const rol = usuario?.id_rol;

  return (
    <div>
      <h1>Bienvenido, {usuario?.nombre || 'Usuario'}</h1>
      <nav>
        <ul>
          {/* Opciones comunes para todos los roles */}
          <li><Link to="/maquinas">Máquinas</Link></li>
          <li><Link to="/reportes">Reportes</Link></li>

          {/* Opciones específicas para Cliente */}
          {rol === 1 && (
            <>
              <li><Link to="/registro-consumo">Registro de Consumo</Link></li>
              <li><Link to="/mantenimientos">Solicitar Mantenimiento</Link></li>
            </>
          )}

          {/* Opciones específicas para Administrador */}
          {rol === 2 && (
            <>
              <li><Link to="/clientes">Clientes</Link></li>
              <li><Link to="/insumos">Insumos</Link></li>
              <li><Link to="/proveedores">Proveedores</Link></li>
              <li><Link to="/tecnicos">Técnicos</Link></li>
              <li><Link to="/mantenimientos">Mantenimientos</Link></li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Dashboard;