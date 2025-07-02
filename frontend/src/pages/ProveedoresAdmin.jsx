import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProveedoresAdmin = () => {
  const [proveedores, setProveedores] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre_proveedor: '', telefono: '', email: '', direccion: '' });
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchProveedores = async () => {
    const res = await axios.get('http://localhost:5000/proveedores');
    setProveedores(res.data);
  };

  useEffect(() => { fetchProveedores(); }, []);

  const handleChange = e => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const handleAdd = async e => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/proveedores', nuevo);
      setNuevo({ nombre_proveedor: '', telefono: '', email: '', direccion: '' });
      fetchProveedores();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Error al agregar proveedor');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar proveedor?')) return;
    try {
      await axios.delete(`http://localhost:5000/proveedores/${id}`);
      fetchProveedores();
      setError('');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error && (err.response.data.error.toLowerCase().includes('insumo') || err.response.data.error.toLowerCase().includes('foreign'))) {
        setError('No se puede eliminar un proveedor que tiene insumos asociados');
      } else {
        setError('Error al eliminar proveedor');
      }
    }
  };

  const handleEdit = (p) => {
    setEditId(p.id_proveedor);
    setEditData({ ...p });
  };

  const handleEditChange = e => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async e => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/proveedores/${editId}`, editData);
      setEditId(null);
      setEditData({});
      fetchProveedores();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Error al editar proveedor');
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditData({});
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Administrar Proveedores</h2>
      <form onSubmit={handleAdd} style={{ marginBottom: 20 }}>
        <input name="nombre_proveedor" placeholder="Nombre" value={nuevo.nombre_proveedor} onChange={handleChange} required />
        <input name="telefono" placeholder="Teléfono" value={nuevo.telefono} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={nuevo.email} onChange={handleChange} required />
        <input name="direccion" placeholder="Dirección" value={nuevo.direccion} onChange={handleChange} required />
        <button type="submit">Agregar</button>
        {error && <span style={{ color: 'red', marginLeft: 10 }}>{error}</span>}
      </form>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Nombre</th><th>Teléfono</th><th>Email</th><th>Dirección</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map(p => (
            <tr key={p.id_proveedor}>
              {editId === p.id_proveedor ? (
                <>
                  <td><input name="nombre_proveedor" value={editData.nombre_proveedor} onChange={handleEditChange} required /></td>
                  <td><input name="telefono" value={editData.telefono} onChange={handleEditChange} required /></td>
                  <td><input name="email" value={editData.email} onChange={handleEditChange} required /></td>
                  <td><input name="direccion" value={editData.direccion} onChange={handleEditChange} required /></td>
                  <td>
                    <button onClick={handleEditSave}>Guardar</button>
                    <button type="button" onClick={handleEditCancel}>Cancelar</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{p.nombre_proveedor}</td>
                  <td>{p.telefono}</td>
                  <td>{p.email}</td>
                  <td>{p.direccion}</td>
                  <td>
                    <button onClick={() => handleEdit(p)}>Editar</button>
                    <button onClick={() => handleDelete(p.id_proveedor)}>Eliminar</button>
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

export default ProveedoresAdmin; 