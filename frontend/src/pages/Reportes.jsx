import React, { useState, useEffect } from 'react';

const Reportes = () => {
  const [idUsuario, setIdUsuario] = useState('');
  const [gasto, setGasto] = useState(null);
  const [ganancia, setGanancia] = useState(null);
  const [error, setError] = useState('');
  
  // Nuevos estados para reportes de administrador
  const [insumosConsumo, setInsumosConsumo] = useState([]);
  const [tecnicosMantenimientos, setTecnicosMantenimientos] = useState([]);
  const [clientesMaquinas, setClientesMaquinas] = useState([]);
  const [gananciasEmpresa, setGananciasEmpresa] = useState([]);
  const [maquinasRentables, setMaquinasRentables] = useState([]);
  const [estadoMantenimientos, setEstadoMantenimientos] = useState(null);
  const [resumenMensual, setResumenMensual] = useState(null);

  // Cargar reportes de administrador al montar el componente
  useEffect(() => {
    cargarReportesAdmin();
  }, []);

  const cargarReportesAdmin = async () => {
    try {
      // Cargar todos los reportes en paralelo
      const [
        resInsumos,
        resTecnicos,
        resClientes,
        resGanancias,
        resMaquinas,
        resEstado,
        resResumen
      ] = await Promise.all([
        fetch('http://localhost:5000/reportes/insumos-mayor-consumo'),
        fetch('http://localhost:5000/reportes/tecnicos-mas-mantenimientos'),
        fetch('http://localhost:5000/reportes/clientes-mas-maquinas'),
        fetch('http://localhost:5000/reportes/ganancias-empresa'),
        fetch('http://localhost:5000/reportes/maquinas-mas-rentables'),
        fetch('http://localhost:5000/reportes/estado-mantenimientos'),
        fetch('http://localhost:5000/reportes/resumen-mensual')
      ]);

      if (resInsumos.ok) setInsumosConsumo(await resInsumos.json());
      if (resTecnicos.ok) setTecnicosMantenimientos(await resTecnicos.json());
      if (resClientes.ok) setClientesMaquinas(await resClientes.json());
      if (resGanancias.ok) setGananciasEmpresa(await resGanancias.json());
      if (resMaquinas.ok) setMaquinasRentables(await resMaquinas.json());
      if (resEstado.ok) setEstadoMantenimientos(await resEstado.json());
      if (resResumen.ok) setResumenMensual(await resResumen.json());
    } catch (err) {
      console.error('Error cargando reportes:', err);
    }
  };

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
      
      {/* Reporte de cliente */}
      <div style={{border: '1px solid #ccc', padding: '20px', margin: '20px 0'}}>
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
      </div>

      {/* Reportes de Administrador */}
      <div style={{border: '1px solid #ccc', padding: '20px', margin: '20px 0'}}>
        <h3>Resumen Mensual</h3>
        {resumenMensual && (
          <div>
            <p>Total alquileres: {resumenMensual.total_alquileres}</p>
            <p>Ingresos por alquiler: ${resumenMensual.ingresos_alquiler}</p>
            <p>Ganancia empresa: ${resumenMensual.ganancia_empresa}</p>
            <p>Ventas totales: ${resumenMensual.ventas_totales}</p>
            <p>Clientes activos: {resumenMensual.clientes_activos}</p>
            <p>Máquinas activas: {resumenMensual.maquinas_activas}</p>
          </div>
        )}
      </div>

      <div style={{border: '1px solid #ccc', padding: '20px', margin: '20px 0'}}>
        <h3>Estado de Mantenimientos</h3>
        {estadoMantenimientos && (
          <div>
            <p>Total solicitudes: {estadoMantenimientos.total_solicitudes}</p>
            <p>Completados: {estadoMantenimientos.completados}</p>
            <p>En proceso: {estadoMantenimientos.en_proceso}</p>
            <p>Pendientes: {estadoMantenimientos.pendientes}</p>
            <p>Porcentaje completado: {estadoMantenimientos.porcentaje_completado}%</p>
          </div>
        )}
      </div>

      <div style={{border: '1px solid #ccc', padding: '20px', margin: '20px 0'}}>
        <h3>Insumos con mayor consumo y costos</h3>
        {insumosConsumo.length > 0 ? (
          <ul>
            {insumosConsumo.map((insumo, index) => (
              <li key={index}>
                <strong>{insumo.nombre_insumo}</strong> - 
                Total consumido: {insumo.total_consumido} {insumo.unidad_medida} - 
                Costo total: ${insumo.costo_total} - 
                Proveedor: {insumo.nombre_proveedor || 'Sin proveedor'}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay datos de consumo de insumos</p>
        )}
      </div>

      <div style={{border: '1px solid #ccc', padding: '20px', margin: '20px 0'}}>
        <h3>Técnicos con más mantenimientos realizados</h3>
        {tecnicosMantenimientos.length > 0 ? (
          <ul>
            {tecnicosMantenimientos.map((tecnico, index) => (
              <li key={index}>
                <strong>{tecnico.nombre_tecnico}</strong> - 
                Total: {tecnico.total_mantenimientos} - 
                Completados: {tecnico.mantenimientos_completados} - 
                Pendientes: {tecnico.mantenimientos_pendientes} - 
                % Completado: {tecnico.porcentaje_completado}%
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay datos de técnicos</p>
        )}
      </div>

      <div style={{border: '1px solid #ccc', padding: '20px', margin: '20px 0'}}>
        <h3>Clientes con más máquinas instaladas</h3>
        {clientesMaquinas.length > 0 ? (
          <ul>
            {clientesMaquinas.map((cliente, index) => (
              <li key={index}>
                <strong>{cliente.nombre_empresa}</strong> - 
                Máquinas: {cliente.cantidad_maquinas} - 
                Total gastado: ${cliente.total_gastado} - 
                Alquileres: {cliente.total_alquileres}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay datos de clientes</p>
        )}
      </div>

      <div style={{border: '1px solid #ccc', padding: '20px', margin: '20px 0'}}>
        <h3>Máquinas más rentables</h3>
        {maquinasRentables.length > 0 ? (
          <ul>
            {maquinasRentables.map((maquina, index) => (
              <li key={index}>
                <strong>{maquina.modelo} {maquina.marca}</strong> - 
                Veces alquilada: {maquina.veces_alquilada} - 
                Ingresos: ${maquina.ingresos_totales} - 
                Ganancia empresa: ${maquina.ganancia_empresa}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay datos de máquinas</p>
        )}
      </div>

      <div style={{border: '1px solid #ccc', padding: '20px', margin: '20px 0'}}>
        <h3>Ganancias de la empresa por mes</h3>
        {gananciasEmpresa.length > 0 ? (
          <ul>
            {gananciasEmpresa.map((ganancia, index) => (
              <li key={index}>
                <strong>{ganancia.mes}/{ganancia.anio}</strong> - 
                Ganancia: ${ganancia.ganancia_total} - 
                Ventas: ${ganancia.ventas_total} - 
                % Ganancia: {ganancia.porcentaje_ganancia}%
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay datos de ganancias</p>
        )}
      </div>
    </div>
  );
};

export default Reportes; 