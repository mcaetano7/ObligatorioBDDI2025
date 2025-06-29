import React, { useEffect, useState } from 'react';

const Maquinas = () => {
  const [maquinas, setMaquinas] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ modelo: '', marca: '', capacidad_cafe: '', capacidad_agua: '', costo_mensual_alquiler: '', porcentaje_ganancia_empresa: '' });
  const [editId, setEditId] = useState(null);

  const fetchMaquinas = async () => {
    try {
      const res = await fetch('http://localhost:5000/maquinas/');
      if (!res.ok) throw new Error('Error al obtener máquinas');
      const data = await res.json();
      setMaquinas(data);
    } catch (err) {
      setError('No se pudieron cargar las máquinas');
    }
  };

  useEffect(() => {
    fetchMaquinas();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/maquinas/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Error al crear máquina');
      setForm({ modelo: '', marca: '', capacidad_cafe: '', capacidad_agua: '', costo_mensual_alquiler: '', porcentaje_ganancia_empresa: '' });
      fetchMaquinas();
    } catch (err) {
      setError('Error al crear máquina');
    }
  };

  const handleEdit = (maquina) => {
    setEditId(maquina.id_maquina);
    setForm({
      modelo: maquina.modelo,
      marca: maquina.marca,
      capacidad_cafe: maquina.capacidad_cafe,
      capacidad_agua: maquina.capacidad_agua,
      costo_mensual_alquiler: maquina.costo_mensual_alquiler,
      porcentaje_ganancia_empresa: maquina.porcentaje_ganancia_empresa,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/maquinas/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Error al actualizar máquina');
      setEditId(null);
      setForm({ modelo: '', marca: '', capacidad_cafe: '', capacidad_agua: '', costo_mensual_alquiler: '', porcentaje_ganancia_empresa: '' });
      fetchMaquinas();
    } catch (err) {
      setError('Error al actualizar máquina');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta máquina?')) return;
    try {
      const res = await fetch(`http://localhost:5000/maquinas/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar máquina');
      fetchMaquinas();
    } catch (err) {
      setError('Error al eliminar máquina');
    }
  };

  return (
    <div>
      <h2>Máquinas</h2>
      {error && <p style={{color:'red'}}>{error}</p>}
      <ul>
        {maquinas.length === 0 ? (
          <li>No hay máquinas para mostrar.</li>
        ) : (
          maquinas.map((maquina) => (
            <li key={maquina.id_maquina}>
              {editId === maquina.id_maquina ? (
                <form onSubmit={handleUpdate} style={{display:'inline'}}>
                  <input name="modelo" value={form.modelo} onChange={handleChange} required />
                  <input name="marca" value={form.marca} onChange={handleChange} required />
                  <input name="capacidad_cafe" value={form.capacidad_cafe} onChange={handleChange} required />
                  <input name="capacidad_agua" value={form.capacidad_agua} onChange={handleChange} required />
                  <input name="costo_mensual_alquiler" value={form.costo_mensual_alquiler} onChange={handleChange} required />
                  <input name="porcentaje_ganancia_empresa" value={form.porcentaje_ganancia_empresa} onChange={handleChange} required />
                  <button type="submit">Guardar</button>
                  <button type="button" onClick={()=>setEditId(null)}>Cancelar</button>
                </form>
              ) : (
                <>
                  <b>{maquina.modelo}</b> | {maquina.marca} | Café: {maquina.capacidad_cafe} | Agua: {maquina.capacidad_agua} | Alquiler: ${maquina.costo_mensual_alquiler} | % Empresa: {maquina.porcentaje_ganancia_empresa}
                  <button onClick={()=>handleEdit(maquina)}>Editar</button>
                  <button onClick={()=>handleDelete(maquina.id_maquina)}>Eliminar</button>
                </>
              )}
            </li>
          ))
        )}
      </ul>
      <h3>Agregar Máquina</h3>
      <form onSubmit={handleSubmit}>
        <input name="modelo" placeholder="Modelo" value={form.modelo} onChange={handleChange} required />
        <input name="marca" placeholder="Marca" value={form.marca} onChange={handleChange} required />
        <input name="capacidad_cafe" placeholder="Capacidad café" value={form.capacidad_cafe} onChange={handleChange} required />
        <input name="capacidad_agua" placeholder="Capacidad agua" value={form.capacidad_agua} onChange={handleChange} required />
        <input name="costo_mensual_alquiler" placeholder="Costo alquiler" value={form.costo_mensual_alquiler} onChange={handleChange} required />
        <input name="porcentaje_ganancia_empresa" placeholder="% ganancia empresa" value={form.porcentaje_ganancia_empresa} onChange={handleChange} required />
        <button type="submit">Agregar</button>
      </form>
    </div>
  );
};

export default Maquinas; 