import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAllCafes } from '../services/api';

const MaquinasAdmin = () => {
  const [maquinas, setMaquinas] = useState([]);
  const [nuevo, setNuevo] = useState({ modelo: '', marca: '', capacidad_cafe: '', capacidad_agua: '', costo_mensual_alquiler: '', porcentaje_ganancia_empresa: '' });
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [allCafes, setAllCafes] = useState([]);
  const [editCafes, setEditCafes] = useState([]);
  const [nuevoCafes, setNuevoCafes] = useState([]);
  const [mostrarCafes, setMostrarCafes] = useState(false);

  const fetchMaquinas = async () => {
    const res = await axios.get('http://localhost:5000/maquinas');
    setMaquinas(res.data);
  };

  const fetchCafes = async () => {
    const cafes = await getAllCafes();
    setAllCafes(cafes);
  };

  useEffect(() => { fetchMaquinas(); fetchCafes(); }, []);

  const handleChange = e => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const handleNuevoCafesChange = e => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(Number(options[i].value));
    }
    setNuevoCafes(selected);
  };

  const handleAdd = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/maquinas', nuevo);
      // Si la máquina se creó correctamente y hay cafés seleccionados, asignarlos
      if (res.status === 201 && nuevoCafes.length > 0) {
        const idMaquina = res.data.id_maquina;
        await axios.put(`http://localhost:5000/maquinas/${idMaquina}/cafes`, { cafes: nuevoCafes });
      }
      setNuevo({ modelo: '', marca: '', capacidad_cafe: '', capacidad_agua: '', costo_mensual_alquiler: '', porcentaje_ganancia_empresa: '' });
      setNuevoCafes([]);
      setMostrarCafes(false);
      fetchMaquinas();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Error al agregar máquina');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar máquina?')) return;
    try {
      await axios.delete(`http://localhost:5000/maquinas/${id}`);
      fetchMaquinas();
      setError('');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error && (err.response.data.error.toLowerCase().includes('alquilada') || err.response.data.error.toLowerCase().includes('foreign'))) {
        setError('No se puede eliminar una máquina que está alquilada');
      } else {
        setError('Error al eliminar máquina');
      }
    }
  };

  const handleEdit = (m) => {
    setEditId(m.id_maquina);
    setEditData({ ...m });
    setEditCafes(m.cafes ? m.cafes.map(c => c.id_cafe) : []);
  };

  const handleEditChange = e => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditCafesChange = e => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(Number(options[i].value));
    }
    setEditCafes(selected);
  };

  const handleEditSave = async e => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/maquinas/${editId}`, editData);
      await axios.put(`http://localhost:5000/maquinas/${editId}/cafes`, { cafes: editCafes });
      setEditId(null);
      setEditData({});
      setEditCafes([]);
      fetchMaquinas();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Error al editar máquina');
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditData({});
    setEditCafes([]);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Administrar Máquinas</h2>
      <form onSubmit={handleAdd} style={{ marginBottom: 20 }}>
        <input name="modelo" placeholder="Modelo" value={nuevo.modelo} onChange={handleChange} required />
        <input name="marca" placeholder="Marca" value={nuevo.marca} onChange={handleChange} required />
        <input name="capacidad_cafe" placeholder="Capacidad café (g)" type="number" value={nuevo.capacidad_cafe} onChange={handleChange} required />
        <input name="capacidad_agua" placeholder="Capacidad agua (ml)" type="number" value={nuevo.capacidad_agua} onChange={handleChange} required />
        <input name="costo_mensual_alquiler" placeholder="Costo mensual alquiler" type="number" value={nuevo.costo_mensual_alquiler} onChange={handleChange} required />
        <input name="porcentaje_ganancia_empresa" placeholder="% ganancia empresa" type="number" value={nuevo.porcentaje_ganancia_empresa} onChange={handleChange} required />
        <button type="button" onClick={() => setMostrarCafes(!mostrarCafes)} style={{ marginRight: 10 }}>
          {mostrarCafes ? 'Ocultar cafés' : 'Agregar cafés'}
        </button>
        {mostrarCafes && (
          <div style={{ marginTop: 10 }}>
            <label>Cafés:</label>
            <select multiple value={nuevoCafes} onChange={handleNuevoCafesChange} style={{ minWidth: 150, minHeight: 60 }}>
              {allCafes.map(cafe => (
                <option key={cafe.id_cafe} value={cafe.id_cafe}>{cafe.nombre_cafe} - ${cafe.precio_venta}</option>
              ))}
            </select>
          </div>
        )}
        <button type="submit">Agregar</button>
        {error && <span style={{ color: 'red', marginLeft: 10 }}>{error}</span>}
      </form>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Modelo</th><th>Marca</th><th>Café (g)</th><th>Agua (ml)</th><th>Costo mensual</th><th>% Ganancia</th><th>Cafés</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {maquinas.map(m => (
            <tr key={m.id_maquina}>
              {editId === m.id_maquina ? (
                <>
                  <td><input name="modelo" value={editData.modelo} onChange={handleEditChange} required /></td>
                  <td><input name="marca" value={editData.marca} onChange={handleEditChange} required /></td>
                  <td><input name="capacidad_cafe" type="number" value={editData.capacidad_cafe} onChange={handleEditChange} required /></td>
                  <td><input name="capacidad_agua" type="number" value={editData.capacidad_agua} onChange={handleEditChange} required /></td>
                  <td><input name="costo_mensual_alquiler" type="number" value={editData.costo_mensual_alquiler} onChange={handleEditChange} required /></td>
                  <td><input name="porcentaje_ganancia_empresa" type="number" value={editData.porcentaje_ganancia_empresa} onChange={handleEditChange} required /></td>
                  <td>
                    <select multiple value={editCafes} onChange={handleEditCafesChange} style={{ minWidth: 150, minHeight: 60 }}>
                      {allCafes.map(cafe => (
                        <option key={cafe.id_cafe} value={cafe.id_cafe}>{cafe.nombre_cafe} - ${cafe.precio_venta}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button onClick={handleEditSave}>Guardar</button>
                    <button type="button" onClick={handleEditCancel}>Cancelar</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{m.modelo}</td>
                  <td>{m.marca}</td>
                  <td>{m.capacidad_cafe}</td>
                  <td>{m.capacidad_agua}</td>
                  <td>{m.costo_mensual_alquiler}</td>
                  <td>{m.porcentaje_ganancia_empresa}</td>
                  <td>{m.cafes && m.cafes.length > 0 ? m.cafes.map(c => `${c.nombre_cafe} ($${c.precio_venta})`).join(', ') : '-'}</td>
                  <td>
                    <button onClick={() => handleEdit(m)}>Editar</button>
                    <button onClick={() => handleDelete(m.id_maquina)}>Eliminar</button>
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

export default MaquinasAdmin; 