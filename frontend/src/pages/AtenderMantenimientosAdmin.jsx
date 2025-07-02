import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AtenderMantenimientosAdmin = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [asignar, setAsignar] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const fetchSolicitudes = async () => {
    const res = await axios.get('http://localhost:5000/mantenimientos/pendientes');
    setSolicitudes(res.data);
  };
  
  const fetchTecnicos = async () => {
    const res = await axios.get('http://localhost:5000/tecnicos');
    setTecnicos(res.data);
  };

  useEffect(() => {
    fetchSolicitudes();
    fetchTecnicos();
  }, []);

  const handleAsignar = (id_solicitud, id_tecnico) => {
    setAsignar({ ...asignar, [id_solicitud]: id_tecnico });
  };

  const handleGuardar = async (id_solicitud) => {
    setMensaje('');
    setError('');
    try {
      await axios.post('http://localhost:5000/mantenimientos/asignar-tecnico', {
        id_tecnico: asignar[id_solicitud],
        id_solicitud
      });
      setMensaje('Técnico asignado correctamente');
      setAsignar({ ...asignar, [id_solicitud]: '' });
      fetchSolicitudes();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Error al asignar técnico');
      }
    }
  };

  const handleCompletar = async (id_solicitud) => {
    if (!window.confirm('¿Marcar esta solicitud como resuelta?')) return;
    
    setMensaje('');
    setError('');
    try {
      await axios.post(`http://localhost:5000/mantenimientos/completar/${id_solicitud}`);
      setMensaje('Solicitud marcada como resuelta');
      fetchSolicitudes();
    } catch {
      setError('Error al marcar como resuelta');
    }
  };

  // Obtener técnicos disponibles (no asignados a otras solicitudes pendientes)
  const getTecnicosDisponibles = (id_solicitud_actual) => {
    const tecnicosAsignados = solicitudes
      .filter(s => s.id_solicitud !== id_solicitud_actual && s.id_tecnico_asignado)
      .map(s => s.id_tecnico_asignado);
    
    return tecnicos.filter(t => !tecnicosAsignados.includes(t.id_tecnico));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Atender Solicitudes de Mantenimiento</h2>
      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Máquina</th>
            <th>Fecha Solicitud</th>
            <th>Descripción</th>
            <th>Técnico Asignado</th>
            <th>Asignar Técnico</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map(s => (
            <tr key={s.id_solicitud}>
              <td>{s.id_solicitud}</td>
              <td>{s.nombre_empresa}</td>
              <td>{s.modelo} - {s.marca}</td>
              <td>{s.fecha_solicitud}</td>
              <td>{s.descripcion}</td>
              <td>{tecnicos.find(t => t.id_tecnico === s.id_tecnico_asignado)?.nombre_tecnico || '-'}</td>
              <td>
                <select
                  value={asignar[s.id_solicitud] || ''}
                  onChange={e => handleAsignar(s.id_solicitud, e.target.value)}
                >
                  <option value="">Seleccionar técnico</option>
                  {getTecnicosDisponibles(s.id_solicitud).map(t => (
                    <option key={t.id_tecnico} value={t.id_tecnico}>{t.nombre_tecnico}</option>
                  ))}
                </select>
                <button 
                  onClick={() => handleGuardar(s.id_solicitud)} 
                  disabled={!asignar[s.id_solicitud]}
                  style={{ marginLeft: '5px' }}
                >
                  Asignar
                </button>
              </td>
              <td>
                <button 
                  onClick={() => handleCompletar(s.id_solicitud)}
                  style={{ 
                    backgroundColor: '#28a745', 
                    color: 'white', 
                    border: 'none', 
                    padding: '5px 10px', 
                    cursor: 'pointer',
                    borderRadius: '4px'
                  }}
                >
                  Marcar Resuelta
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AtenderMantenimientosAdmin; 