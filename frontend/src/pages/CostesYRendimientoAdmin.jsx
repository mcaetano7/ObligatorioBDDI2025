import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CostesYRendimientoAdmin = () => {
  const [rendimiento, setRendimiento] = useState([]);
  const [costesPorMaquina, setCostesPorMaquina] = useState([]);
  const [costesPorCliente, setCostesPorCliente] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Rendimiento de cada máquina
      const r1 = await axios.get('http://localhost:5000/reportes/rendimiento-maquinas');
      setRendimiento(r1.data);

      // Costes por máquina y por cliente (usando consumo de insumos)
      const alquileres = await axios.get('http://localhost:5000/alquileres');
      const maquinas = await axios.get('http://localhost:5000/maquinas');
      const clientes = await axios.get('http://localhost:5000/cliente');
      let costesMaquina = [];
      let costesCliente = {};
      for (const a of alquileres.data) {
        const consumos = await axios.get(`http://localhost:5000/insumos/consumo/${a.id_alquiler}`);
        let total = 0;
        for (const c of consumos.data) {
          total += (parseFloat(c.cantidad_consumida) * parseFloat(c.costo_unitario || 0));
        }
        const maquina = maquinas.data.find(m => m.id_maquina === a.id_maquina);
        const cliente = clientes.data.find(cl => cl.id_cliente === a.id_cliente);
        costesMaquina.push({
          id_maquina: a.id_maquina,
          modelo: maquina?.modelo,
          marca: maquina?.marca,
          cliente: cliente?.nombre_empresa,
          coste_insumos: total
        });
        if (!costesCliente[a.id_cliente]) costesCliente[a.id_cliente] = { cliente: cliente?.nombre_empresa, total: 0 };
        costesCliente[a.id_cliente].total += total;
      }
      setCostesPorMaquina(costesMaquina);
      setCostesPorCliente(Object.values(costesCliente));
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Costes mensuales por Máquina</h2>
      <table border="1" cellPadding="5" style={{ marginBottom: 40 }}>
        <thead>
          <tr>
            <th>Máquina</th><th>Modelo</th><th>Marca</th><th>Cliente</th><th>Coste Insumos</th>
          </tr>
        </thead>
        <tbody>
          {costesPorMaquina.map((row, idx) => (
            <tr key={idx}>
              <td>{row.id_maquina}</td>
              <td>{row.modelo}</td>
              <td>{row.marca}</td>
              <td>{row.cliente}</td>
              <td>${row.coste_insumos.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Costes mensuales por Cliente</h2>
      <table border="1" cellPadding="5" style={{ marginBottom: 40 }}>
        <thead>
          <tr>
            <th>Cliente</th><th>Coste Total Insumos</th>
          </tr>
        </thead>
        <tbody>
          {costesPorCliente.map((row, idx) => (
            <tr key={idx}>
              <td>{row.cliente}</td>
              <td>${row.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Rendimiento de cada Máquina</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Modelo</th><th>Marca</th><th>Ganancia Total</th><th>Costo Insumos</th><th>Rendimiento</th>
          </tr>
        </thead>
        <tbody>
          {rendimiento.map((row, idx) => (
            <tr key={idx}>
              <td>{row.modelo}</td>
              <td>{row.marca}</td>
              <td>${parseFloat(row.ganancia_total).toFixed(2)}</td>
              <td>${parseFloat(row.costo_insumos).toFixed(2)}</td>
              <td>${parseFloat(row.rendimiento).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CostesYRendimientoAdmin; 