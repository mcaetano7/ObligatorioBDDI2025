import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Bienvenido a Cafés Marloy</h1>
          <div className="user-info">
            <span>Hola, {user.nombre_usuario}</span>
            <span className="user-role">({user.nombre_rol})</span>
            <button onClick={handleLogout} className="logout-btn">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-card">
          <h2>Información del Usuario</h2>
          <div className="user-details">
            <p><strong>Nombre:</strong> {user.nombre_usuario}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Rol:</strong> {user.nombre_rol}</p>
            <p><strong>Fecha de registro:</strong> {new Date(user.fecha_registro).toLocaleDateString('es-ES')}</p>
            
            {user.cliente_info && (
              <div className="cliente-info">
                <h3>Información de Cliente</h3>
                <p><strong>Empresa:</strong> {user.cliente_info.nombre_empresa}</p>
                <p><strong>Dirección:</strong> {user.cliente_info.direccion}</p>
                <p><strong>Teléfono:</strong> {user.cliente_info.telefono}</p>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Funcionalidades Disponibles</h2>
          <div className="features-grid">
            {user.nombre_rol === 'Cliente' ? (
              <>
                <div className="feature-item" onClick={() => navigate('/mis-alquileres')}>
                  <h3>Mis Alquileres</h3>
                  <p>Gestionar máquinas de café alquiladas</p>
                </div>
                <div className="feature-item" onClick={() => navigate('/mis-ventas')}>
                  <h3>Mis Ventas</h3>
                  <p>Ver historial de ventas</p>
                </div>
                <div className="feature-item" onClick={() => navigate('/solicitar-mantenimiento')}>
                  <h3>Solicitar Mantenimiento</h3>
                  <p>Crear solicitudes de mantenimiento</p>
                </div>
              </>
            ) : (
              <>
                <div className="feature-item" onClick={() => navigate('/gestion-clientes')} tabIndex={0} role="button">
                  <h3>Gestionar Clientes</h3>
                  <p>Administrar información de clientes</p>
                </div>
                <div className="feature-item" onClick={() => navigate('/gestion-maquinas')} tabIndex={0} role="button">
                  <h3>Gestionar Máquinas</h3>
                  <p>Administrar inventario de máquinas</p>
                </div>
                <div className="feature-item" onClick={() => navigate('/gestion-cafes')} tabIndex={0} role="button">
                  <h3>Gestionar Cafés</h3>
                  <p>Administrar tipos de café disponibles</p>
                </div>
                <div className="feature-item" onClick={() => navigate('/gestion-insumos')} tabIndex={0} role="button">
                  <h3>Gestionar Insumos</h3>
                  <p>Administrar inventario de insumos</p>
                </div>
                <div className="feature-item" onClick={() => navigate('/gestion-proveedores')} tabIndex={0} role="button">
                  <h3>Gestionar Proveedores</h3>
                  <p>Administrar proveedores</p>
                </div>
                <div className="feature-item" onClick={() => navigate('/gestion-tecnicos')} tabIndex={0} role="button">
                  <h3>Gestionar Técnicos</h3>
                  <p>Administrar técnicos de mantenimiento</p>
                </div>
                <div className="feature-item" onClick={() => navigate('/gestion-ventas')} tabIndex={0} role="button">
                  <h3>Gestionar Ventas</h3>
                  <p>Registrar ventas en alquileres activos</p>
                </div>
                <div className="feature-item" onClick={() => navigate('/gestion-mantenimientos')} tabIndex={0} role="button">
                  <h3>Gestionar Mantenimientos</h3>
                  <p>Administrar solicitudes de mantenimiento</p>
                </div>
                <div className="feature-item" onClick={() => navigate('/gestion-ganancias')} tabIndex={0} role="button">
                  <h3>Gestión de Ganancias</h3>
                  <p>Ver ganancias de clientes y empresa por alquiler</p>
                </div>
                <div className="feature-item" onClick={() => navigate('/gestion-costos-insumos')} tabIndex={0} role="button">
                  <h3>Costos de Insumos</h3>
                  <p>Ver costos de insumos consumidos por alquiler</p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 