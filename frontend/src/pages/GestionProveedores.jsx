import React, { useEffect, useState } from 'react';
import proveedorAdminService from '../services/proveedorAdminService';
import './GestionProveedores.css';
import { useNavigate } from 'react-router-dom';

const GestionProveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProveedor, setEditProveedor] = useState(null);
  const [form, setForm] = useState({
    nombre_proveedor: '',
    telefono: '',
    email: '',
    direccion: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    setLoading(true);
    try {
      const data = await proveedorAdminService.obtenerProveedores();
      setProveedores(data);
    } catch (e) {
      setError('Error al cargar proveedores');
    } finally {
      setLoading(false);
    }
  };

  const abrirModalNuevo = () => {
    setEditProveedor(null);
    setForm({ nombre_proveedor: '', telefono: '', email: '', direccion: '' });
    setShowModal(true);
    setError('');
  };

  const abrirModalEditar = (proveedor) => {
    setEditProveedor(proveedor);
    setForm({
      nombre_proveedor: proveedor.nombre_proveedor,
      telefono: proveedor.telefono,
      email: proveedor.email,
      direccion: proveedor.direccion
    });
    setShowModal(true);
    setError('');
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditProveedor(null);
    setForm({ nombre_proveedor: '', telefono: '', email: '', direccion: '' });
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editProveedor) {
        await proveedorAdminService.actualizarProveedor(editProveedor.id_proveedor, form);
        setSuccess('Proveedor actualizado correctamente');
      } else {
        await proveedorAdminService.crearProveedor(form);
        setSuccess('Proveedor creado correctamente');
      }
      cerrarModal();
      cargarProveedores();
      setTimeout(() => setSuccess(''), 2000);
    } catch (e) {
      setError('Error al guardar proveedor');
    }
  };

  const handleEliminar = async (id_proveedor) => {
    if (!window.confirm('¿Seguro que desea eliminar este proveedor?')) return;
    try {
      await proveedorAdminService.eliminarProveedor(id_proveedor);
      setSuccess('Proveedor eliminado correctamente');
      cargarProveedores();
      setTimeout(() => setSuccess(''), 2000);
    } catch (e) {
      setError('Error al eliminar proveedor');
    }
  };

  return (
    <div className="gestion-proveedores-container">
      <button className="btn btn-secondary" style={{marginBottom: '18px'}} onClick={() => navigate('/dashboard')}>Volver al Dashboard</button>
      <div className="header">
        <h1>Gestión de Proveedores</h1>
        <button className="btn btn-primary" onClick={abrirModalNuevo}>Nuevo Proveedor</button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      {loading ? (
        <div className="loading">Cargando proveedores...</div>
      ) : (
        <div className="tabla-proveedores-container">
          <table className="tabla-proveedores">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.map(proveedor => (
                <tr key={proveedor.id_proveedor}>
                  <td>{proveedor.id_proveedor}</td>
                  <td>{proveedor.nombre_proveedor}</td>
                  <td>{proveedor.telefono}</td>
                  <td>{proveedor.email}</td>
                  <td>{proveedor.direccion}</td>
                  <td>
                    <button className="btn btn-secondary" onClick={() => abrirModalEditar(proveedor)}>Editar</button>
                    <button className="btn btn-danger" onClick={() => handleEliminar(proveedor.id_proveedor)}>Eliminar</button>
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
              <h2>{editProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h2>
              <button className="close-btn" onClick={cerrarModal}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="form-modal">
              <div className="form-group">
                <label>Nombre</label>
                <input name="nombre_proveedor" value={form.nombre_proveedor} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input name="telefono" value={form.telefono} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="email" value={form.email} onChange={handleInputChange} required type="email" />
              </div>
              <div className="form-group">
                <label>Dirección</label>
                <input name="direccion" value={form.direccion} onChange={handleInputChange} required />
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" type="submit">{editProveedor ? 'Actualizar' : 'Crear'}</button>
                <button className="btn btn-secondary" type="button" onClick={cerrarModal}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionProveedores; 