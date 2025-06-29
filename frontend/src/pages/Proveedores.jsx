import React, { useState, useEffect } from 'react';

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ nombre_proveedor: '', telefono: '', email: '', direccion: '' });
  const [editId, setEditId] = useState(null);

  const fetchProveedores = async () => {
    try {
      const res = await fetch('http://localhost:5000/proveedores/');
      if (!res.ok) throw new Error('Error al obtener proveedores');
      const data = await res.json();
      setProveedores(data);
    } catch (err) {
      setError('No se pudieron cargar los proveedores');
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/proveedores/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Error al crear proveedor');
      setForm({ nombre_proveedor: '', telefono: '', email: '', direccion: '' });
      fetchProveedores();
    } catch (err) {
      setError('Error al crear proveedor');
    }
  };

  const handleEdit = (proveedor) => {
    setEditId(proveedor.id_proveedor);
    setForm({
      nombre_proveedor: proveedor.nombre_proveedor,
      telefono: proveedor.telefono || '',
      email: proveedor.email || '',
      direccion: proveedor.direccion || '',
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/proveedores/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Error al actualizar proveedor');
      setEditId(null);
      setForm({ nombre_proveedor: '', telefono: '', email: '', direccion: '' });
      fetchProveedores();
    } catch (err) {
      setError('Error al actualizar proveedor');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este proveedor?')) return;
    try {
      const res = await fetch(`http://localhost:5000/proveedores/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar proveedor');
      fetchProveedores();
    } catch (err) {
      setError('Error al eliminar proveedor');
    }
  };

  return (
    <div>
      <h2>Proveedores</h2>
      {error && <p style={{color:'red'}}>{error}</p>}
      <ul>
        {proveedores.length === 0 ? (
          <li>No hay proveedores para mostrar.</li>
        ) : (
          proveedores.map((proveedor) => (
            <li key={proveedor.id_proveedor}>
              {editId === proveedor.id_proveedor ? (
                <form onSubmit={handleUpdate} style={{display:'inline'}}>
                  <input name="nombre_proveedor" value={form.nombre_proveedor} onChange={handleChange} required />
                  <input name="telefono" value={form.telefono} onChange={handleChange} />
                  <input name="email" value={form.email} onChange={handleChange} />
                  <input name="direccion" value={form.direccion} onChange={handleChange} />
                  <button type="submit">Guardar</button>
                  <button type="button" onClick={()=>setEditId(null)}>Cancelar</button>
                </form>
              ) : (
                <>
                  <b>{proveedor.nombre_proveedor}</b> | {proveedor.email || 'Sin email'} | {proveedor.telefono || 'Sin teléfono'} | {proveedor.direccion || 'Sin dirección'} | Insumos: {proveedor.cantidad_insumos || 0}
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
        <input name="telefono" placeholder="Teléfono (opcional)" value={form.telefono} onChange={handleChange} />
        <input name="email" placeholder="Email (opcional)" value={form.email} onChange={handleChange} />
        <input name="direccion" placeholder="Dirección (opcional)" value={form.direccion} onChange={handleChange} />
        <button type="submit">Agregar</button>
      </form>
    </div>
  );
};

export default Proveedores; 