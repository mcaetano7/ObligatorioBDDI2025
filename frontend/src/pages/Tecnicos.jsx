import React, { useState, useEffect } from 'react';

const Tecnicos = () => {
  const [tecnicos, setTecnicos] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ nombre_tecnico: '', telefono: '', email: '' });
  const [editId, setEditId] = useState(null);

  const fetchTecnicos = async () => {
    try {
      const res = await fetch('http://localhost:5000/tecnicos/');
      if (!res.ok) throw new Error('Error al obtener técnicos');
      const data = await res.json();
      setTecnicos(data);
    } catch (err) {
      setError('No se pudieron cargar los técnicos');
    }
  };

  useEffect(() => {
    fetchTecnicos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/tecnicos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Error al crear técnico');
      setForm({ nombre_tecnico: '', telefono: '', email: '' });
      fetchTecnicos();
    } catch (err) {
      setError('Error al crear técnico');
    }
  };

  const handleEdit = (tecnico) => {
    setEditId(tecnico.id_tecnico);
    setForm({
      nombre_tecnico: tecnico.nombre_tecnico,
      telefono: tecnico.telefono || '',
      email: tecnico.email || '',
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/tecnicos/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Error al actualizar técnico');
      setEditId(null);
      setForm({ nombre_tecnico: '', telefono: '', email: '' });
      fetchTecnicos();
    } catch (err) {
      setError('Error al actualizar técnico');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este técnico?')) return;
    try {
      const res = await fetch(`http://localhost:5000/tecnicos/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar técnico');
      fetchTecnicos();
    } catch (err) {
      setError('Error al eliminar técnico');
    }
  };

  return (
    <div>
      <h2>Técnicos</h2>
      {error && <p style={{color:'red'}}>{error}</p>}
      <ul>
        {tecnicos.length === 0 ? (
          <li>No hay técnicos para mostrar.</li>
        ) : (
          tecnicos.map((tecnico) => (
            <li key={tecnico.id_tecnico}>
              {editId === tecnico.id_tecnico ? (
                <form onSubmit={handleUpdate} style={{display:'inline'}}>
                  <input name="nombre_tecnico" value={form.nombre_tecnico} onChange={handleChange} required />
                  <input name="telefono" value={form.telefono} onChange={handleChange} />
                  <input name="email" value={form.email} onChange={handleChange} />
                  <button type="submit">Guardar</button>
                  <button type="button" onClick={()=>setEditId(null)}>Cancelar</button>
                </form>
              ) : (
                <>
                  <b>{tecnico.nombre_tecnico}</b> | {tecnico.telefono || 'Sin teléfono'} | {tecnico.email || 'Sin email'} | Mantenimientos: {tecnico.cantidad_mantenimientos || 0}
                  <button onClick={()=>handleEdit(tecnico)}>Editar</button>
                  <button onClick={()=>handleDelete(tecnico.id_tecnico)}>Eliminar</button>
                </>
              )}
            </li>
          ))
        )}
      </ul>
      <h3>Agregar Técnico</h3>
      <form onSubmit={handleSubmit}>
        <input name="nombre_tecnico" placeholder="Nombre técnico" value={form.nombre_tecnico} onChange={handleChange} required />
        <input name="telefono" placeholder="Teléfono (opcional)" value={form.telefono} onChange={handleChange} />
        <input name="email" placeholder="Email (opcional)" value={form.email} onChange={handleChange} />
        <button type="submit">Agregar</button>
      </form>
    </div>
  );
};

export default Tecnicos; 