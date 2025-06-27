import React, { useState } from 'react';

const Tecnicos = () => {
  // Placeholder: cuando el backend esté listo, usar useEffect para fetch real
  const [tecnicos, setTecnicos] = useState([
    // Ejemplo de datos estáticos
    { id_tecnico: 1, nombre_tecnico: 'Juan Pérez', telefono: '099123456', email: 'juan.perez@tecnicos.com' },
    { id_tecnico: 2, nombre_tecnico: 'María Gómez', telefono: '098654321', email: 'maria.gomez@tecnicos.com' },
  ]);
  const [form, setForm] = useState({ nombre_tecnico: '', telefono: '', email: '' });
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Alta de técnico no implementada aún.');
    // Aquí irá el fetch POST cuando el backend esté listo
  };

  const handleEdit = (tecnico) => {
    setEditId(tecnico.id_tecnico);
    setForm({
      nombre_tecnico: tecnico.nombre_tecnico,
      telefono: tecnico.telefono,
      email: tecnico.email,
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    alert('Edición de técnico no implementada aún.');
    setEditId(null);
    // Aquí irá el fetch PUT cuando el backend esté listo
  };

  const handleDelete = (id) => {
    alert('Eliminación de técnico no implementada aún.');
    // Aquí irá el fetch DELETE cuando el backend esté listo
  };

  return (
    <div>
      <h2>Técnicos</h2>
      <ul>
        {tecnicos.length === 0 ? (
          <li>No hay técnicos para mostrar.</li>
        ) : (
          tecnicos.map((tecnico) => (
            <li key={tecnico.id_tecnico}>
              {editId === tecnico.id_tecnico ? (
                <form onSubmit={handleUpdate} style={{display:'inline'}}>
                  <input name="nombre_tecnico" value={form.nombre_tecnico} onChange={handleChange} required />
                  <input name="telefono" value={form.telefono} onChange={handleChange} required />
                  <input name="email" value={form.email} onChange={handleChange} required />
                  <button type="submit">Guardar</button>
                  <button type="button" onClick={()=>setEditId(null)}>Cancelar</button>
                </form>
              ) : (
                <>
                  <b>{tecnico.nombre_tecnico}</b> | {tecnico.telefono} | {tecnico.email}
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
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <button type="submit">Agregar</button>
      </form>
    </div>
  );
};

export default Tecnicos; 