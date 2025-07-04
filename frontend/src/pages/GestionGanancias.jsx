import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ventaService from '../services/ventaService';
import './GestionGanancias.css';

const GestionGanancias = () => {
  const [ganancias, setGanancias] = useState([]);
  const [totales, setTotales] = useState(null);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchGanancias = async () => {
    setLoading(true);
    setError('');
    try {
      // Si no hay fechas, no buscar
      if (!fechaInicio || !fechaFin) {
        setLoading(false);
        return;
      }
      const data = await ventaService.obtenerGanancias(fechaInicio, fechaFin);
      setGanancias(data.ganancias_maquinas || []);
      setTotales(data.ganancias_totales || null);
    } catch (err) {
      setError(err.error || 'Error al obtener ganancias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fechaInicio && fechaFin) {
      fetchGanancias();
    }
    // eslint-disable-next-line
  }, [fechaInicio, fechaFin]);

  return (
    <div className="gestion-ganancias-container">
      <button className="btn btn-secondary" style={{marginBottom: 18}} onClick={() => navigate('/dashboard')}>
        Volver al Dashboard
      </button>
      <h2>Gestión de Ganancias</h2>
      <div className="filtros-ganancias">
        <label>
          Fecha inicio:
          <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
        </label>
        <label>
          Fecha fin:
          <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
        </label>
        <button onClick={fetchGanancias} disabled={loading || !fechaInicio || !fechaFin}>
          Buscar
        </button>
      </div>
      {loading && <p>Cargando...</p>}
      {error && <p className="error-msg">{error}</p>}
      <div className="tabla-ganancias-wrapper">
        <table className="tabla-ventas">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Máquina</th>
              <th>Mes/Año</th>
              <th>Ganancia Cliente</th>
              <th>Ganancia Empresa</th>
              <th>Total Ventas</th>
            </tr>
          </thead>
          <tbody>
            {ganancias.length === 0 && !loading ? (
              <tr><td colSpan="6">No hay datos para el período seleccionado.</td></tr>
            ) : (
              ganancias.map((g, idx) => (
                <tr key={g.id_alquiler + '-' + g.mes + '-' + g.anio + '-' + idx}>
                  <td>{g.nombre_empresa}</td>
                  <td>{g.modelo} {g.marca}</td>
                  <td>{g.mes}/{g.anio}</td>
                  <td>${Number(g.ganancia_cliente).toLocaleString('es-UY')}</td>
                  <td>${Number(g.ganancia_empresa).toLocaleString('es-UY')}</td>
                  <td>${Number(g.total_ventas).toLocaleString('es-UY')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totales && (
        <div className="totales-ganancias">
          <h4>Totales del período</h4>
          <p>Ganancia total clientes: <strong>${Number(totales.total_ganancia_clientes || 0).toLocaleString('es-UY')}</strong></p>
          <p>Ganancia total empresa: <strong>${Number(totales.total_ganancia_empresa || 0).toLocaleString('es-UY')}</strong></p>
          <p>Total ventas: <strong>${Number(totales.total_ventas || 0).toLocaleString('es-UY')}</strong></p>
        </div>
      )}
    </div>
  );
};

export default GestionGanancias; 