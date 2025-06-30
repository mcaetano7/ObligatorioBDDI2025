import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MaquinasPorCliente = () => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const fetchDatos = async () => {
      const res = await axios.get('http://localhost:5000/reportes/maquinas-por-cliente');
      setDatos(res.data);
    };
    fetchDatos();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Máquinas por Cliente y Ubicación</h2>
      <ul>
        {datos.map((item, idx) => (
          <li key={idx} style={{ marginBottom: 10 }}>
            <b>Cliente:</b> {item.nombre_cliente || 'Desconocido'}<br />
            <b>Ubicación:</b> {item.ubicacion || 'No especificada'}<br />
            <b>Máquina:</b> {item.marca} {item.modelo}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MaquinasPorCliente;