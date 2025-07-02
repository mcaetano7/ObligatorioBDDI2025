import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const GastosCliente = () => {
  const { user } = useAuth();
  const [maquinas, setMaquinas] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      // Obtener alquileres del cliente
      const r1 = await axios.get(`http://localhost:5000/cliente/alquileres-cliente/${user.id_cliente}`);
      // Para cada alquiler, obtener datos de la máquina
      const maquinasConCosto = await Promise.all(r1.data.map(async (a) => {
        const r2 = await axios.get(`http://localhost:5000/maquinas/${a.id_maquina}`);
        return {
          ...a,
          modelo: r2.data.modelo,
          marca: r2.data.marca,
          costo_mensual_alquiler: r2.data.costo_mensual_alquiler
        };
      }));
      setMaquinas(maquinasConCosto);
      setTotal(maquinasConCosto.reduce((acc, m) => acc + Number(m.costo_mensual_alquiler || 0), 0));
    };
    fetchData();
  }, [user]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Gasto mensual de alquiler de mis máquinas</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Máquina</th><th>Modelo</th><th>Marca</th><th>Costo mensual</th>
          </tr>
        </thead>
        <tbody>
          {maquinas.map((m, idx) => (
            <tr key={idx}>
              <td>{m.id_maquina}</td>
              <td>{m.modelo}</td>
              <td>{m.marca}</td>
              <td>${m.costo_mensual_alquiler}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3}><b>Total</b></td>
            <td><b>${total}</b></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default GastosCliente; 