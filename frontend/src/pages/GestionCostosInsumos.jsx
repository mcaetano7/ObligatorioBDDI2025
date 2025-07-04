import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ventaService from '../services/ventaService';
import './GestionCostosInsumos.css';

const GestionCostosInsumos = () => {
  const [costos, setCostos] = useState([]);
  const [totales, setTotales] = useState(null);
  const [insumoMayor, setInsumoMayor] = useState(null);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorInsumo, setErrorInsumo] = useState('');
  const navigate = useNavigate();

  const fetchCostos = async () => {
    setLoading(true);
    setError('');
    setErrorInsumo('');
    try {
      if (!fechaInicio || !fechaFin) {
        setLoading(false);
        return;
      }
      const data = await ventaService.obtenerCostosInsumos(fechaInicio, fechaFin);
      setCostos(data.costos_insumos || []);
      setTotales(data.costos_totales || null);
      // Obtener insumo más consumido/caro
      try {
        const insumo = await ventaService.obtenerInsumoMayorCosto(fechaInicio, fechaFin);
        setInsumoMayor(insumo);
      } catch (err) {
        setInsumoMayor(null);
        setErrorInsumo(err.error || 'No se pudo obtener el insumo más consumido');
      }
    } catch (err) {
      setError(err.error || 'Error al obtener costos de insumos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fechaInicio && fechaFin) {
      fetchCostos();
    }
    // eslint-disable-next-line
  }, [fechaInicio, fechaFin]);

  return (
    <div className="gestion-costos-container">
      <button className="btn btn-secondary" style={{marginBottom: 18}} onClick={() => navigate('/dashboard')}>
        Volver al Dashboard
      </button>
      <h2>Costos de Insumos</h2>
      <div className="filtros-ganancias">
        <label>
          Fecha inicio:
          <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
        </label>
        <label>
          Fecha fin:
          <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
        </label>
        <button onClick={fetchCostos} disabled={loading || !fechaInicio || !fechaFin}>
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
              <th>Costo total insumos</th>
            </tr>
          </thead>
          <tbody>
            {costos.length === 0 && !loading ? (
              <tr><td colSpan="4">No hay datos para el período seleccionado.</td></tr>
            ) : (
              costos.map((c, idx) => (
                <tr key={c.id_alquiler + '-' + c.mes + '-' + c.anio + '-' + idx}>
                  <td>{c.nombre_empresa}</td>
                  <td>{c.modelo} {c.marca}</td>
                  <td>{c.mes}/{c.anio}</td>
                  <td>${Number(c.costo_total_insumos).toLocaleString('es-UY')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totales && (
        <div className="totales-ganancias">
          <h4>Total de costos del período</h4>
          <p>Costo total insumos: <strong>${Number(totales.total_costos_insumos || 0).toLocaleString('es-UY')}</strong></p>
        </div>
      )}
      {insumoMayor && (
        <div className="insumo-mayor-costo" style={{marginTop: 24}}>
          <h4>Insumo más consumido/caro del período</h4>
          <p><strong>Nombre:</strong> {insumoMayor.nombre_insumo}</p>
          <p><strong>Unidad:</strong> {insumoMayor.unidad_medida}</p>
          <p><strong>Cantidad consumida:</strong> {Number(insumoMayor.total_consumido).toLocaleString('es-UY')}</p>
          <p><strong>Costo total:</strong> ${Number(insumoMayor.costo_total).toLocaleString('es-UY')}</p>
        </div>
      )}
      {!insumoMayor && errorInsumo && <p className="error-msg">{errorInsumo}</p>}
    </div>
  );
};

export default GestionCostosInsumos; 