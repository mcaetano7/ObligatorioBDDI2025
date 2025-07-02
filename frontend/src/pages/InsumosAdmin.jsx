import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InsumosAdmin = () => {
  const [insumos, setInsumos] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre_insumo: '', unidad_medida: '', costo_unitario: '', id_proveedor: '' });
  const [error, setError] = useState('');
  const [proveedores, setProveedores] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchInsumos = async () => {
    const res = await axios.get('http://localhost:5000/insumos');
    setInsumos(res.data);
  };
  const fetchProveedores = async () => {
    const res = await axios.get('http://localhost:5000/proveedores');
    setProveedores(res.data);
  };

  useEffect(() => { fetchInsumos(); fetchProveedores(); }, []);

  const handleChange = e => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const handleAdd = async e => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/insumos', nuevo);
      setNuevo({ nombre_insumo: '', unidad_medida: '', costo_unitario: '', id_proveedor: '' });
      fetchInsumos();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Error al agregar insumo');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar insumo?')) return;
    try {
      await axios.delete(`http://localhost:5000/insumos/${id}`);
      fetchInsumos();
      setError('');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error && (err.response.data.error.toLowerCase().includes('consumo') || err.response.data.error.toLowerCase().includes('alquiler') || err.response.data.error.toLowerCase().includes('foreign'))) {
        setError('No se puede eliminar un insumo que está asociado a consumos o alquileres');
      } else {
        setError('Error al eliminar insumo');
      }
    }
  };

  const handleEdit = (i) => {
    setEditId(i.id_insumo);
    setEditData({
      nombre_insumo: i.nombre_insumo,
      unidad_medida: i.unidad_medida,
      costo_unitario: i.costo_unitario,
      id_proveedor: i.id_proveedor
    });
  };

  const handleEditChange = e => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async e => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/insumos/${editId}`, editData);
      setEditId(null);
      setEditData({});
      fetchInsumos();
    } catch {
      setError('Error al editar insumo');
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditData({});
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Administrar Insumos</h2>
      <form onSubmit={handleAdd} style={{ marginBottom: 20 }}>
        <input name="nombre_insumo" placeholder="Nombre" value={nuevo.nombre_insumo} onChange={handleChange} required />
        <input name="unidad_medida" placeholder="Unidad" value={nuevo.unidad_medida} onChange={handleChange} required />
        <input name="costo_unitario" placeholder="Costo unitario" type="number" value={nuevo.costo_unitario} onChange={handleChange} required />
        <select name="id_proveedor" value={nuevo.id_proveedor} onChange={handleChange} required>
          <option value="">Proveedor</option>
          {proveedores.map(p => <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre_proveedor}</option>)}
        </select>
        <button type="submit">Agregar</button>
        {error && <span style={{ color: 'red', marginLeft: 10 }}>{error}</span>}
      </form>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Nombre</th><th>Unidad</th><th>Costo</th><th>Proveedor</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {insumos.map(i => (
            <tr key={i.id_insumo}>
              {editId === i.id_insumo ? (
                <>
                  <td><input name="nombre_insumo" value={editData.nombre_insumo} onChange={handleEditChange} required /></td>
                  <td><input name="unidad_medida" value={editData.unidad_medida} onChange={handleEditChange} required /></td>
                  <td><input name="costo_unitario" type="number" value={editData.costo_unitario} onChange={handleEditChange} required /></td>
                  <td>
                    <select name="id_proveedor" value={editData.id_proveedor} onChange={handleEditChange} required>
                      <option value="">Proveedor</option>
                      {proveedores.map(p => <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre_proveedor}</option>)}
                    </select>
                  </td>
                  <td>
                    <button onClick={handleEditSave}>Guardar</button>
                    <button type="button" onClick={handleEditCancel}>Cancelar</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{i.nombre_insumo}</td>
                  <td>{i.unidad_medida}</td>
                  <td>{i.costo_unitario}</td>
                  <td>{proveedores.find(p => p.id_proveedor === i.id_proveedor)?.nombre_proveedor || '-'}</td>
                  <td>
                    <button onClick={() => handleEdit(i)}>Editar</button>
                    <button onClick={() => handleDelete(i.id_insumo)}>Eliminar</button>
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

export default InsumosAdmin; 