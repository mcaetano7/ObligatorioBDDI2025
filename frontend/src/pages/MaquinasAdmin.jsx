import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MaquinasAdmin = () => {
  const [maquinas, setMaquinas] = useState([]);
  const [form, setForm] = useState({
    modelo: '',
    marca: '',
    capacidad_cafe: '',
    capacidad_agua: '',
    costo_mensual_alquiler: '',
    porcentaje_ganancia_empresa: ''
  });
  const [editandoId, setEditandoId] = useState(null);

  const fetchMaquinas = async () => {
    const res = await axios.get('http://localhost:5000/maquinas');
    setMaquinas(res.data);
  };

  useEffect(() => {
    fetchMaquinas();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      ...form,
      capacidad_cafe: parseFloat(form.capacidad_cafe),
      capacidad_agua: parseFloat(form.capacidad_agua),
      costo_mensual_alquiler: parseFloat(form.costo_mensual_alquiler),
      porcentaje_ganancia_empresa: parseFloat(form.porcentaje_ganancia_empresa)
    };
    try {
      if (editandoId) {
        await axios.put(`http://localhost:5000/maquinas/${editandoId}`, payload);
      } else {
        await axios.post('http://localhost:5000/maquinas', payload);
      }
      setForm({
        modelo: '',
        marca: '',
        capacidad_cafe: '',
        capacidad_agua: '',
        costo_mensual_alquiler: '',
        porcentaje_ganancia_empresa: ''
      });
      setEditandoId(null);
      fetchMaquinas();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert('Error al guardar la máquina');
    }
  };

  const handleEditar = maquina => {
    setForm({
      modelo: maquina.modelo,
      marca: maquina.marca,
      capacidad_cafe: maquina.capacidad_cafe,
      capacidad_agua: maquina.capacidad_agua,
      costo_mensual_alquiler: maquina.costo_mensual_alquiler,
      porcentaje_ganancia_empresa: maquina.porcentaje_ganancia_empresa
    });
    setEditandoId(maquina.id_maquina);
  };

  const handleEliminar = async id => {
    if (!window.confirm('¿Eliminar esta máquina?')) return;
    try {
      await axios.delete(`http://localhost:5000/maquinas/${id}`);
      fetchMaquinas();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar la máquina');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Gestión de Máquinas</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        {['modelo', 'marca', 'capacidad_cafe', 'capacidad_agua', 'costo_mensual_alquiler', 'porcentaje_ganancia_empresa'].map(field => (
          <input
            key={field}
            name={field}
            placeholder={field.replace(/_/g, ' ')}
            value={form[field]}
            onChange={handleChange}
            required
          />
        ))}
        <button type="submit">{editandoId ? 'Actualizar' : 'Agregar'}</button>
      </form>
      <ul>
        {maquinas.map(m => (
          <li key={m.id_maquina}>
            <b>{m.marca} {m.modelo}</b> - Café: {m.capacidad_cafe}g / Agua: {m.capacidad_agua}ml - ${m.costo_mensual_alquiler} / {m.porcentaje_ganancia_empresa}%
            <button onClick={() => handleEditar(m)}>Editar</button>
            <button onClick={() => handleEliminar(m.id_maquina)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MaquinasAdmin;