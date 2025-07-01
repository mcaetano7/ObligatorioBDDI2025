import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ClientesAdmin = () => {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({
    rut: '',
    nombre_empresa: '',
    direccion: '',
    telefono: ''
  });
  const [editandoId, setEditandoId] = useState(null);

  const fetchClientes = async () => {
    const res = await axios.get('http://localhost:5000/cliente');
    setClientes(res.data);
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editandoId) {
        await axios.put(`http://localhost:5000/cliente/${editandoId}`, form);
      } else {
        await axios.post('http://localhost:5000/cliente', form);
      }
      setForm({ rut: '', nombre_empresa: '', direccion: '', telefono: '' });
      setEditandoId(null);
      fetchClientes();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert('Error al guardar cliente');
    }
  };

  const handleEditar = cliente => {
    setForm({
      rut: cliente.rut,
      nombre_empresa: cliente.nombre_empresa,
      direccion: cliente.direccion,
      telefono: cliente.telefono
    });
    setEditandoId(cliente.id_cliente);
  };

  const handleEliminar = async id => {
    if (!window.confirm('¿Eliminar este cliente?')) return;
    try {
      await axios.delete(`http://localhost:5000/cliente/${id}`);
      fetchClientes();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar cliente');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Gestión de Clientes</h2>
      <form onSubmit={handleSubmit}>
        <input name="rut" placeholder="RUT (ID usuario)" value={form.rut} onChange={handleChange} required />
        <input name="nombre_empresa" placeholder="Nombre empresa" value={form.nombre_empresa} onChange={handleChange} required />
        <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} required />
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
        <button type="submit">{editandoId ? 'Actualizar' : 'Agregar'}</button>
      </form>
      <ul>
        {clientes.map(c => (
          <li key={c.id_cliente}>
            {c.nombre_empresa} – {c.telefono} – {c.direccion}
            <button onClick={() => handleEditar(c)}>Editar</button>
            <button onClick={() => handleEliminar(c.id_cliente)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientesAdmin;