import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardAdmin = () => {
  const navigate = useNavigate();

  const secciones = [
    { label: 'Proveedores', path: '/admin/proveedores' },
    { label: 'Máquinas', path: '/admin/maquinas' },
    { label: 'Técnicos', path: '/admin/tecnicos' },
    { label: 'Solicitudes de mantenimiento', path: '/admin/mantenimientos' },
    { label: 'Máquinas por cliente', path: '/admin/maquinas-cliente' },
    { label: 'Ganancias', path: '/admin/ganancias' },
    { label: 'Costes mensuales', path: '/admin/costes' },
    { label: 'Rendimiento de máquinas', path: '/admin/rendimiento' },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>Panel de Administración</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
        {secciones.map((s, i) => (
          <button key={i} onClick={() => navigate(s.path)}>{s.label}</button>
        ))}
      </div>
    </div>
  );
};

export default DashboardAdmin;
