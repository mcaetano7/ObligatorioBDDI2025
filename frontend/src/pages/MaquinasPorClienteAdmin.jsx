import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MaquinasPorClienteAdmin = () => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Obtener todos los alquileres con datos de cliente y máquina
      const res = await axios.get('http://localhost:5000/reportes/maquinas-por-cliente');
      setDatos(res.data);
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Alquileres activos</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Máquina</th>
            <th>Modelo</th>
            <th>Marca</th>
            <th>Fecha de inicio</th>
            <th>Fecha de fin</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((row, idx) => (
            <tr key={idx}>
              <td>{row.nombre_cliente || '-'}</td>
              <td>{row.id_maquina}</td>
              <td>{row.modelo}</td>
              <td>{row.marca}</td>
              <td>{row.fecha_inicio ? row.fecha_inicio.substring(0, 10) : '-'}</td>
              <td>{row.fecha_fin ? row.fecha_fin.substring(0, 10) : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaquinasPorClienteAdmin; 