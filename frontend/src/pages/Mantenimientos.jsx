import React, { useState } from 'react';

const Mantenimientos = () => {
  // Placeholder: cuando el backend esté listo, usar useEffect para fetch real
  const [mantenimientos, setMantenimientos] = useState([
    // Ejemplo de datos estáticos
    { id_solicitud: 1, id_alquiler: 1, fecha_solicitud: '2024-06-15', descripcion: 'Revisión general máquina', id_tecnico_asignado: 1, fecha_asignacion: '2024-06-16', fecha_resolucion: '2024-06-18' },
    { id_solicitud: 2, id_alquiler: 2, fecha_solicitud: '2024-07-01', descripcion: 'Cambio de filtro de agua', id_tecnico_asignado: 2, fecha_asignacion: '2024-07-02', fecha_resolucion: null },
  ]);
  const [form, setForm] = useState({ id_alquiler: '', fecha_solicitud: '', descripcion: '', id_tecnico_asignado: '', fecha_asignacion: '', fecha_resolucion: '' });
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Alta de mantenimiento no implementada aún.');
    // Aquí irá el fetch POST cuando el backend esté listo
  };

  const handleEdit = (mantenimiento) => {
    setEditId(mantenimiento.id_solicitud);
    setForm({
      id_alquiler: mantenimiento.id_alquiler,
      fecha_solicitud: mantenimiento.fecha_solicitud,
      descripcion: mantenimiento.descripcion,
      id_tecnico_asignado: mantenimiento.id_tecnico_asignado,
      fecha_asignacion: mantenimiento.fecha_asignacion,
      fecha_resolucion: mantenimiento.fecha_resolucion || '',
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    alert('Edición de mantenimiento no implementada aún.');
    setEditId(null);
    // Aquí irá el fetch PUT cuando el backend esté listo
  };

  const handleDelete = (id) => {
    alert('Eliminación de mantenimiento no implementada aún.');
    // Aquí irá el fetch DELETE cuando el backend esté listo
  };

  return (
    <div>
      <h2>Mantenimientos</h2>
      <ul>
        {mantenimientos.length === 0 ? (
          <li>No hay mantenimientos para mostrar.</li>
        ) : (
          mantenimientos.map((m) => (
            <li key={m.id_solicitud}>
              {editId === m.id_solicitud ? (
                <form onSubmit={handleUpdate} style={{display:'inline'}}>
                  <input name="id_alquiler" value={form.id_alquiler} onChange={handleChange} required />
                  <input name="fecha_solicitud" value={form.fecha_solicitud} onChange={handleChange} required />
                  <input name="descripcion" value={form.descripcion} onChange={handleChange} required />
                  <input name="id_tecnico_asignado" value={form.id_tecnico_asignado} onChange={handleChange} required />
                  <input name="fecha_asignacion" value={form.fecha_asignacion} onChange={handleChange} required />
                  <input name="fecha_resolucion" value={form.fecha_resolucion} onChange={handleChange} />
                  <button type="submit">Guardar</button>
                  <button type="button" onClick={()=>setEditId(null)}>Cancelar</button>
                </form>
              ) : (
                <>
                  <b>Alquiler:</b> {m.id_alquiler} | <b>Fecha solicitud:</b> {m.fecha_solicitud} | <b>Descripción:</b> {m.descripcion} | <b>Técnico:</b> {m.id_tecnico_asignado} | <b>Asignación:</b> {m.fecha_asignacion} | <b>Resolución:</b> {m.fecha_resolucion || 'Pendiente'}
                  <button onClick={()=>handleEdit(m)}>Editar</button>
                  <button onClick={()=>handleDelete(m.id_solicitud)}>Eliminar</button>
                </>
              )}
            </li>
          ))
        )}
      </ul>
      <h3>Agregar Mantenimiento</h3>
      <form onSubmit={handleSubmit}>
        <input name="id_alquiler" placeholder="ID Alquiler" value={form.id_alquiler} onChange={handleChange} required />
        <input name="fecha_solicitud" placeholder="Fecha solicitud" value={form.fecha_solicitud} onChange={handleChange} required />
        <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} required />
        <input name="id_tecnico_asignado" placeholder="ID Técnico" value={form.id_tecnico_asignado} onChange={handleChange} required />
        <input name="fecha_asignacion" placeholder="Fecha asignación" value={form.fecha_asignacion} onChange={handleChange} required />
        <input name="fecha_resolucion" placeholder="Fecha resolución (opcional)" value={form.fecha_resolucion} onChange={handleChange} />
        <button type="submit">Agregar</button>
      </form>
    </div>
  );
};

export default Mantenimientos; 