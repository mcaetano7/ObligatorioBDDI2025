import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AlquilerElement = ({ alquiler }) => {
  const [detalles, setDetalles] = useState(null);
  const [insumosDisponibles, setInsumosDisponibles] = useState([]);
  const [nuevoInsumo, setNuevoInsumo] = useState({
    id_insumo: '',
    cantidad_consumida: ''
  });

  const fetchDetalles = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/cliente/alquiler-detalle/${alquiler.id_alquiler}`);
      setDetalles(res.data);
    } catch (err) {
      console.error('Error al obtener detalles del alquiler');
    }
  };

  const fetchInsumos = async () => {
    const res = await axios.get('http://localhost:5000/insumos/');
    setInsumosDisponibles(res.data);
  };

  useEffect(() => {
    fetchDetalles();
    fetchInsumos();
  }, []);

  const handleAgregarInsumo = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/insumos/consumo', {
        id_alquiler: alquiler.id_alquiler,
        id_insumo: nuevoInsumo.id_insumo,
        cantidad_consumida: parseFloat(nuevoInsumo.cantidad_consumida)
      });
      setNuevoInsumo({ id_insumo: '', cantidad_consumida: '' });
      fetchDetalles(); // recargar lista
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert('Error al agregar insumo');
    }
  };

  const handleEliminarInsumo = async id_consumo => {
    if (!window.confirm('¿Eliminar este insumo del alquiler?')) return;
    try {
      await axios.delete(`http://localhost:5000/insumos/consumo/${id_consumo}`);
      fetchDetalles(); // recargar lista
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert('Error al eliminar insumo');
    }
  };

  if (!detalles) return <p>Cargando detalles...</p>;

  return (
    <div style={{ border: '1px solid gray', padding: 15, marginBottom: 15 }}>
      <h3>Alquiler #{alquiler.id_alquiler}</h3>
      <p><b>Inicio:</b> {detalles.info.fecha_inicio}</p>
      <p><b>Fin:</b> {detalles.info.fecha_fin || 'En curso'}</p>
      <p><b>Costo:</b> ${detalles.info.coste_total_alquiler}</p>
      <p><b>Máquina:</b> {detalles.info.marca} – {detalles.info.modelo}</p>

      <h4>Insumos utilizados</h4>
      {detalles.insumos.length === 0 ? (
        <p>No hay insumos registrados aún.</p>
      ) : (
        <ul>
          {detalles.insumos.map((i, idx) => (
            <li key={idx}>
              {i.nombre_insumo} – {i.cantidad_consumida} {i.unidad_medida} ({i.fecha_consumo})
              <button onClick={() => handleEliminarInsumo(i.id_consumo)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}

      <h4>Agregar insumo</h4>
      <form onSubmit={handleAgregarInsumo}>
        <select
          required
          value={nuevoInsumo.id_insumo}
          onChange={e => setNuevoInsumo({ ...nuevoInsumo, id_insumo: e.target.value })}
        >
          <option value="">Seleccione un insumo</option>
          {insumosDisponibles.map(i => (
            <option key={i.id_insumo} value={i.id_insumo}>
              {i.nombre_insumo} ({i.unidad_medida})
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Cantidad"
          required
          value={nuevoInsumo.cantidad_consumida}
          onChange={e => setNuevoInsumo({ ...nuevoInsumo, cantidad_consumida: e.target.value })}
          min="0.01"
          step="0.01"
        />
        <button type="submit">Agregar</button>
      </form>
    </div>
  );
};

export default AlquilerElement;