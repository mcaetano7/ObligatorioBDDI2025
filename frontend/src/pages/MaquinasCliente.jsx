import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MaquinasCliente = () => {
  const [maquinas, setMaquinas] = useState([]);
  const { user } = useAuth();
  const [idCliente, setIdCliente] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("idCliente actualizado:", idCliente);
  }, [idCliente]);

  useEffect(() => {
    const fetchData = async () => {
      const clienteRes = await axios.get(`http://localhost:5000/cliente/id-cliente/${user.id_usuario}`);
      setIdCliente(clienteRes.data.id_cliente);
      const res = await axios.get('http://localhost:5000/cliente/maquinas/disponibles');
      setMaquinas(res.data);
    };
    fetchData();
  }, [user.id_usuario]);

  const alquilarMaquina = async (id_maquina) => {
    const fecha_inicio = prompt("Fecha inicio (YYYY-MM-DD):");
    const fecha_fin = prompt("Fecha fin (YYYY-MM-DD):");
    if (!fecha_inicio || !fecha_fin) return;

    try {

      await axios.post('http://localhost:5000/cliente/alquileres', {
        id_cliente: idCliente,
        id_maquina,
        fecha_inicio,
        fecha_fin
      });
      alert('Máquina alquilada con éxito');
      navigate('/dashboard-cliente');
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert('Error al alquilar máquina');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Máquinas disponibles</h2>
      {maquinas.map(m => (
        <div key={m.id_maquina} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
          <p><b>{m.marca} - {m.modelo}</b></p>
          <p>Café: {m.capacidad_cafe}g, Agua: {m.capacidad_agua}ml</p>
          <p>Costo mensual: ${m.costo_mensual_alquiler}</p>
          <button onClick={() => alquilarMaquina(m.id_maquina)}>Alquilar</button>
        </div>
      ))}
    </div>
  );
};

export default MaquinasCliente;