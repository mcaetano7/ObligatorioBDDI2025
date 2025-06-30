import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AlquilerElement from '../components/AlquilerElement';

const DashboardCliente = () => {
  const { user } = useAuth();
  const [alquileres, setAlquileres] = useState([]);
  const [idCliente, setIdCliente] = useState(null);
  const [gananciaTotal, setGananciaTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {

    //traer la id de cliente e base a la is de usuario
    const fetchCliente = async () => {
      const res = await axios.get(`http://localhost:5000/cliente/id-cliente/${user.id_usuario}`);
      const id = res.data.id_cliente;
      setIdCliente(id);

      //traer los alquileres de un cleinte
      const r2 = await axios.get(`http://localhost:5000/cliente/alquileres-cliente/${id}`);
      setAlquileres(r2.data);

      //traer suma de las ganancias de los alquileres de un cliente
      const r3 = await axios.get(`http://localhost:5000/cliente/ganancias-totales/${id}`);
      setGananciaTotal(parseFloat(r3.data.total_ganancia).toFixed(2));
    };
    fetchCliente();
  }, [user.id_usuario]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Mis Alquileres</h2>
      {alquileres.map(a => <AlquilerElement key={a.id_alquiler} alquiler={a} />)}

      <p style={{ marginTop: 20 }}><b>Total de ganancias estimadas:</b> ${gananciaTotal}</p>

      <button onClick={() => navigate('/maquinas-cliente')} style={{ marginTop: 20 }}>
        Añadir alquiler
      </button>
      <button onClick={() => navigate('/ganancias-cliente')} style={{ marginTop: 10 }}>
        Ver ganancias por máquina
      </button>
    </div>
  );
};

export default DashboardCliente;