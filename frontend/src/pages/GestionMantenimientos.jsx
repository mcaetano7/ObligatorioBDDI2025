import React, { useEffect, useState } from 'react';
import mantenimientoAdminService from '../services/mantenimientoAdminService';
import tecnicoAdminService from '../services/tecnicoAdminService';
import './GestionMantenimientos.css';
import { useNavigate } from 'react-router-dom';

const GestionMantenimientos = () => {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMantenimiento, setEditMantenimiento] = useState(null);
  const [form, setForm] = useState({
    id_alquiler: '',
    descripcion: '',
    id_tecnico_asignado: '',
    fecha_asignacion: '',
    fecha_resolucion: ''
  });
  const [tecnicosDisponibles, setTecnicosDisponibles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    cargarMantenimientos();
  }, []);

  const cargarMantenimientos = async () => {
    setLoading(true);
    try {
      const data = await mantenimientoAdminService.obtenerMantenimientos();
      setMantenimientos(data);
    } catch {
      setError('Error al cargar mantenimientos');
    } finally {
      setLoading(false);
    }
  };

  const cargarTecnicosDisponibles = async () => {
    try {
      const data = await tecnicoAdminService.obtenerTecnicosDisponibles();
      setTecnicosDisponibles(data);
    } catch {
      setError('Error al cargar técnicos disponibles');
    }
  };

  const abrirModalNuevo = () => {
    setEditMantenimiento(null);
    setForm({ id_alquiler: '', descripcion: '', id_tecnico_asignado: '', fecha_asignacion: '', fecha_resolucion: '' });
    setShowModal(true);
    setError('');
    cargarTecnicosDisponibles();
  };

  const abrirModalEditar = (mantenimiento) => {
    setEditMantenimiento(mantenimiento);
    setForm({
      id_alquiler: mantenimiento.id_alquiler,
      descripcion: mantenimiento.descripcion,
      id_tecnico_asignado: mantenimiento.id_tecnico_asignado || '',
      fecha_asignacion: mantenimiento.fecha_asignacion || '',
      fecha_resolucion: mantenimiento.fecha_resolucion || ''
    });
    setShowModal(true);
    setError('');
    cargarTecnicosDisponibles();
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditMantenimiento(null);
    setForm({ id_alquiler: '', descripcion: '', id_tecnico_asignado: '', fecha_asignacion: '', fecha_resolucion: '' });
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMantenimiento) {
        await mantenimientoAdminService.actualizarMantenimiento(editMantenimiento.id_solicitud, form);
        setSuccess('Mantenimiento actualizado correctamente');
      } else {
        await mantenimientoAdminService.crearMantenimiento(form);
        setSuccess('Mantenimiento creado correctamente');
      }
      cerrarModal();
      cargarMantenimientos();
      setTimeout(() => setSuccess(''), 2000);
    } catch {
      setError('Error al guardar mantenimiento');
    }
  };

  const handleEliminar = async (id_solicitud) => {
    if (!window.confirm('¿Seguro que desea eliminar este mantenimiento?')) return;
    try {
      await mantenimientoAdminService.eliminarMantenimiento(id_solicitud);
      setSuccess('Mantenimiento eliminado correctamente');
      cargarMantenimientos();
      setTimeout(() => setSuccess(''), 2000);
    } catch {
      setError('Error al eliminar mantenimiento');
    }
  };

  const handleFinalizar = async (id_solicitud) => {
    if (!window.confirm('¿Seguro que desea marcar como finalizada esta solicitud?')) return;
    try {
      await mantenimientoAdminService.completarMantenimiento(id_solicitud);
      setSuccess('Solicitud marcada como finalizada');
      cargarMantenimientos();
      setTimeout(() => setSuccess(''), 2000);
    } catch {
      setError('Error al finalizar mantenimiento');
    }
  };

  return (
    <div className="gestion-mantenimientos-container">
      <button className="btn btn-secondary" style={{marginBottom: '18px'}} onClick={() => navigate('/dashboard')}>Volver al Dashboard</button>
      <div className="header">
        <h1>Gestión de Mantenimientos</h1>
        <button className="btn btn-primary" onClick={abrirModalNuevo}>Nuevo Mantenimiento</button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      {loading ? (
        <div className="loading">Cargando mantenimientos...</div>
      ) : (
        <div className="tabla-mantenimientos-container">
          <table className="tabla-mantenimientos">
            <thead>
              <tr>
                <th>ID</th>
                <th>Alquiler</th>
                <th>Descripción</th>
                <th>Técnico Asignado</th>
                <th>Fecha Asignación</th>
                <th>Fecha Resolución</th>
                <th>Fecha Solicitud</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mantenimientos.map(mant => (
                <tr key={mant.id_solicitud}>
                  <td>{mant.id_solicitud}</td>
                  <td>{mant.id_alquiler}</td>
                  <td>{mant.descripcion}</td>
                  <td>{mant.nombre_tecnico || '-'}</td>
                  <td>{mant.fecha_asignacion || '-'}</td>
                  <td>{mant.fecha_resolucion || '-'}</td>
                  <td>{mant.fecha_solicitud || '-'}</td>
                  <td>
                    <button className="btn btn-secondary" onClick={() => abrirModalEditar(mant)}>Editar</button>
                    <button className="btn btn-danger" onClick={() => handleEliminar(mant.id_solicitud)}>Eliminar</button>
                    {(!mant.fecha_resolucion || mant.fecha_resolucion === '-') && (
                      <button className="btn btn-success" style={{marginLeft: '6px'}} onClick={() => handleFinalizar(mant.id_solicitud)}>Finalizar</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editMantenimiento ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento'}</h2>
              <button className="close-btn" onClick={cerrarModal}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="form-modal">
              <div className="form-group">
                <label>ID Alquiler</label>
                <input name="id_alquiler" value={form.id_alquiler} onChange={handleInputChange} required type="number" min="1" />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea name="descripcion" value={form.descripcion} onChange={handleInputChange} required rows="3" />
              </div>
              <div className="form-group">
                <label>Técnico Asignado</label>
                <select name="id_tecnico_asignado" value={form.id_tecnico_asignado} onChange={handleInputChange}>
                  <option value="">Seleccione un técnico</option>
                  {tecnicosDisponibles.map(tecnico => (
                    <option key={tecnico.id_tecnico} value={tecnico.id_tecnico}>{tecnico.nombre_tecnico}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Fecha Asignación</label>
                <input name="fecha_asignacion" value={form.fecha_asignacion} onChange={handleInputChange} type="date" />
              </div>
              <div className="form-group">
                <label>Fecha Resolución</label>
                <input name="fecha_resolucion" value={form.fecha_resolucion} onChange={handleInputChange} type="date" />
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" type="submit">{editMantenimiento ? 'Actualizar' : 'Crear'}</button>
                <button className="btn btn-secondary" type="button" onClick={cerrarModal}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionMantenimientos; 