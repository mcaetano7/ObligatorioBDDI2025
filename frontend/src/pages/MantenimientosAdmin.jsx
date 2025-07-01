import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MantenimientosAdmin = () => {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [completados, setCompletados] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);

  const fetchMantenimientos = async () => {
    const res = await axios.get('http://localhost:5000/mantenimientos/pendientes');
    setMantenimientos(res.data);
  };

  const fetchCompletados = async () => {
    const res = await axios.get('http://localhost:5000/mantenimientos/completados');
    setCompletados(res.data);
  };

  const fetchTecnicos = async () => {
    const res = await axios.get('http://localhost:5000/tecnicos/');
    setTecnicos(res.data);
  };

  useEffect(() => {
    fetchMantenimientos();
    fetchCompletados();
    fetchTecnicos();
  }, []);

  const asignarTecnico = async (id_solicitud, id_tecnico) => {
    try {
      await axios.post('http://localhost:5000/mantenimientos/asignar-tecnico', {
        id_solicitud,
        id_tecnico
      });
      fetchMantenimientos();
      fetchCompletados();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert('Error al asignar técnico');
    }
  };

  const completarMantenimiento = async (id_solicitud) => {
    try {
      await axios.post(`http://localhost:5000/mantenimientos/completar/${id_solicitud}`);
      fetchMantenimientos();
      fetchCompletados();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert('Error al marcar como completado');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Mantenimientos Pendientes</h2>
      <ul>
        {mantenimientos.map(m => (
          <li key={m.id_solicitud} style={{ marginBottom: '20px' }}>
            <b>Máquina:</b> {m.modelo} - Cliente: {m.nombre_empresa}<br />
            <b>Descripción:</b> {m.descripcion}<br />
            <label>
              Asignar técnico:
              <select
                onChange={(e) => asignarTecnico(m.id_solicitud, e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Seleccionar técnico</option>
                {tecnicos.map(t => (
                  <option key={t.id_tecnico} value={t.id_tecnico}>
                    {t.nombre_tecnico} ({t.cantidad_mantenimientos} mantenimientos)
                  </option>
                ))}
              </select>
            </label>
            <br />
            <button
              style={{ marginTop: '5px' }}
              onClick={() => completarMantenimiento(m.id_solicitud)}
            >
              Marcar como Completado
            </button>
          </li>
        ))}
      </ul>

      <hr />

      <h2>Mantenimientos Completados</h2>
      <ul>
        {completados.map(c => (
          <li key={c.id_solicitud} style={{ marginBottom: '15px' }}>
            <b>Máquina:</b> {c.modelo} - Cliente: {c.nombre_empresa}<br />
            <b>Técnico:</b> {c.nombre_tecnico || 'Sin asignar'}<br />
            <b>Descripción:</b> {c.descripcion}<br />
            <b>Fecha resolución:</b> {c.fecha_resolucion}
          </li>
        ))}
      </ul>

      <hr />

      <h3>Lista de Técnicos</h3>
      <ul>
        {tecnicos.map(t => (
          <li key={t.id_tecnico}>
            {t.id_tecnico} - {t.nombre_tecnico} ({t.cantidad_mantenimientos} mantenimientos)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MantenimientosAdmin;