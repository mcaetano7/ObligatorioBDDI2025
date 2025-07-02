import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MantenimientosAdmin = () => {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [nuevo, setNuevo] = useState({ id_alquiler: '', fecha_solicitud: '', descripcion: '', id_tecnico_asignado: '' });
  const [error, setError] = useState('');
  const [alquileres, setAlquileres] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);

  const fetchMantenimientos = async () => {
    const res = await axios.get('http://localhost:5000/mantenimientos');
    setMantenimientos(res.data);
  };
  const fetchAlquileres = async () => {
    const res = await axios.get('http://localhost:5000/alquileres');
    setAlquileres(res.data);
  };
  const fetchTecnicos = async () => {
    const res = await axios.get('http://localhost:5000/tecnicos');
    setTecnicos(res.data);
  };

  useEffect(() => { fetchMantenimientos(); fetchAlquileres(); fetchTecnicos(); }, []);

  const handleChange = e => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const handleAdd = async e => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/mantenimientos', nuevo);
      setNuevo({ id_alquiler: '', fecha_solicitud: '', descripcion: '', id_tecnico_asignado: '' });
      fetchMantenimientos();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Error al agregar mantenimiento');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar mantenimiento?')) return;
    try {
      await axios.delete(`http://localhost:5000/mantenimientos/${id}`);
      fetchMantenimientos();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Error al eliminar mantenimiento');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Administrar Mantenimientos</h2>
      <form onSubmit={handleAdd} style={{ marginBottom: 20 }}>
        <select name="id_alquiler" value={nuevo.id_alquiler} onChange={handleChange} required>
          <option value="">Alquiler</option>
          {alquileres.map(a => <option key={a.id_alquiler} value={a.id_alquiler}>{a.id_alquiler}</option>)}
        </select>
        <input name="fecha_solicitud" type="date" value={nuevo.fecha_solicitud} onChange={handleChange} required />
        <input name="descripcion" placeholder="Descripción" value={nuevo.descripcion} onChange={handleChange} required />
        <select name="id_tecnico_asignado" value={nuevo.id_tecnico_asignado} onChange={handleChange} required>
          <option value="">Técnico</option>
          {tecnicos.map(t => <option key={t.id_tecnico} value={t.id_tecnico}>{t.nombre_tecnico}</option>)}
        </select>
        <button type="submit">Agregar</button>
        {error && <span style={{ color: 'red', marginLeft: 10 }}>{error}</span>}
      </form>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th><th>Alquiler</th><th>Fecha Solicitud</th><th>Descripción</th><th>Técnico</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {mantenimientos.map(m => (
            <tr key={m.id_solicitud}>
              <td>{m.id_solicitud}</td>
              <td>{m.id_alquiler}</td>
              <td>{m.fecha_solicitud}</td>
              <td>{m.descripcion}</td>
              <td>{tecnicos.find(t => t.id_tecnico === m.id_tecnico_asignado)?.nombre_tecnico || '-'}</td>
              <td><button onClick={() => handleDelete(m.id_solicitud)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MantenimientosAdmin; 