import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProveedoresAdmin = () => {
  const [proveedores, setProveedores] = useState([]);
  const [form, setForm] = useState({
    nombre_proveedor: '',
    telefono: '',
    email: '',
    direccion: ''
  });
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    const res = await axios.get('http://localhost:5000/proveedores/');
    setProveedores(res.data);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editandoId) {
        await axios.put(`http://localhost:5000/proveedores/${editandoId}`, form);
      } else {
        await axios.post('http://localhost:5000/proveedores/', form);
      }
      setForm({ nombre_proveedor: '', telefono: '', email: '', direccion: '' });
      setEditandoId(null);
      fetchProveedores();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert('Error al guardar el proveedor');
    }
  };

  const handleEditar = prov => {
    setForm({
      nombre_proveedor: prov.nombre_proveedor,
      telefono: prov.telefono,
      email: prov.email,
      direccion: prov.direccion
    });
    setEditandoId(prov.id_proveedor);
  };

  const handleEliminar = async id => {
    try {
      await axios.delete(`http://localhost:5000/proveedores/${id}`);
      fetchProveedores();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert('No se puede eliminar este proveedor. Puede estar vinculado a otros registros.');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Gestión de Proveedores</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          name="nombre_proveedor"
          placeholder="Nombre"
          value={form.nombre_proveedor}
          onChange={handleChange}
          required
        />
        <input
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="direccion"
          placeholder="Dirección"
          value={form.direccion}
          onChange={handleChange}
        />
        <button type="submit">{editandoId ? 'Actualizar' : 'Crear'}</button>
      </form>
      <ul>
        {proveedores.map(prov => (
          <li key={prov.id_proveedor}>
            <b>{prov.nombre_proveedor}</b> | Tel: {prov.telefono} | Email: {prov.email} | Dir: {prov.direccion}
            <button onClick={() => handleEditar(prov)}>Editar</button>
            <button onClick={() => handleEliminar(prov.id_proveedor)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProveedoresAdmin;