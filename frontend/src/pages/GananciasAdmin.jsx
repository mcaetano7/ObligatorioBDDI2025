import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GananciasAdmin = () => {
  const [resumenGeneral, setResumenGeneral] = useState({});
  const [gananciasPorCliente, setGananciasPorCliente] = useState([]);
  const [gananciasPorMaquina, setGananciasPorMaquina] = useState([]);
  const [ventasPorCafe, setVentasPorCafe] = useState([]);
  const [ventasPorMaquina, setVentasPorMaquina] = useState([]);
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [mes, anio]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Resumen general del período
      const resResumen = await axios.get(`http://localhost:5000/reportes/resumen-mensual?mes=${mes}&anio=${anio}`);
      setResumenGeneral(resResumen.data);

      // Ganancias por cliente
      const resGananciasCliente = await axios.get('http://localhost:5000/reportes/ganancias-por-alquiler');
      setGananciasPorCliente(resGananciasCliente.data);

      // Ganancias por máquina
      const resGananciasMaquina = await axios.get('http://localhost:5000/reportes/maquinas-mas-rentables');
      setGananciasPorMaquina(resGananciasMaquina.data);

      // Ventas por café
      const resVentasCafe = await axios.get('http://localhost:5000/ventas/reporte-cafes');
      setVentasPorCafe(resVentasCafe.data);

      // Ventas por máquina
      const resVentasMaquina = await axios.get('http://localhost:5000/ventas/reporte-maquinas');
      setVentasPorMaquina(resVentasMaquina.data);

    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU'
    }).format(amount || 0);
  };

  const getMonthName = (month) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[month - 1];
  };

  if (loading) {
    return <div style={{ padding: 20 }}>Cargando datos de ganancias...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard de Ganancias</h2>
      
      {/* Filtros de período */}
      <div style={{ marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
        <label>Período:</label>
        <select value={mes} onChange={(e) => setMes(Number(e.target.value))}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
            <option key={m} value={m}>{getMonthName(m)}</option>
          ))}
        </select>
        <select value={anio} onChange={(e) => setAnio(Number(e.target.value))}>
          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <button onClick={fetchData}>Actualizar</button>
      </div>

      {/* Resumen general */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: 20, 
        marginBottom: 30 
      }}>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: 20, 
          borderRadius: 8, 
          border: '1px solid #dee2e6' 
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Ingresos por Alquiler</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#28a745' }}>
            {formatCurrency(resumenGeneral.ingresos_alquiler)}
          </p>
        </div>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: 20, 
          borderRadius: 8, 
          border: '1px solid #dee2e6' 
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Ganancia Empresa</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#007bff' }}>
            {formatCurrency(resumenGeneral.ganancia_empresa)}
          </p>
        </div>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: 20, 
          borderRadius: 8, 
          border: '1px solid #dee2e6' 
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Ventas Totales</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#ffc107' }}>
            {formatCurrency(resumenGeneral.ventas_totales)}
          </p>
        </div>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: 20, 
          borderRadius: 8, 
          border: '1px solid #dee2e6' 
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Clientes Activos</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#6f42c1' }}>
            {resumenGeneral.clientes_activos || 0}
          </p>
        </div>
      </div>

      {/* Ventas por café */}
      <h3>Ventas por Tipo de Café</h3>
      <table border="1" cellPadding="5" style={{ marginBottom: 30, width: '100%' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th>Café</th>
            <th>Precio</th>
            <th>Total Ventas</th>
            <th>Cantidad Total</th>
            <th>Ingresos Totales</th>
            <th>Precio Promedio</th>
          </tr>
        </thead>
        <tbody>
          {ventasPorCafe.map((cafe, idx) => (
            <tr key={idx}>
              <td>{cafe.nombre_cafe}</td>
              <td>{formatCurrency(cafe.precio_venta)}</td>
              <td>{cafe.total_ventas || 0}</td>
              <td>{cafe.cantidad_total || 0}</td>
              <td>{formatCurrency(cafe.ingresos_totales)}</td>
              <td>{formatCurrency(cafe.precio_promedio)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Ganancias por máquina */}
      <h3>Ganancias por Máquina</h3>
      <table border="1" cellPadding="5" style={{ marginBottom: 30, width: '100%' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th>Modelo</th>
            <th>Marca</th>
            <th>Costo Mensual</th>
            <th>Veces Alquilada</th>
            <th>Ingresos Totales</th>
            <th>Ganancia Empresa</th>
            <th>Ganancia Promedio</th>
          </tr>
        </thead>
        <tbody>
          {gananciasPorMaquina.map((maquina, idx) => (
            <tr key={idx}>
              <td>{maquina.modelo}</td>
              <td>{maquina.marca}</td>
              <td>{formatCurrency(maquina.costo_mensual_alquiler)}</td>
              <td>{maquina.veces_alquilada || 0}</td>
              <td>{formatCurrency(maquina.ingresos_totales)}</td>
              <td>{formatCurrency(maquina.ganancia_empresa)}</td>
              <td>{formatCurrency(maquina.ganancia_promedio_por_alquiler)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Ventas por máquina */}
      <h3>Ventas por Máquina</h3>
      <table border="1" cellPadding="5" style={{ marginBottom: 30, width: '100%' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th>Modelo</th>
            <th>Marca</th>
            <th>Total Ventas</th>
            <th>Cantidad Total</th>
            <th>Ingresos Totales</th>
            <th>Promedio por Venta</th>
          </tr>
        </thead>
        <tbody>
          {ventasPorMaquina.map((maquina, idx) => (
            <tr key={idx}>
              <td>{maquina.modelo}</td>
              <td>{maquina.marca}</td>
              <td>{maquina.total_ventas || 0}</td>
              <td>{maquina.cantidad_total || 0}</td>
              <td>{formatCurrency(maquina.ingresos_totales)}</td>
              <td>{formatCurrency(maquina.promedio_por_venta)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Ganancias por cliente */}
      <h3>Ganancias por Cliente</h3>
      <table border="1" cellPadding="5" style={{ width: '100%' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th>ID Alquiler</th>
            <th>Cliente</th>
            <th>Costo Mensual</th>
            <th>Ganancia Empresa</th>
          </tr>
        </thead>
        <tbody>
          {gananciasPorCliente.map((cliente, idx) => (
            <tr key={idx}>
              <td>{cliente.id_alquiler}</td>
              <td>{cliente.cliente}</td>
              <td>{formatCurrency(cliente.costo_mensual_alquiler)}</td>
              <td>{formatCurrency(cliente.ganancia_empresa)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GananciasAdmin; 