import React, { useState, useEffect } from 'react';

const Mantenimientos = () => {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ id_alquiler: '', descripcion: '' });
  const [editId, setEditId] = useState(null);
  const [asignarTecnico, setAsignarTecnico] = useState({ id_solicitud: null, id_tecnico: '' });

  const fetchMantenimientos = async () => {
    try {
      const res = await fetch('http://localhost:5000/mantenimientos/');
      if (!res.ok) throw new Error('Error al obtener mantenimientos');
      const data = await res.json();
      setMantenimientos(data);
    } catch (err) {
      setError('No se pudieron cargar los mantenimientos');
    }
  };

  const fetchTecnicos = async () => {
    try {
      const res = await fetch('http://localhost:5000/tecnicos/');
      if (!res.ok) throw new Error('Error al obtener técnicos');
      const data = await res.json();
      setTecnicos(data);
    } catch (err) {
      console.error('Error cargando técnicos:', err);
    }
  };

  useEffect(() => {
    fetchMantenimientos();
    fetchTecnicos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAsignarTecnicoChange = (e) => {
    setAsignarTecnico({ ...asignarTecnico, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/mantenimientos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Error al crear mantenimiento');
      setForm({ id_alquiler: '', descripcion: '' });
      fetchMantenimientos();
    } catch (err) {
      setError('Error al crear mantenimiento');
    }
  };

  const handleEdit = (mantenimiento) => {
    setEditId(mantenimiento.id_solicitud);
    setForm({
      id_alquiler: mantenimiento.id_alquiler,
      descripcion: mantenimiento.descripcion,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/mantenimientos/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Error al actualizar mantenimiento');
      setEditId(null);
      setForm({ id_alquiler: '', descripcion: '' });
      fetchMantenimientos();
    } catch (err) {
      setError('Error al actualizar mantenimiento');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este mantenimiento?')) return;
    try {
      const res = await fetch(`http://localhost:5000/mantenimientos/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar mantenimiento');
      fetchMantenimientos();
    } catch (err) {
      setError('Error al eliminar mantenimiento');
    }
  };

  const handleAsignarTecnico = async (idSolicitud, idTecnico) => {
    try {
      const res = await fetch('http://localhost:5000/mantenimientos/asignar-tecnico', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_solicitud: idSolicitud,
          id_tecnico: idTecnico
        }),
      });
      if (!res.ok) throw new Error('Error al asignar técnico');
      fetchMantenimientos();
      setAsignarTecnico({ id_solicitud: null, id_tecnico: '' });
    } catch (err) {
      setError('Error al asignar técnico');
    }
  };

  const handleCompletar = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/mantenimientos/completar/${id}`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Error al completar mantenimiento');
      fetchMantenimientos();
    } catch (err) {
      setError('Error al completar mantenimiento');
    }
  };

  const abrirAsignarTecnico = (idSolicitud) => {
    setAsignarTecnico({ id_solicitud: idSolicitud, id_tecnico: '' });
  };

  return (
    <div>
      <h2>Mantenimientos</h2>
      {error && <p style={{color:'red'}}>{error}</p>}
      
      {/* Modal para asignar técnico */}
      {asignarTecnico.id_solicitud && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            minWidth: '300px'
          }}>
            <h3>Asignar Técnico</h3>
            <select 
              name="id_tecnico" 
              value={asignarTecnico.id_tecnico} 
              onChange={handleAsignarTecnicoChange}
              style={{width: '100%', marginBottom: '10px'}}
            >
              <option value="">Seleccionar técnico</option>
              {tecnicos.map(tecnico => (
                <option key={tecnico.id_tecnico} value={tecnico.id_tecnico}>
                  {tecnico.nombre_tecnico}
                </option>
              ))}
            </select>
            <div>
              <button 
                onClick={() => handleAsignarTecnico(asignarTecnico.id_solicitud, asignarTecnico.id_tecnico)}
                disabled={!asignarTecnico.id_tecnico}
                style={{marginRight: '10px'}}
              >
                Asignar
              </button>
              <button onClick={() => setAsignarTecnico({ id_solicitud: null, id_tecnico: '' })}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <ul>
        {mantenimientos.length === 0 ? (
          <li>No hay mantenimientos para mostrar.</li>
        ) : (
          mantenimientos.map((m) => (
            <li key={m.id_solicitud}>
              {editId === m.id_solicitud ? (
                <form onSubmit={handleUpdate} style={{display:'inline'}}>
                  <input name="id_alquiler" value={form.id_alquiler} onChange={handleChange} required />
                  <input name="descripcion" value={form.descripcion} onChange={handleChange} required />
                  <button type="submit">Guardar</button>
                  <button type="button" onClick={()=>setEditId(null)}>Cancelar</button>
                </form>
              ) : (
                <>
                  <b>Cliente:</b> {m.nombre_empresa} | <b>Máquina:</b> {m.modelo} {m.marca} | <b>Descripción:</b> {m.descripcion} | <b>Técnico:</b> {m.nombre_tecnico || 'Sin asignar'} | <b>Estado:</b> {m.fecha_resolucion ? 'Completado' : 'Pendiente'}
                  <button onClick={()=>handleEdit(m)}>Editar</button>
                  <button onClick={()=>handleDelete(m.id_solicitud)}>Eliminar</button>
                  {!m.fecha_resolucion && !m.nombre_tecnico && (
                    <button onClick={()=>abrirAsignarTecnico(m.id_solicitud)}>Asignar Técnico</button>
                  )}
                  {!m.fecha_resolucion && m.nombre_tecnico && (
                    <button onClick={()=>handleCompletar(m.id_solicitud)}>Completar</button>
                  )}
                </>
              )}
            </li>
          ))
        )}
      </ul>
      <h3>Agregar Mantenimiento</h3>
      <form onSubmit={handleSubmit}>
        <input name="id_alquiler" placeholder="ID Alquiler" value={form.id_alquiler} onChange={handleChange} required />
        <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} required />
        <button type="submit">Agregar</button>
      </form>
    </div>
  );
};

export default Mantenimientos; 