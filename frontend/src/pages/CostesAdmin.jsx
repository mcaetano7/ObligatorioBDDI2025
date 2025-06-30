import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CostesAdmin = () => {
  const [costes, setCostes] = useState([]);

  useEffect(() => {
    const fetchCostes = async () => {
      const res = await axios.get('http://localhost:5000/reportes/resumen-mensual');
      setCostes(res.data);
    };
    fetchCostes();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Costes Mensuales por Máquina</h2>
      <ul>
        {costes.map((c, i) => (
          <li key={i}>
            <b>Máquina #{c.id_maquina}</b>: ${c.total_coste_insumos} en insumos durante {c.mes}/{c.anio}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CostesAdmin;
