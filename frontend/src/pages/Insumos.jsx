import React, { useState, useEffect } from 'react';

const Insumos = () => {
  const [insumos, setInsumos] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ nombre_insumo: '', unidad_medida: '', costo_unitario: '', id_proveedor: '' });
  const [editId, setEditId] = useState(null);

  const fetchInsumos = async () => {
    try {
      const res = await fetch('http://localhost:5000/insumos/');
      if (!res.ok) throw new Error('Error al obtener insumos');
      const data = await res.json();
      setInsumos(data);
    } catch (err) {
      setError('No se pudieron cargar los insumos');
    }
  };

  useEffect(() => {
    fetchInsumos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/insumos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Error al crear insumo');
      setForm({ nombre_insumo: '', unidad_medida: '', costo_unitario: '', id_proveedor: '' });
      fetchInsumos();
    } catch (err) {
      setError('Error al crear insumo');
    }
  };

  const handleEdit = (insumo) => {
    setEditId(insumo.id_insumo);
    setForm({
      nombre_insumo: insumo.nombre_insumo,
      unidad_medida: insumo.unidad_medida,
      costo_unitario: insumo.costo_unitario,
      id_proveedor: insumo.id_proveedor || '',
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/insumos/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Error al actualizar insumo');
      setEditId(null);
      setForm({ nombre_insumo: '', unidad_medida: '', costo_unitario: '', id_proveedor: '' });
      fetchInsumos();
    } catch (err) {
      setError('Error al actualizar insumo');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este insumo?')) return;
    try {
      const res = await fetch(`http://localhost:5000/insumos/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar insumo');
      fetchInsumos();
    } catch (err) {
      setError('Error al eliminar insumo');
    }
  };

  return (
    <div>
      <h2>Insumos</h2>
      {error && <p style={{color:'red'}}>{error}</p>}
      <ul>
        {insumos.length === 0 ? (
          <li>No hay insumos para mostrar.</li>
        ) : (
          insumos.map((insumo) => (
            <li key={insumo.id_insumo}>
              {editId === insumo.id_insumo ? (
                <form onSubmit={handleUpdate} style={{display:'inline'}}>
                  <input name="nombre_insumo" value={form.nombre_insumo} onChange={handleChange} required />
                  <input name="unidad_medida" value={form.unidad_medida} onChange={handleChange} required />
                  <input name="costo_unitario" value={form.costo_unitario} onChange={handleChange} required />
                  <input name="id_proveedor" value={form.id_proveedor} onChange={handleChange} />
                  <button type="submit">Guardar</button>
                  <button type="button" onClick={()=>setEditId(null)}>Cancelar</button>
                </form>
              ) : (
                <>
                  <b>{insumo.nombre_insumo}</b> | {insumo.unidad_medida} | ${insumo.costo_unitario} | Proveedor: {insumo.nombre_proveedor || 'Sin proveedor'}
                  <button onClick={()=>handleEdit(insumo)}>Editar</button>
                  <button onClick={()=>handleDelete(insumo.id_insumo)}>Eliminar</button>
                </>
              )}
            </li>
          ))
        )}
      </ul>
      <h3>Agregar Insumo</h3>
      <form onSubmit={handleSubmit}>
        <input name="nombre_insumo" placeholder="Nombre insumo" value={form.nombre_insumo} onChange={handleChange} required />
        <input name="unidad_medida" placeholder="Unidad" value={form.unidad_medida} onChange={handleChange} required />
        <input name="costo_unitario" placeholder="Costo unitario" value={form.costo_unitario} onChange={handleChange} required />
        <input name="id_proveedor" placeholder="ID proveedor (opcional)" value={form.id_proveedor} onChange={handleChange} />
        <button type="submit">Agregar</button>
      </form>
    </div>
  );
};

export default Insumos; 