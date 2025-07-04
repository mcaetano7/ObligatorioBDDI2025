import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import clienteService from '../services/clienteService';
import mantenimientoService from '../services/mantenimientoService';
import './SolicitarMantenimiento.css';

const SolicitarMantenimiento = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [alquileres, setAlquileres] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelError, setCancelError] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      // Obtener ID del cliente
      const clienteData = await clienteService.obtenerIdCliente(user.id_usuario);
      // Obtener todos los alquileres del cliente
      const alquileresData = await clienteService.obtenerAlquileres(clienteData.id_cliente);
      setAlquileres(alquileresData);
      // Obtener todas las solicitudes de mantenimiento
      const solicitudesData = await mantenimientoService.obtenerSolicitudes();
      // Filtrar solicitudes que correspondan a los alquileres del cliente
      const solicitudesCliente = solicitudesData.filter(solicitud =>
        alquileresData.some(alquiler => alquiler.id_alquiler === solicitud.id_alquiler)
      );
      setSolicitudes(solicitudesCliente);
    } catch (error) {
      setError(error.error || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  const obtenerEstadoSolicitud = (fechaResolucion) => {
    return fechaResolucion ? 'Completada' : 'Pendiente';
  };

  const obtenerColorEstado = (estado) => {
    return estado === 'Completada' ? '#28a745' : '#ffc107';
  };

  const obtenerAlquilerPorId = (idAlquiler) => {
    return alquileres.find(alquiler => alquiler.id_alquiler === idAlquiler);
  };

  const cancelarSolicitud = async (id_solicitud) => {
    if (!window.confirm('¿Está seguro que desea cancelar esta solicitud de mantenimiento?')) return;
    try {
      await mantenimientoService.eliminarSolicitud(id_solicitud);
      setCancelSuccess('Solicitud cancelada correctamente');
      await cargarDatos();
      setTimeout(() => setCancelSuccess(''), 2000);
    } catch (error) {
      setCancelError(error.error || 'Error al cancelar la solicitud');
      setTimeout(() => setCancelError(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="solicitar-mantenimiento-container">
        <div className="loading">Cargando datos...</div>
      </div>
    );
  }

  return (
    <div className="solicitar-mantenimiento-container">
      <div className="solicitar-mantenimiento-header">
        <div className="header-left">
          <button 
            className="btn btn-secondary back-btn"
            onClick={() => navigate('/dashboard')}
          >
            ← Volver al Dashboard
          </button>
          <h1>Solicitudes de Mantenimiento</h1>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {cancelError && <div className="error-message">{cancelError}</div>}
      {cancelSuccess && <div className="success-message">{cancelSuccess}</div>}

      {/* Historial de solicitudes */}
      <div className="solicitudes-section">
        <h2>Historial de Solicitudes</h2>
        {solicitudes.length === 0 ? (
          <div className="no-solicitudes">
            <p>No tienes solicitudes de mantenimiento registradas.</p>
          </div>
        ) : (
          <div className="solicitudes-grid">
            {solicitudes.map(solicitud => {
              const estado = obtenerEstadoSolicitud(solicitud.fecha_resolucion);
              const alquiler = obtenerAlquilerPorId(solicitud.id_alquiler);
              
              return (
                <div key={solicitud.id_solicitud} className="solicitud-card">
                  <div className="solicitud-header">
                    <h3>Solicitud #{solicitud.id_solicitud}</h3>
                    <span 
                      className="estado-badge"
                      style={{ backgroundColor: obtenerColorEstado(estado) }}
                    >
                      {estado}
                    </span>
                    {estado === 'Pendiente' && (
                      <button
                        className="btn btn-secondary"
                        style={{ marginLeft: '10px' }}
                        onClick={() => cancelarSolicitud(solicitud.id_solicitud)}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                  
                  <div className="solicitud-details">
                    <p><strong>Alquiler:</strong> #{solicitud.id_alquiler}</p>
                    {alquiler && (
                      <p><strong>Máquina:</strong> #{alquiler.id_maquina}</p>
                    )}
                    <p><strong>Fecha de Solicitud:</strong> {formatearFecha(solicitud.fecha_solicitud)}</p>
                    {solicitud.fecha_asignacion && (
                      <p><strong>Fecha de Asignación:</strong> {formatearFecha(solicitud.fecha_asignacion)}</p>
                    )}
                    {solicitud.fecha_resolucion && (
                      <p><strong>Fecha de Resolución:</strong> {formatearFecha(solicitud.fecha_resolucion)}</p>
                    )}
                    {solicitud.nombre_tecnico && (
                      <p><strong>Técnico Asignado:</strong> {solicitud.nombre_tecnico}</p>
                    )}
                    <p><strong>Descripción:</strong></p>
                    <div className="descripcion-text">
                      {solicitud.descripcion}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SolicitarMantenimiento; 