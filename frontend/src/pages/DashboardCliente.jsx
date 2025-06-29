import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AlquilerElement from '../components/AlquilerElement';

const DashboardCliente = () => {
  const { user } = useAuth();
  const [alquileres, setAlquileres] = useState([]);
  const [idCliente, setIdCliente] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCliente = async () => {
      const res = await axios.get(`http://localhost:5000/cliente/id-cliente/${user.id_usuario}`);
      const id = res.data.id_cliente;
      setIdCliente(id);
      const r2 = await axios.get(`http://localhost:5000/cliente/alquileres-cliente/${id}`);
      setAlquileres(r2.data);
    };
    fetchCliente();
  }, [user.id_usuario]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Mis Alquileres</h2>
      {alquileres.map(a => <AlquilerElement key={a.id_alquiler} alquiler={a} />)}
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