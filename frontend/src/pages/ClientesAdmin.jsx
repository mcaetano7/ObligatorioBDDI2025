import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ClientesAdmin = () => {
  const [clientes, setClientes] = useState([]);
  const [nuevo, setNuevo] = useState({
    nombre: '',
    nombre_empresa: '',
    direccion: '',
    telefono: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchClientes = async () => {
    const res = await axios.get('http://localhost:5000/cliente');
    setClientes(res.data);
  };

  useEffect(() => { fetchClientes(); }, []);

  const handleChange = e => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const handleAdd = async e => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/cliente', nuevo);
      setNuevo({ nombre: '', nombre_empresa: '', direccion: '', telefono: '', password: '' });
      fetchClientes();
    } catch {
      setError('Error al agregar cliente');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar cliente?')) return;
    try {
      await axios.delete(`http://localhost:5000/cliente/${id}`);
      fetchClientes();
      setError('');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error && (err.response.data.error.toLowerCase().includes('alquiler') || err.response.data.error.toLowerCase().includes('foreign'))) {
        setError('No se puede eliminar un cliente que tiene alquileres asociados');
      } else {
        setError('Error al eliminar cliente');
      }
    }
  };

  const handleEdit = (c) => {
    setEditId(c.id_cliente);
    setEditData({
      nombre_empresa: c.nombre_empresa,
      direccion: c.direccion,
      telefono: c.telefono
    });
  };

  const handleEditChange = e => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async e => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/cliente/${editId}`, editData);
      setEditId(null);
      setEditData({});
      fetchClientes();
    } catch {
      setError('Error al editar cliente');
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditData({});
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Administrar Clientes</h2>
      <form onSubmit={handleAdd} style={{ marginBottom: 20 }}>
        <input name="nombre" placeholder="Nombre" value={nuevo.nombre} onChange={handleChange} required />
        <input name="nombre_empresa" placeholder="Nombre empresa" value={nuevo.nombre_empresa} onChange={handleChange} required />
        <input name="direccion" placeholder="Dirección" value={nuevo.direccion} onChange={handleChange} required />
        <input name="telefono" placeholder="Teléfono" value={nuevo.telefono} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Contraseña" value={nuevo.password} onChange={handleChange} required />
        <button type="submit">Agregar</button>
        {error && <span style={{ color: 'red', marginLeft: 10 }}>{error}</span>}
      </form>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Nombre</th><th>Nombre empresa</th><th>Dirección</th><th>Teléfono</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(c => (
            <tr key={c.id_cliente}>
              {editId === c.id_cliente ? (
                <>
                  <td>{c.nombre}</td>
                  <td><input name="nombre_empresa" value={editData.nombre_empresa} onChange={handleEditChange} required /></td>
                  <td><input name="direccion" value={editData.direccion} onChange={handleEditChange} required /></td>
                  <td><input name="telefono" value={editData.telefono} onChange={handleEditChange} required /></td>
                  <td>
                    <button onClick={handleEditSave}>Guardar</button>
                    <button type="button" onClick={handleEditCancel}>Cancelar</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{c.nombre}</td>
                  <td>{c.nombre_empresa}</td>
                  <td>{c.direccion}</td>
                  <td>{c.telefono}</td>
                  <td>
                    <button onClick={() => handleEdit(c)}>Editar</button>
                    <button onClick={() => handleDelete(c.id_cliente)}>Eliminar</button>
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

export default ClientesAdmin; 