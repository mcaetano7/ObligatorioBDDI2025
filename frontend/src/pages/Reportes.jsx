import React, { useState } from 'react';

const Reportes = () => {
  const [idUsuario, setIdUsuario] = useState('');
  const [gasto, setGasto] = useState(null);
  const [ganancia, setGanancia] = useState(null);
  const [error, setError] = useState('');

  const handleConsultar = async () => {
    setError('');
    setGasto(null);
    setGanancia(null);
    try {
      // Consulta gasto total
      const resGasto = await fetch(`http://localhost:5000/cliente/gasto-total/${idUsuario}`);
      if (!resGasto.ok) throw new Error('Error al consultar gasto');
      const dataGasto = await resGasto.json();
      setGasto(dataGasto.gasto_total);
      // Consulta ganancia total
      const resGan = await fetch(`http://localhost:5000/cliente/ganancia-total/${idUsuario}`);
      if (!resGan.ok) throw new Error('Error al consultar ganancia');
      const dataGan = await resGan.json();
      setGanancia(dataGan);
    } catch (err) {
      setError('No se pudo consultar el reporte.');
    }
  };

  return (
    <div>
      <h2>Reportes</h2>
      <h3>Total mensual a cobrar a un cliente</h3>
      <input placeholder="ID usuario" value={idUsuario} onChange={e=>setIdUsuario(e.target.value)} />
      <button onClick={handleConsultar}>Consultar</button>
      {gasto !== null && <p>Gasto total: ${gasto}</p>}
      {ganancia && (
        <div>
          <p>Ganancia cliente: ${ganancia.total_ganancia_cliente}</p>
          <p>Ganancia empresa: ${ganancia.total_ganancia_empresa}</p>
          <p>Total ventas: ${ganancia.total_ventas}</p>
        </div>
      )}
      {error && <p style={{color:'red'}}>{error}</p>}
      <hr />
      <h3>Insumos con mayor consumo y costos</h3>
      <p><i>Falta implementar endpoint en backend</i></p>
      <hr />
      <h3>Técnicos con más mantenimientos realizados</h3>
      <p><i>Falta implementar endpoint en backend</i></p>
      <hr />
      <h3>Clientes con más máquinas instaladas</h3>
      <p><i>Falta implementar endpoint en backend</i></p>
    </div>
  );
};

export default Reportes; 