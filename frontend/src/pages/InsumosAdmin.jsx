import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InsumosAdmin = () => {
  const [insumos, setInsumos] = useState([]);
  const [form, setForm] = useState({
    nombre_insumo: '',
    unidad_medida: '',
    costo_unitario: '',
    id_proveedor: ''
  });
  const [editandoId, setEditandoId] = useState(null);

  const fetchInsumos = async () => {
    const res = await axios.get('http://localhost:5000/insumos/');
    setInsumos(res.data);
  };

  useEffect(() => {
    fetchInsumos();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      ...form,
      costo_unitario: parseFloat(form.costo_unitario),
      id_proveedor: form.id_proveedor || null
    };
    try {
      if (editandoId) {
        await axios.put(`http://localhost:5000/insumos/${editandoId}`, payload);
      } else {
        await axios.post('http://localhost:5000/insumos/', payload);
      }
      setForm({ nombre_insumo: '', unidad_medida: '', costo_unitario: '', id_proveedor: '' });
      setEditandoId(null);
      fetchInsumos();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert('Error al guardar insumo');
    }
  };

  const handleEditar = insumo => {
    setForm({
      nombre_insumo: insumo.nombre_insumo,
      unidad_medida: insumo.unidad_medida,
      costo_unitario: insumo.costo_unitario,
      id_proveedor: insumo.id_proveedor || ''
    });
    setEditandoId(insumo.id_insumo);
  };

  const handleEliminar = async id => {
    if (!window.confirm('¿Eliminar este insumo?')) return;
    try {
      await axios.delete(`http://localhost:5000/insumos/${id}`);
      fetchInsumos();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar insumo');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Gestión de Insumos</h2>
      <form onSubmit={handleSubmit}>
        <input name="nombre_insumo" placeholder="Nombre" value={form.nombre_insumo} onChange={handleChange} required />
        <input name="unidad_medida" placeholder="Unidad de medida" value={form.unidad_medida} onChange={handleChange} required />
        <input name="costo_unitario" placeholder="Costo unitario" type="number" value={form.costo_unitario} onChange={handleChange} required />
        <input name="id_proveedor" placeholder="ID proveedor (opcional)" value={form.id_proveedor} onChange={handleChange} />
        <button type="submit">{editandoId ? 'Actualizar' : 'Agregar'}</button>
      </form>
      <ul>
        {insumos.map(i => (
          <li key={i.id_insumo}>
            {i.nombre_insumo} ({i.unidad_medida}) - ${i.costo_unitario} – Proveedor: {i.nombre_proveedor || 'Ninguno'}
            <button onClick={() => handleEditar(i)}>Editar</button>
            <button onClick={() => handleEliminar(i.id_insumo)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InsumosAdmin;