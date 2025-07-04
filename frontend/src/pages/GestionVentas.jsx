import React, { useEffect, useState } from 'react';
import ventaService from '../services/ventaService';
import './GestionVentas.css';
import { useNavigate } from 'react-router-dom';

const GestionVentas = () => {
  const [alquileres, setAlquileres] = useState([]);
  const [cafes, setCafes] = useState([]);
  const [alquilerSeleccionado, setAlquilerSeleccionado] = useState(null);
  const [form, setForm] = useState({ id_cafe: '', cantidad: 1 });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cargarAlquileres();
  }, []);

  const cargarAlquileres = async () => {
    setLoading(true);
    try {
      const data = await ventaService.obtenerAlquileresActivos();
      setAlquileres(data);
    } catch {
      setError('Error al cargar alquileres');
    } finally {
      setLoading(false);
    }
  };

  const seleccionarAlquiler = async (alquiler) => {
    setAlquilerSeleccionado(alquiler);
    setForm({ id_cafe: '', cantidad: 1 });
    setCafes([]);
    setError('');
    try {
      const cafesData = await ventaService.obtenerCafesDisponibles(alquiler.id_alquiler);
      setCafes(cafesData);
    } catch {
      setError('Error al cargar cafés disponibles');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRegistrarVenta = async (e) => {
    e.preventDefault();
    if (!form.id_cafe || !form.cantidad) {
      setError('Seleccione un café y cantidad');
      return;
    }
    try {
      await ventaService.registrarVenta({
        id_alquiler: alquilerSeleccionado.id_alquiler,
        id_cafe: form.id_cafe,
        cantidad: form.cantidad
      });
      setSuccess('Venta registrada correctamente');
      setTimeout(() => setSuccess(''), 2000);
      setForm({ id_cafe: '', cantidad: 1 });
      setCafes([]);
      setAlquilerSeleccionado(null);
      cargarAlquileres();
    } catch (err) {
      setError(err.error || 'Error al registrar venta');
    }
  };

  return (
    <div className="gestion-ventas-container">
      <button className="btn btn-secondary" style={{marginBottom: '18px'}} onClick={() => navigate('/dashboard')}>Volver al Dashboard</button>
      <h1>Gestión de Ventas</h1>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      {loading ? (
        <div className="loading">Cargando alquileres...</div>
      ) : (
        <div className="alquileres-lista-container">
          <h2>Alquileres Activos</h2>
          <table className="tabla-alquileres">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Máquina</th>
                <th>Modelo</th>
                <th>Marca</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {alquileres.map(alq => (
                <tr key={alq.id_alquiler}>
                  <td>{alq.id_alquiler}</td>
                  <td>{alq.nombre_empresa}</td>
                  <td>{alq.id_maquina}</td>
                  <td>{alq.modelo}</td>
                  <td>{alq.marca}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => seleccionarAlquiler(alq)}>Vender</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {alquilerSeleccionado && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Registrar Venta - Alquiler #{alquilerSeleccionado.id_alquiler}</h2>
              <button className="close-btn" onClick={() => setAlquilerSeleccionado(null)}>×</button>
            </div>
            <form onSubmit={handleRegistrarVenta} className="form-modal">
              <div className="form-group">
                <label>Café</label>
                <select name="id_cafe" value={form.id_cafe} onChange={handleInputChange} required>
                  <option value="">Seleccione un café</option>
                  {cafes.map(cafe => (
                    <option key={cafe.id_cafe} value={cafe.id_cafe}>{cafe.nombre_cafe} (${cafe.precio_venta})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Cantidad</label>
                <input name="cantidad" type="number" min="1" value={form.cantidad} onChange={handleInputChange} required />
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" type="submit">Registrar Venta</button>
                <button className="btn btn-secondary" type="button" onClick={() => setAlquilerSeleccionado(null)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionVentas; 