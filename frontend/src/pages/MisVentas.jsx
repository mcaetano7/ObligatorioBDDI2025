import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import clienteService from '../services/clienteService';
import ventaService from '../services/ventaService';
import './MisVentas.css';

const MisVentas = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ventas, setVentas] = useState([]);
  const [ganancias, setGanancias] = useState([]);
  const [gananciasTotales, setGananciasTotales] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: ''
  });
  const [idCliente, setIdCliente] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Obtener ID del cliente
      const clienteData = await clienteService.obtenerIdCliente(user.id_usuario);
      setIdCliente(clienteData.id_cliente);
      
      // Obtener ganancias por máquina
      const gananciasData = await clienteService.obtenerGananciasPorMaquina(clienteData.id_cliente);
      setGanancias(gananciasData);
      
      // Obtener ganancias totales
      const totalesData = await clienteService.obtenerGananciasTotales(clienteData.id_cliente);
      setGananciasTotales(totalesData.total_ganancia);
      
      // Obtener ventas del último mes por defecto
      const fechaFin = new Date();
      const fechaInicio = new Date();
      fechaInicio.setMonth(fechaInicio.getMonth() - 1);
      
      const ventasData = await ventaService.obtenerVentasPorPeriodo(
        fechaInicio.toISOString().split('T')[0],
        fechaFin.toISOString().split('T')[0]
      );
      
      // Filtrar solo las ventas del cliente actual
      const ventasCliente = ventasData.filter(venta => venta.id_cliente === clienteData.id_cliente);
      setVentas(ventasCliente);
      
    } catch (error) {
      setError(error.error || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const aplicarFiltros = async () => {
    if (!filtros.fechaInicio || !filtros.fechaFin) {
      setError('Por favor seleccione ambas fechas');
      return;
    }

    try {
      setLoading(true);
      const ventasData = await ventaService.obtenerVentasPorPeriodo(
        filtros.fechaInicio,
        filtros.fechaFin
      );
      
      // Filtrar solo las ventas del cliente actual
      const ventasCliente = ventasData.filter(venta => venta.id_cliente === idCliente);
      setVentas(ventasCliente);
      setError('');
      
    } catch (error) {
      setError(error.error || 'Error al aplicar filtros');
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearMoneda = (monto) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU'
    }).format(monto);
  };

  const obtenerTotalVentas = () => {
    return ventas.reduce((total, venta) => total + (venta.precio_unitario * venta.cantidad), 0);
  };

  const obtenerCantidadTotal = () => {
    return ventas.reduce((total, venta) => total + venta.cantidad, 0);
  };

  if (loading) {
    return (
      <div className="mis-ventas-container">
        <div className="loading">Cargando ventas...</div>
      </div>
    );
  }

  return (
    <div className="mis-ventas-container">
      <div className="mis-ventas-header">
        <div className="header-left">
          <button 
            className="btn btn-secondary back-btn"
            onClick={() => navigate('/dashboard')}
          >
            ← Volver al Dashboard
          </button>
          <h1>Mis Ventas</h1>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Resumen de ganancias */}
      <div className="resumen-ganancias">
        <div className="ganancia-card">
          <h3>Ganancias Totales</h3>
          <p className="ganancia-monto">{formatearMoneda(gananciasTotales)}</p>
        </div>
        <div className="ganancia-card">
          <h3>Total Ventas Período</h3>
          <p className="ganancia-monto">{formatearMoneda(obtenerTotalVentas())}</p>
        </div>
        <div className="ganancia-card">
          <h3>Cantidad Vendida</h3>
          <p className="ganancia-monto">{obtenerCantidadTotal()} unidades</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="filtros-section">
        <h2>Filtrar por Período</h2>
        <div className="filtros-form">
          <div className="form-group">
            <label htmlFor="fechaInicio">Fecha de Inicio:</label>
            <input
              type="date"
              id="fechaInicio"
              name="fechaInicio"
              value={filtros.fechaInicio}
              onChange={handleFiltroChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="fechaFin">Fecha de Fin:</label>
            <input
              type="date"
              id="fechaFin"
              name="fechaFin"
              value={filtros.fechaFin}
              onChange={handleFiltroChange}
            />
          </div>
          <button 
            className="btn btn-primary"
            onClick={aplicarFiltros}
          >
            Aplicar Filtros
          </button>
        </div>
      </div>

      {/* Ganancias por máquina */}
      <div className="ganancias-maquinas">
        <h2>Ganancias por Máquina</h2>
        <div className="ganancias-grid">
          {ganancias.length === 0 ? (
            <div className="no-ganancias">
              <p>No hay ganancias registradas aún.</p>
            </div>
          ) : (
            ganancias.map(ganancia => (
              <div key={`${ganancia.id_alquiler}-${ganancia.mes}-${ganancia.anio}`} className="ganancia-maquina-card">
                <div className="ganancia-maquina-header">
                  <h3>{ganancia.modelo} {ganancia.marca}</h3>
                  <span className="periodo-badge">
                    {ganancia.mes}/{ganancia.anio}
                  </span>
                </div>
                <div className="ganancia-maquina-details">
                  <p><strong>Ganancia Cliente:</strong> {formatearMoneda(ganancia.ganancia_cliente)}</p>
                  <p><strong>Ganancia Empresa:</strong> {formatearMoneda(ganancia.ganancia_empresa)}</p>
                  <p><strong>Total Ventas:</strong> {formatearMoneda(ganancia.total_ventas)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Lista de ventas */}
      <div className="ventas-section">
        <h2>Historial de Ventas</h2>
        {ventas.length === 0 ? (
          <div className="no-ventas">
            <p>No hay ventas registradas en el período seleccionado.</p>
          </div>
        ) : (
          <div className="ventas-table-container">
            <table className="ventas-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Café</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map(venta => (
                  <tr key={venta.id_venta}>
                    <td>{formatearFecha(venta.fecha_venta)}</td>
                    <td>{venta.nombre_cafe}</td>
                    <td>{venta.cantidad}</td>
                    <td>{formatearMoneda(venta.precio_unitario)}</td>
                    <td>{formatearMoneda(venta.precio_unitario * venta.cantidad)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MisVentas; 