import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RendimientoAdmin = () => {
  const [rendimiento, setRendimiento] = useState([]);

  useEffect(() => {
    const fetchDatos = async () => {
      const res = await axios.get('http://localhost:5000/reportes/maquinas-mas-rentables');
      setRendimiento(res.data);
    };
    fetchDatos();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Rendimiento de Máquinas</h2>
      <ul>
        {rendimiento.map((m, i) => (
          <li key={i}>
            <b>{m.modelo} (#{m.id_maquina})</b>: ${m.total_ganancia} generados
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RendimientoAdmin;
