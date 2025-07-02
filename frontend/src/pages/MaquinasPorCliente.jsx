import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MaquinasPorCliente = () => {
  const { user } = useAuth();
  const [alquileres, setAlquileres] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [consumos, setConsumos] = useState({}); // { id_alquiler: [consumos] }
  const [nuevoConsumo, setNuevoConsumo] = useState({}); // { id_alquiler: { id_insumo, cantidad_consumida, fecha_consumo } }
  const [showMantenimiento, setShowMantenimiento] = useState({});
  const [mantenimientoDesc, setMantenimientoDesc] = useState({});
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      // Obtener alquileres del cliente
      const r1 = await axios.get(`http://localhost:5000/cliente/alquileres-cliente/${user.id_cliente}`);
      setAlquileres(r1.data);
      // Obtener insumos disponibles
      const r2 = await axios.get('http://localhost:5000/insumos');
      setInsumos(r2.data);
      // Obtener consumos por alquiler
      const consumosPorAlquiler = {};
      for (const a of r1.data) {
        const r3 = await axios.get(`http://localhost:5000/insumos/consumo/${a.id_alquiler}`);
        consumosPorAlquiler[a.id_alquiler] = r3.data;
      }
      setConsumos(consumosPorAlquiler);
    };
    fetchData();
  }, [user]);

  const handleChange = (id_alquiler, field, value) => {
    setNuevoConsumo({
      ...nuevoConsumo,
      [id_alquiler]: {
        ...nuevoConsumo[id_alquiler],
        [field]: value
      }
    });
  };

  const handleAddConsumo = async (id_alquiler, e) => {
    e.preventDefault();
    const data = {
      id_alquiler,
      id_insumo: nuevoConsumo[id_alquiler]?.id_insumo,
      cantidad_consumida: parseFloat(nuevoConsumo[id_alquiler]?.cantidad_consumida),
      fecha_consumo: nuevoConsumo[id_alquiler]?.fecha_consumo
    };
    if (!data.id_insumo || !data.cantidad_consumida || !data.fecha_consumo) return;
    await axios.post('http://localhost:5000/insumos/consumo', data);
    // Refrescar consumos
    const r3 = await axios.get(`http://localhost:5000/insumos/consumo/${id_alquiler}`);
    setConsumos({ ...consumos, [id_alquiler]: r3.data });
    setNuevoConsumo({ ...nuevoConsumo, [id_alquiler]: {} });
  };

  const handleSolicitarMantenimiento = async (id_alquiler, e) => {
    e.preventDefault();
    setMensaje('');
    try {
      await axios.post('http://localhost:5000/cliente/solicitudes', {
        id_alquiler,
        descripcion: mantenimientoDesc[id_alquiler] || ''
      });
      setMensaje('Solicitud de mantenimiento enviada');
      setShowMantenimiento({ ...showMantenimiento, [id_alquiler]: false });
      setMantenimientoDesc({ ...mantenimientoDesc, [id_alquiler]: '' });
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setMensaje('Error al solicitar mantenimiento');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Mis máquinas alquiladas</h2>
      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
      {alquileres.length === 0 && <p>No tienes máquinas alquiladas.</p>}
      {alquileres.map(a => (
        <div key={a.id_alquiler} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
          <p><b>Alquiler #{a.id_alquiler}</b></p>
          <p>Máquina: {a.id_maquina}</p>
          <p>Inicio: {a.fecha_inicio} | Fin: {a.fecha_fin || 'En curso'}</p>
          <h4>Consumos registrados</h4>
          {consumos[a.id_alquiler]?.length ? (
            <ul>
              {consumos[a.id_alquiler].map((c, idx) => (
                <li key={idx}>{c.nombre_insumo} - {c.cantidad_consumida} {c.unidad_medida} ({c.fecha_consumo})</li>
              ))}
            </ul>
          ) : <p>No hay consumos registrados.</p>}
          <h4>Registrar consumo</h4>
          <form onSubmit={e => handleAddConsumo(a.id_alquiler, e)}>
            <select
              required
              value={nuevoConsumo[a.id_alquiler]?.id_insumo || ''}
              onChange={e => handleChange(a.id_alquiler, 'id_insumo', e.target.value)}
            >
              <option value="">Seleccione insumo</option>
              {insumos.map(i => (
                <option key={i.id_insumo} value={i.id_insumo}>{i.nombre_insumo} ({i.unidad_medida})</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Cantidad"
              required
              value={nuevoConsumo[a.id_alquiler]?.cantidad_consumida || ''}
              onChange={e => handleChange(a.id_alquiler, 'cantidad_consumida', e.target.value)}
              min="0.01"
              step="0.01"
            />
            <input
              type="date"
              required
              value={nuevoConsumo[a.id_alquiler]?.fecha_consumo || ''}
              onChange={e => handleChange(a.id_alquiler, 'fecha_consumo', e.target.value)}
            />
            <button type="submit">Registrar</button>
          </form>
          <h4>Solicitar mantenimiento</h4>
          {!showMantenimiento[a.id_alquiler] ? (
            <button onClick={() => setShowMantenimiento({ ...showMantenimiento, [a.id_alquiler]: true })}>
              Solicitar mantenimiento
            </button>
          ) : (
            <form onSubmit={e => handleSolicitarMantenimiento(a.id_alquiler, e)}>
              <input
                type="text"
                placeholder="Descripción del problema"
                value={mantenimientoDesc[a.id_alquiler] || ''}
                onChange={e => setMantenimientoDesc({ ...mantenimientoDesc, [a.id_alquiler]: e.target.value })}
                required
              />
              <button type="submit">Enviar solicitud</button>
              <button type="button" onClick={() => setShowMantenimiento({ ...showMantenimiento, [a.id_alquiler]: false })}>Cancelar</button>
            </form>
          )}
        </div>
      ))}
    </div>
  );
};

export default MaquinasPorCliente; 