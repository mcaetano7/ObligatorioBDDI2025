import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AlquilarMaquinaCliente = () => {
  const [maquinas, setMaquinas] = useState([]);
  const [idCliente, setIdCliente] = useState(null);
  const [alquilando, setAlquilando] = useState(null); // id_maquina que se está alquilando
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [mensaje, setMensaje] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      // Obtener id_cliente
      const resId = await axios.get(`http://localhost:5000/cliente/id-cliente/${user.id_usuario}`);
      setIdCliente(resId.data.id_cliente);
      // Obtener máquinas disponibles
      const res = await axios.get('http://localhost:5000/cliente/maquinas/disponibles');
      setMaquinas(res.data);
    };
    fetchData();
  }, [user]);

  const handleAlquilar = async (id_maquina) => {
    setMensaje('');
    if (!fechaInicio || !fechaFin) {
      setMensaje('Debes seleccionar fecha de inicio y fin.');
      return;
    }
    try {
      await axios.post('http://localhost:5000/cliente/alquileres', {
        id_cliente: idCliente,
        id_maquina,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin
      });
      setMensaje('¡Alquiler realizado con éxito!');
      setAlquilando(null);
      // Refrescar lista de máquinas disponibles
      const res = await axios.get('http://localhost:5000/cliente/maquinas/disponibles');
      setMaquinas(res.data);
    } catch (err) {
      setMensaje(err.response?.data?.error || 'Error al alquilar la máquina');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Alquilar Máquina</h2>
      {mensaje && <p>{mensaje}</p>}
      {maquinas.length === 0 ? (
        <p>No hay máquinas disponibles para alquilar.</p>
      ) : (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>ID</th>
              <th>Modelo</th>
              <th>Marca</th>
              <th>Capacidad café</th>
              <th>Capacidad agua</th>
              <th>Costo mensual</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {maquinas.map((m) => (
              <tr key={m.id_maquina}>
                <td>{m.id_maquina}</td>
                <td>{m.modelo}</td>
                <td>{m.marca}</td>
                <td>{m.capacidad_cafe}</td>
                <td>{m.capacidad_agua}</td>
                <td>${m.costo_mensual_alquiler}</td>
                <td>
                  {alquilando === m.id_maquina ? (
                    <>
                      <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
                      <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
                      <button onClick={() => handleAlquilar(m.id_maquina)}>Confirmar</button>
                      <button onClick={() => setAlquilando(null)}>Cancelar</button>
                    </>
                  ) : (
                    <button onClick={() => { setAlquilando(m.id_maquina); setFechaInicio(''); setFechaFin(''); }}>Alquilar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AlquilarMaquinaCliente; 