import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MantenimientosAdmin = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);

  const fetchData = async () => {
    const s = await axios.get('http://localhost:5000/mantenimientos/pendientes');
    const t = await axios.get('http://localhost:5000/tecnicos');
    setSolicitudes(s.data);
    setTecnicos(t.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const asignarTecnico = async (id_solicitud) => {
    const tecnicoId = prompt('Ingrese ID del técnico para asignar:');
    if (!tecnicoId) return;
    await axios.post('http://localhost:5000/mantenimientos/asignar-tecnico', {
      id_solicitud,
      id_tecnico: parseInt(tecnicoId)
    });
    fetchData();
  };

  const completarSolicitud = async (id_solicitud) => {
    if (!window.confirm('¿Marcar como completada esta solicitud?')) return;
    await axios.put(`http://localhost:5000/mantenimientos/completar/${id_solicitud}`);
    fetchData();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Solicitudes de Mantenimiento</h2>

      <ul>
        {solicitudes.map(s => (
          <li key={s.id_solicitud} style={{ marginBottom: 10 }}>
            <p><b>Alquiler:</b> #{s.id_alquiler}</p>
            <p><b>Descripción:</b> {s.descripcion}</p>
            <p><b>Estado:</b> {s.estado}</p>
            <button onClick={() => asignarTecnico(s.id_solicitud)}>Asignar técnico</button>
            <button onClick={() => completarSolicitud(s.id_solicitud)}>Marcar como completado</button>
          </li>
        ))}
      </ul>

      <h3>Lista de Técnicos</h3>
      <ul>
        {tecnicos.map(t => (
          <li key={t.id_tecnico}>{t.id_tecnico} - {t.nombre} ({t.especialidad})</li>
        ))}
      </ul>
    </div>
  );
};

export default MantenimientosAdmin;