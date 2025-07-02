import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TecnicosAdmin = () => {
  const [tecnicos, setTecnicos] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre_tecnico: '', telefono: '', email: '' });
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchTecnicos = async () => {
    const res = await axios.get('http://localhost:5000/tecnicos');
    setTecnicos(res.data);
  };

  useEffect(() => { fetchTecnicos(); }, []);

  const handleChange = e => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const handleAdd = async e => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/tecnicos', nuevo);
      setNuevo({ nombre_tecnico: '', telefono: '', email: '' });
      fetchTecnicos();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Error al agregar técnico');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar técnico?')) return;
    try {
      await axios.delete(`http://localhost:5000/tecnicos/${id}`);
      fetchTecnicos();
      setError('');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error && (err.response.data.error.toLowerCase().includes('mantenimiento') || err.response.data.error.toLowerCase().includes('foreign'))) {
        setError('No se puede eliminar un técnico que está realizando un mantenimiento');
      } else {
        setError('Error al eliminar técnico');
      }
    }
  };

  const handleEdit = (t) => {
    setEditId(t.id_tecnico);
    setEditData({ ...t });
  };

  const handleEditChange = e => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async e => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/tecnicos/${editId}`, editData);
      setEditId(null);
      setEditData({});
      fetchTecnicos();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Error al editar técnico');
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditData({});
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Administrar Técnicos</h2>
      <form onSubmit={handleAdd} style={{ marginBottom: 20 }}>
        <input name="nombre_tecnico" placeholder="Nombre" value={nuevo.nombre_tecnico} onChange={handleChange} required />
        <input name="telefono" placeholder="Teléfono" value={nuevo.telefono} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={nuevo.email} onChange={handleChange} required />
        <button type="submit">Agregar</button>
        {error && <span style={{ color: 'red', marginLeft: 10 }}>{error}</span>}
      </form>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Nombre</th><th>Teléfono</th><th>Email</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tecnicos.map(t => (
            <tr key={t.id_tecnico}>
              {editId === t.id_tecnico ? (
                <>
                  <td><input name="nombre_tecnico" value={editData.nombre_tecnico} onChange={handleEditChange} required /></td>
                  <td><input name="telefono" value={editData.telefono} onChange={handleEditChange} required /></td>
                  <td><input name="email" value={editData.email} onChange={handleEditChange} required /></td>
                  <td>
                    <button onClick={handleEditSave}>Guardar</button>
                    <button type="button" onClick={handleEditCancel}>Cancelar</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{t.nombre_tecnico}</td>
                  <td>{t.telefono}</td>
                  <td>{t.email}</td>
                  <td>
                    <button onClick={() => handleEdit(t)}>Editar</button>
                    <button onClick={() => handleDelete(t.id_tecnico)}>Eliminar</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TecnicosAdmin; 