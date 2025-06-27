import React, { useState } from 'react';

const Proveedores = () => {
  // Placeholder: cuando el backend esté listo, usar useEffect para fetch real
  const [proveedores, setProveedores] = useState([
    // Ejemplo de datos estáticos
    { id_proveedor: 1, nombre_proveedor: 'Culto café', telefono: '', email: 'ventas@culto.com', direccion: '' },
    { id_proveedor: 2, nombre_proveedor: 'Conaprole', telefono: '', email: 'ventas@conaprole.com', direccion: '' },
  ]);
  const [form, setForm] = useState({ nombre_proveedor: '', telefono: '', email: '', direccion: '' });
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Alta de proveedor no implementada aún.');
    // Aquí irá el fetch POST cuando el backend esté listo
  };

  const handleEdit = (proveedor) => {
    setEditId(proveedor.id_proveedor);
    setForm({
      nombre_proveedor: proveedor.nombre_proveedor,
      telefono: proveedor.telefono,
      email: proveedor.email,
      direccion: proveedor.direccion,
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    alert('Edición de proveedor no implementada aún.');
    setEditId(null);
    // Aquí irá el fetch PUT cuando el backend esté listo
  };

  const handleDelete = (id) => {
    alert('Eliminación de proveedor no implementada aún.');
    // Aquí irá el fetch DELETE cuando el backend esté listo
  };

  return (
    <div>
      <h2>Proveedores</h2>
      <ul>
        {proveedores.length === 0 ? (
          <li>No hay proveedores para mostrar.</li>
        ) : (
          proveedores.map((proveedor) => (
            <li key={proveedor.id_proveedor}>
              {editId === proveedor.id_proveedor ? (
                <form onSubmit={handleUpdate} style={{display:'inline'}}>
                  <input name="nombre_proveedor" value={form.nombre_proveedor} onChange={handleChange} required />
                  <input name="telefono" value={form.telefono} onChange={handleChange} required />
                  <input name="email" value={form.email} onChange={handleChange} required />
                  <input name="direccion" value={form.direccion} onChange={handleChange} required />
                  <button type="submit">Guardar</button>
                  <button type="button" onClick={()=>setEditId(null)}>Cancelar</button>
                </form>
              ) : (
                <>
                  <b>{proveedor.nombre_proveedor}</b> | {proveedor.email} | {proveedor.telefono} | {proveedor.direccion}
                  <button onClick={()=>handleEdit(proveedor)}>Editar</button>
                  <button onClick={()=>handleDelete(proveedor.id_proveedor)}>Eliminar</button>
                </>
              )}
            </li>
          ))
        )}
      </ul>
      <h3>Agregar Proveedor</h3>
      <form onSubmit={handleSubmit}>
        <input name="nombre_proveedor" placeholder="Nombre proveedor" value={form.nombre_proveedor} onChange={handleChange} required />
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} required />
        <button type="submit">Agregar</button>
      </form>
    </div>
  );
};

export default Proveedores; 