import React, { useEffect, useState } from 'react';
import cafeAdminService from '../services/cafeAdminService';
import './GestionCafes.css';
import { useNavigate } from 'react-router-dom';

const GestionCafes = () => {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editCafe, setEditCafe] = useState(null);
  const [form, setForm] = useState({
    nombre_cafe: '',
    precio_venta: '',
    descripcion: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    cargarCafes();
  }, []);

  const cargarCafes = async () => {
    setLoading(true);
    try {
      const data = await cafeAdminService.obtenerCafes();
      setCafes(data);
    } catch (e) {
      setError('Error al cargar cafés');
    } finally {
      setLoading(false);
    }
  };

  const abrirModalNuevo = () => {
    setEditCafe(null);
    setForm({ nombre_cafe: '', precio_venta: '', descripcion: '' });
    setShowModal(true);
    setError('');
  };

  const abrirModalEditar = (cafe) => {
    setEditCafe(cafe);
    setForm({
      nombre_cafe: cafe.nombre_cafe,
      precio_venta: cafe.precio_venta,
      descripcion: cafe.descripcion
    });
    setShowModal(true);
    setError('');
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditCafe(null);
    setForm({ nombre_cafe: '', precio_venta: '', descripcion: '' });
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCafe) {
        await cafeAdminService.actualizarCafe(editCafe.id_cafe, form);
        setSuccess('Café actualizado correctamente');
      } else {
        await cafeAdminService.crearCafe(form);
        setSuccess('Café creado correctamente');
      }
      cerrarModal();
      cargarCafes();
      setTimeout(() => setSuccess(''), 2000);
    } catch (e) {
      setError('Error al guardar café');
    }
  };

  const handleEliminar = async (id_cafe) => {
    if (!window.confirm('¿Seguro que desea eliminar este café?')) return;
    try {
      await cafeAdminService.eliminarCafe(id_cafe);
      setSuccess('Café eliminado correctamente');
      cargarCafes();
      setTimeout(() => setSuccess(''), 2000);
    } catch (e) {
      setError('Error al eliminar café');
    }
  };

  return (
    <div className="gestion-cafes-container">
      <button className="btn btn-secondary" style={{marginBottom: '18px'}} onClick={() => navigate('/dashboard')}>Volver al Dashboard</button>
      <div className="header">
        <h1>Gestión de Cafés</h1>
        <button className="btn btn-primary" onClick={abrirModalNuevo}>Nuevo Café</button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      {loading ? (
        <div className="loading">Cargando cafés...</div>
      ) : (
        <div className="tabla-cafes-container">
          <table className="tabla-cafes">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio Venta</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cafes.map(cafe => (
                <tr key={cafe.id_cafe}>
                  <td>{cafe.id_cafe}</td>
                  <td>{cafe.nombre_cafe}</td>
                  <td>${cafe.precio_venta}</td>
                  <td>{cafe.descripcion}</td>
                  <td>
                    <button className="btn btn-secondary" onClick={() => abrirModalEditar(cafe)}>Editar</button>
                    <button className="btn btn-danger" onClick={() => handleEliminar(cafe.id_cafe)}>Eliminar</button>
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
              <h2>{editCafe ? 'Editar Café' : 'Nuevo Café'}</h2>
              <button className="close-btn" onClick={cerrarModal}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="form-modal">
              <div className="form-group">
                <label>Nombre</label>
                <input name="nombre_cafe" value={form.nombre_cafe} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Precio Venta</label>
                <input name="precio_venta" value={form.precio_venta} onChange={handleInputChange} required type="number" min="0" step="0.01" />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea name="descripcion" value={form.descripcion} onChange={handleInputChange} required rows="3" />
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" type="submit">{editCafe ? 'Actualizar' : 'Crear'}</button>
                <button className="btn btn-secondary" type="button" onClick={cerrarModal}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionCafes; 