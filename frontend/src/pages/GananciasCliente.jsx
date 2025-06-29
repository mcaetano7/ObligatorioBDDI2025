import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const GananciasCliente = () => {
  const { user } = useAuth();
  const [ganancias, setGanancias] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const clienteRes = await axios.get(`http://localhost:5000/cliente/id-cliente/${user.id_usuario}`);
      const idCliente = clienteRes.data.id_cliente;

      const res = await axios.get(`http://localhost:5000/cliente/ganancias-maquina/${idCliente}`);
      setGanancias(res.data);
    };
    fetchData();
  }, [user]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Ganancias por máquina</h2>
      {ganancias.map((g, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <p><b>{g.marca} - {g.modelo}</b> ({g.mes}/{g.anio})</p>
          <p>Ventas: ${g.total_ventas}</p>
          <p>Ganancia Cliente: ${g.ganancia_cliente}</p>
          <p>Ganancia Empresa: ${g.ganancia_empresa}</p>
        </div>
      ))}
    </div>
  );
};

export default GananciasCliente;