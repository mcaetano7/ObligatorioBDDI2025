import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TecnicosAdmin = () => {
  const [tecnicos, setTecnicos] = useState([]);
  const [form, setForm] = useState({ nombre_tecnico: '', telefono: '', email: '' });
  const [editandoId, setEditandoId] = useState(null);

  const fetchTecnicos = async () => {
    const res = await axios.get('http://localhost:5000/tecnicos/');
    setTecnicos(res.data);
  };

  useEffect(() => {
    fetchTecnicos();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editandoId) {
        await axios.put(`http://localhost:5000/tecnicos/${editandoId}`, form);
      } else {
        await axios.post('http://localhost:5000/tecnicos/', form);
      }
      setForm({ nombre_tecnico: '', telefono: '', email: '' });
      setEditandoId(null);
      fetchTecnicos();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert('Error al guardar técnico');
    }
  };

  const handleEditar = tecnico => {
    setForm({
      nombre_tecnico: tecnico.nombre_tecnico,
      telefono: tecnico.telefono,
      email: tecnico.email
    });
    setEditandoId(tecnico.id_tecnico);
  };

  const handleEliminar = async id => {
    if (!window.confirm('¿Eliminar técnico?')) return;
    try {
      await axios.delete(`http://localhost:5000/tecnicos/${id}`);
      fetchTecnicos();
    } catch (err) {
      alert(err?.response?.data?.error || 'Error al eliminar técnico');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Gestión de Técnicos</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          name="nombre_tecnico"
          placeholder="Nombre"
          value={form.nombre_tecnico}
          onChange={handleChange}
          required
        />
        <input
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <button type="submit">{editandoId ? 'Actualizar' : 'Agregar'}</button>
      </form>
      <ul>
        {tecnicos.map(t => (
          <li key={t.id_tecnico}>
            <b>{t.nombre_tecnico}</b> — {t.telefono || 'Sin teléfono'} — {t.email || 'Sin email'} — {t.cantidad_mantenimientos} mantenimientos
            <button onClick={() => handleEditar(t)}>Editar</button>
            <button onClick={() => handleEliminar(t.id_tecnico)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TecnicosAdmin;