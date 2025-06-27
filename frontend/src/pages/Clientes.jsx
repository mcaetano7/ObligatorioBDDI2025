import React, { useEffect, useState } from 'react';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ nombre_empresa: '', direccion: '', telefono: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await fetch('http://localhost:5000/clientes', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          },
        });
        if (!res.ok) throw new Error('Error al obtener clientes');
        const data = await res.json();
        setClientes(data);
      } catch (err) {
        setError('No se pudieron cargar los clientes');
      }
    };
    fetchClientes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Alta de cliente no implementada aún.');
    // Aquí irá el fetch POST cuando el backend esté listo
  };

  const handleEdit = (cliente) => {
    setEditId(cliente.id_cliente);
    setForm({
      nombre_empresa: cliente.nombre_empresa,
      direccion: cliente.direccion,
      telefono: cliente.telefono,
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    alert('Edición de cliente no implementada aún.');
    setEditId(null);
    // Aquí irá el fetch PUT cuando el backend esté listo
  };

  const handleDelete = (id) => {
    alert('Eliminación de cliente no implementada aún.');
    // Aquí irá el fetch DELETE cuando el backend esté listo
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
                  <input name="direccion" value={form.direccion} onChange={handleChange} required />
                  <input name="telefono" value={form.telefono} onChange={handleChange} required />
                  <button type="submit">Guardar</button>
                  <button type="button" onClick={()=>setEditId(null)}>Cancelar</button>
                </form>
              ) : (
                <>
                  <b>{cliente.nombre_empresa}</b> | {cliente.direccion} | {cliente.telefono}
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
        <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} required />
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} required />
        <button type="submit">Agregar</button>
      </form>
    </div>
  );
};

export default Clientes; 