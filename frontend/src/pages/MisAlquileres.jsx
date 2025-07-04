import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import clienteService from '../services/clienteService';
// import mantenimientoService from '../services/mantenimientoService';
import './MisAlquileres.css';

const MisAlquileres = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [alquileres, setAlquileres] = useState([]);
  const [maquinasDisponibles, setMaquinasDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNuevoAlquiler, setShowNuevoAlquiler] = useState(false);
  const [idCliente, setIdCliente] = useState(null);
  const [nuevoAlquiler, setNuevoAlquiler] = useState({
    id_maquina: '',
    fecha_inicio: '',
    fecha_fin: ''
  });
  const [showMantenimiento, setShowMantenimiento] = useState(false);
  const [alquilerSeleccionado, setAlquilerSeleccionado] = useState(null);
  const [descripcionMantenimiento, setDescripcionMantenimiento] = useState('');
  const [mantenimientoError, setMantenimientoError] = useState('');
  const [mantenimientoSuccess, setMantenimientoSuccess] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Obtener ID del cliente
      const clienteData = await clienteService.obtenerIdCliente(user.id_usuario);
      setIdCliente(clienteData.id_cliente);
      
      // Obtener alquileres del cliente
      const alquileresData = await clienteService.obtenerAlquileres(clienteData.id_cliente);
      setAlquileres(alquileresData);
      
      // Obtener máquinas disponibles
      const maquinasData = await clienteService.obtenerMaquinasDisponibles();
      setMaquinasDisponibles(maquinasData);
      
    } catch (error) {
      setError(error.error || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoAlquiler(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCrearAlquiler = async (e) => {
    e.preventDefault();
    
    if (!nuevoAlquiler.id_maquina || !nuevoAlquiler.fecha_inicio || !nuevoAlquiler.fecha_fin) {
      setError('Por favor complete todos los campos');
      return;
    }

    try {
      const alquilerData = {
        ...nuevoAlquiler,
        id_cliente: idCliente
      };
      
      await clienteService.crearAlquiler(alquilerData);
      
      // Limpiar formulario y recargar datos
      setNuevoAlquiler({
        id_maquina: '',
        fecha_inicio: '',
        fecha_fin: ''
      });
      setShowNuevoAlquiler(false);
      setError('');
      
      // Recargar datos
      await cargarDatos();
      
    } catch (error) {
      setError(error.error || 'Error al crear el alquiler');
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  const obtenerEstadoAlquiler = (fechaFin) => {
    const hoy = new Date();
    const fin = new Date(fechaFin);
    return fin >= hoy ? 'Activo' : 'Finalizado';
  };

  const obtenerColorEstado = (estado) => {
    return estado === 'Activo' ? '#28a745' : '#dc3545';
  };

  const abrirModalMantenimiento = (alquiler) => {
    setAlquilerSeleccionado(alquiler);
    setDescripcionMantenimiento('');
    setMantenimientoError('');
    setShowMantenimiento(true);
  };

  const cerrarModalMantenimiento = () => {
    setShowMantenimiento(false);
    setAlquilerSeleccionado(null);
    setDescripcionMantenimiento('');
    setMantenimientoError('');
  };

  const handleSolicitarMantenimiento = async (e) => {
    e.preventDefault();
    if (!descripcionMantenimiento.trim()) {
      setMantenimientoError('Por favor describa el problema');
      return;
    }
    try {
      await clienteService.solicitarMantenimiento({
        id_alquiler: alquilerSeleccionado.id_alquiler,
        descripcion: descripcionMantenimiento
      });
      setMantenimientoSuccess('Solicitud de mantenimiento enviada correctamente');
      cerrarModalMantenimiento();
    } catch (error) {
      setMantenimientoError(error.error || 'Error al solicitar mantenimiento');
    }
  };

  if (loading) {
    return (
      <div className="mis-alquileres-container">
        <div className="loading">Cargando alquileres...</div>
      </div>
    );
  }

  return (
    <div className="mis-alquileres-container">
      <div className="mis-alquileres-header">
        <div className="header-left">
          <button 
            className="btn btn-secondary back-btn"
            onClick={() => navigate('/dashboard')}
          >
            ← Volver al Dashboard
          </button>
          <h1>Mis Alquileres</h1>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowNuevoAlquiler(true)}
        >
          Nuevo Alquiler
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {showNuevoAlquiler && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Nuevo Alquiler</h2>
              <button 
                className="close-btn"
                onClick={() => setShowNuevoAlquiler(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleCrearAlquiler} className="form-alquiler">
              <div className="form-group">
                <label htmlFor="id_maquina">Máquina:</label>
                <select
                  id="id_maquina"
                  name="id_maquina"
                  value={nuevoAlquiler.id_maquina}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione una máquina</option>
                  {maquinasDisponibles.map(maquina => (
                    <option key={maquina.id_maquina} value={maquina.id_maquina}>
                      {maquina.marca} {maquina.modelo} - ${maquina.costo_mensual_alquiler}/mes
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="fecha_inicio">Fecha de Inicio:</label>
                <input
                  type="date"
                  id="fecha_inicio"
                  name="fecha_inicio"
                  value={nuevoAlquiler.fecha_inicio}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="fecha_fin">Fecha de Fin:</label>
                <input
                  type="date"
                  id="fecha_fin"
                  name="fecha_fin"
                  value={nuevoAlquiler.fecha_fin}
                  onChange={handleInputChange}
                  min={nuevoAlquiler.fecha_inicio || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Crear Alquiler
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowNuevoAlquiler(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="alquileres-grid">
        {alquileres.length === 0 ? (
          <div className="no-alquileres">
            <p>No tienes alquileres activos.</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowNuevoAlquiler(true)}
            >
              Alquilar tu primera máquina
            </button>
          </div>
        ) : (
          alquileres.map(alquiler => {
            const estado = obtenerEstadoAlquiler(alquiler.fecha_fin);
            return (
              <div key={alquiler.id_alquiler} className="alquiler-card">
                <div className="alquiler-header">
                  <h3>Alquiler #{alquiler.id_alquiler}</h3>
                  <span 
                    className="estado-badge"
                    style={{ backgroundColor: obtenerColorEstado(estado) }}
                  >
                    {estado}
                  </span>
                </div>
                
                <div className="alquiler-details">
                  <p><strong>Máquina ID:</strong> {alquiler.id_maquina}</p>
                  <p><strong>Fecha de Inicio:</strong> {formatearFecha(alquiler.fecha_inicio)}</p>
                  <p><strong>Fecha de Fin:</strong> {formatearFecha(alquiler.fecha_fin)}</p>
                  <p><strong>Costo Total:</strong> ${alquiler.coste_total_alquiler?.toLocaleString() || 'N/A'}</p>
                  <p><strong>Ganancias Totales:</strong> ${alquiler.ganancias_maquina_total?.toLocaleString() || '0'}</p>
                </div>

                <div className="alquiler-actions">
                  <button className="btn btn-secondary">
                    Ver Detalles
                  </button>
                  {estado === 'Activo' && (
                    <button className="btn btn-primary" onClick={() => abrirModalMantenimiento(alquiler)}>
                      Solicitar Mantenimiento
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de Solicitar Mantenimiento */}
      {showMantenimiento && alquilerSeleccionado && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Solicitar Mantenimiento</h2>
              <button className="close-btn" onClick={cerrarModalMantenimiento}>×</button>
            </div>
            <form onSubmit={handleSolicitarMantenimiento} className="form-solicitud">
              <div className="form-group">
                <label>Alquiler:</label>
                <input type="text" value={`Alquiler #${alquilerSeleccionado.id_alquiler} - Máquina #${alquilerSeleccionado.id_maquina}`} disabled />
              </div>
              <div className="form-group">
                <label htmlFor="descripcion">Descripción del Problema:</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={descripcionMantenimiento}
                  onChange={e => setDescripcionMantenimiento(e.target.value)}
                  required
                  rows="4"
                  placeholder="Describa el problema que necesita mantenimiento..."
                />
              </div>
              {mantenimientoError && <div className="error-message">{mantenimientoError}</div>}
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Enviar Solicitud</button>
                <button type="button" className="btn btn-secondary" onClick={cerrarModalMantenimiento}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {mantenimientoSuccess && (
        <div className="success-message">{mantenimientoSuccess}</div>
      )}
    </div>
  );
};

export default MisAlquileres; 