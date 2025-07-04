import React, { useEffect, useState } from 'react';
import tecnicoAdminService from '../services/tecnicoAdminService';
import './GestionTecnicos.css';
import { useNavigate } from 'react-router-dom';

const GestionTecnicos = () => {
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTecnico, setEditTecnico] = useState(null);
  const [form, setForm] = useState({
    nombre_tecnico: '',
    telefono: '',
    email: ''
  });
  const [topTecnico, setTopTecnico] = useState(null);
  const [errorTop, setErrorTop] = useState('');
  const [mantenimientosPorTecnico, setMantenimientosPorTecnico] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    cargarTecnicos();
    cargarTopTecnicoYRanking();
  }, []);

  const cargarTecnicos = async () => {
    setLoading(true);
    try {
      const data = await tecnicoAdminService.obtenerTecnicos();
      setTecnicos(data);
    } catch (e) {
      setError('Error al cargar técnicos');
    } finally {
      setLoading(false);
    }
  };

  const cargarTopTecnicoYRanking = async () => {
    setErrorTop('');
    try {
      const ranking = await tecnicoAdminService.obtenerTopTecnicos();
      setTopTecnico(ranking && ranking.length > 0 ? ranking[0] : null);
      // Mapear mantenimientos por técnico
      const map = {};
      ranking.forEach(t => { map[t.id_tecnico] = t.mantenimientos_realizados; });
      setMantenimientosPorTecnico(map);
    } catch (e) {
      setTopTecnico(null);
      setMantenimientosPorTecnico({});
      setErrorTop('No se pudo obtener el técnico con más mantenimientos');
    }
  };

  const abrirModalNuevo = () => {
    setEditTecnico(null);
    setForm({ nombre_tecnico: '', telefono: '', email: '' });
    setShowModal(true);
    setError('');
  };

  const abrirModalEditar = (tecnico) => {
    setEditTecnico(tecnico);
    setForm({
      nombre_tecnico: tecnico.nombre_tecnico,
      telefono: tecnico.telefono,
      email: tecnico.email
    });
    setShowModal(true);
    setError('');
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditTecnico(null);
    setForm({ nombre_tecnico: '', telefono: '', email: '' });
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editTecnico) {
        await tecnicoAdminService.actualizarTecnico(editTecnico.id_tecnico, form);
        setSuccess('Técnico actualizado correctamente');
      } else {
        await tecnicoAdminService.crearTecnico(form);
        setSuccess('Técnico creado correctamente');
      }
      cerrarModal();
      cargarTecnicos();
      setTimeout(() => setSuccess(''), 2000);
    } catch (e) {
      setError('Error al guardar técnico');
    }
  };

  const handleEliminar = async (id_tecnico) => {
    if (!window.confirm('¿Seguro que desea eliminar este técnico?')) return;
    try {
      await tecnicoAdminService.eliminarTecnico(id_tecnico);
      setSuccess('Técnico eliminado correctamente');
      cargarTecnicos();
      setTimeout(() => setSuccess(''), 2000);
    } catch (e) {
      setError('Error al eliminar técnico');
    }
  };

  return (
    <div className="gestion-tecnicos-container">
      <button className="btn btn-secondary" style={{marginBottom: '18px'}} onClick={() => navigate('/dashboard')}>Volver al Dashboard</button>
      <div className="header">
        <h1>Gestión de Técnicos</h1>
        <button className="btn btn-primary" onClick={abrirModalNuevo}>Nuevo Técnico</button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      {loading ? (
        <div className="loading">Cargando técnicos...</div>
      ) : (
        <div className="tabla-tecnicos-container">
          <table className="tabla-tecnicos">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Mantenimientos realizados</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tecnicos.map(tecnico => (
                <tr key={tecnico.id_tecnico}>
                  <td>{tecnico.id_tecnico}</td>
                  <td>{tecnico.nombre_tecnico}</td>
                  <td>{tecnico.telefono}</td>
                  <td>{tecnico.email}</td>
                  <td>{mantenimientosPorTecnico[tecnico.id_tecnico] || 0}</td>
                  <td>
                    <button className="btn btn-secondary" onClick={() => abrirModalEditar(tecnico)}>Editar</button>
                    <button className="btn btn-danger" onClick={() => handleEliminar(tecnico.id_tecnico)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {topTecnico && (
        <div className="top-tecnico" style={{marginTop: 24}}>
          <h4>Técnico con más mantenimientos realizados</h4>
          <p><strong>Nombre:</strong> {topTecnico.nombre_tecnico}</p>
          <p><strong>Mantenimientos realizados:</strong> {topTecnico.mantenimientos_realizados}</p>
        </div>
      )}
      {!topTecnico && errorTop && <p className="error-message">{errorTop}</p>}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editTecnico ? 'Editar Técnico' : 'Nuevo Técnico'}</h2>
              <button className="close-btn" onClick={cerrarModal}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="form-modal">
              <div className="form-group">
                <label>Nombre</label>
                <input name="nombre_tecnico" value={form.nombre_tecnico} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input name="telefono" value={form.telefono} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="email" value={form.email} onChange={handleInputChange} required type="email" />
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" type="submit">{editTecnico ? 'Actualizar' : 'Crear'}</button>
                <button className="btn btn-secondary" type="button" onClick={cerrarModal}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionTecnicos; 