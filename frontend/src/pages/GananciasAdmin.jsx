import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GananciasAdmin = () => {
  const [porCliente, setPorCliente] = useState([]);
  const [porMaquina, setPorMaquina] = useState([]);

  useEffect(() => {
    const fetchDatos = async () => {
      const r1 = await axios.get('http://localhost:5000/reportes/ganancias-empresa');
      const r2 = await axios.get('http://localhost:5000/reportes/maquinas-mas-rentables');
      setPorCliente(r1.data);
      setPorMaquina(r2.data);
    };
    fetchDatos();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Ganancias de la Empresa</h2>

      <h3>Por Cliente</h3>
      <ul>
        {porCliente.map((c, i) => (
          <li key={i}>
            <b>{c.nombre}</b>: ${c.total_ganancia}
          </li>
        ))}
      </ul>

      <h3>Por Máquina</h3>
      <ul>
        {porMaquina.map((m, i) => (
          <li key={i}>
            <b>{m.modelo} ({m.id_maquina})</b>: ${m.total_ganancia}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GananciasAdmin;
