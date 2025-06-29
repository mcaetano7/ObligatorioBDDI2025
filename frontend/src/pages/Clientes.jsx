import React, { useEffect, useState } from 'react';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ nombre_empresa: '', direccion: '', telefono: '', email: '', password: '' });
  const [editId, setEditId] = useState(null);

  const fetchClientes = async () => {
    try {
      const res = await fetch('http://localhost:5000/cliente/');
      if (!res.ok) throw new Error('Error al obtener clientes');
      const data = await res.json();
      setClientes(data);
    } catch (err) {
      setError('No se pudieron cargar los clientes');
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/cliente/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre_empresa: form.nombre_empresa,
          direccion: form.direccion,
          telefono: form.telefono,
          email: form.email,
          password: form.password
        }),
      });
      if (!res.ok) throw new Error('Error al crear cliente');
      setForm({ nombre_empresa: '', direccion: '', telefono: '', email: '', password: '' });
      fetchClientes();
    } catch (err) {
      setError('Error al crear cliente');
    }
  };

  const handleEdit = (cliente) => {
    setEditId(cliente.id_cliente);
    setForm({
      nombre_empresa: cliente.nombre_empresa,
      direccion: cliente.direccion || '',
      telefono: cliente.telefono || '',
      email: cliente.email || '',
      password: ''
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/cliente/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre_empresa: form.nombre_empresa,
          direccion: form.direccion,
          telefono: form.telefono
        }),
      });
      if (!res.ok) throw new Error('Error al actualizar cliente');
      setEditId(null);
      setForm({ nombre_empresa: '', direccion: '', telefono: '', email: '', password: '' });
      fetchClientes();
    } catch (err) {
      setError('Error al actualizar cliente');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) return;
    try {
      const res = await fetch(`http://localhost:5000/cliente/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar cliente');
      fetchClientes();
    } catch (err) {
      setError('Error al eliminar cliente');
    }
  };

  return (
    <div>
      <h2>Clientes</h2>
      {error && <p style={{color:'red'}}>{error}</p>}
      <ul>
        {clientes.length === 0 ? (
          <li>No hay clientes para mostrar.</li>
        ) : (
          clientes.map((cliente) => (
            <li key={cliente.id_cliente}>
              {editId === cliente.id_cliente ? (
                <form onSubmit={handleUpdate} style={{display:'inline'}}>
                  <input name="nombre_empresa" value={form.nombre_empresa} onChange={handleChange} required />
                  <input name="direccion" value={form.direccion} onChange={handleChange} />
                  <input name="telefono" value={form.telefono} onChange={handleChange} />
                  <button type="submit">Guardar</button>
                  <button type="button" onClick={()=>setEditId(null)}>Cancelar</button>
                </form>
              ) : (
                <>
                  <b>{cliente.nombre_empresa}</b> | {cliente.direccion || 'Sin dirección'} | {cliente.telefono || 'Sin teléfono'} | {cliente.email || 'Sin email'} | Alquileres: {cliente.cantidad_alquileres || 0}
                  <button onClick={()=>handleEdit(cliente)}>Editar</button>
                  <button onClick={()=>handleDelete(cliente.id_cliente)}>Eliminar</button>
                </>
              )}
            </li>
          ))
        )}
      </ul>
      <h3>Agregar Cliente</h3>
      <form onSubmit={handleSubmit}>
        <input name="nombre_empresa" placeholder="Nombre empresa" value={form.nombre_empresa} onChange={handleChange} required />
        <input name="direccion" placeholder="Dirección (opcional)" value={form.direccion} onChange={handleChange} />
        <input name="telefono" placeholder="Teléfono (opcional)" value={form.telefono} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required />
        <button type="submit">Agregar</button>
      </form>
    </div>
  );
};

export default Clientes; 