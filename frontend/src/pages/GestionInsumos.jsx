import React, { useEffect, useState } from 'react';
import insumoAdminService from '../services/insumoAdminService';
import proveedorAdminService from '../services/proveedorAdminService';
import './GestionInsumos.css';
import { useNavigate } from 'react-router-dom';

const GestionInsumos = () => {
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editInsumo, setEditInsumo] = useState(null);
  const [form, setForm] = useState({
    nombre_insumo: '',
    unidad_medida: '',
    costo_unitario: '',
    id_proveedor: ''
  });
  const [proveedores, setProveedores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    cargarInsumos();
    cargarProveedores();
  }, []);

  const cargarInsumos = async () => {
    setLoading(true);
    try {
      const data = await insumoAdminService.obtenerInsumos();
      setInsumos(data);
    } catch {
      setError('Error al cargar insumos');
    } finally {
      setLoading(false);
    }
  };

  const cargarProveedores = async () => {
    try {
      const data = await proveedorAdminService.obtenerProveedores();
      setProveedores(data);
    } catch {
      setError('Error al cargar proveedores');
    }
  };

  const abrirModalNuevo = () => {
    setEditInsumo(null);
    setForm({ nombre_insumo: '', unidad_medida: '', costo_unitario: '', id_proveedor: '' });
    setShowModal(true);
    setError('');
  };

  const abrirModalEditar = (insumo) => {
    setEditInsumo(insumo);
    setForm({
      nombre_insumo: insumo.nombre_insumo,
      unidad_medida: insumo.unidad_medida,
      costo_unitario: insumo.costo_unitario,
      id_proveedor: insumo.id_proveedor
    });
    setShowModal(true);
    setError('');
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditInsumo(null);
    setForm({ nombre_insumo: '', unidad_medida: '', costo_unitario: '', id_proveedor: '' });
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editInsumo) {
        await insumoAdminService.actualizarInsumo(editInsumo.id_insumo, form);
        setSuccess('Insumo actualizado correctamente');
      } else {
        await insumoAdminService.crearInsumo(form);
        setSuccess('Insumo creado correctamente');
      }
      cerrarModal();
      cargarInsumos();
      setTimeout(() => setSuccess(''), 2000);
    } catch {
      setError('Error al guardar insumo');
    }
  };

  const handleEliminar = async (id_insumo) => {
    if (!window.confirm('¿Seguro que desea eliminar este insumo?')) return;
    try {
      await insumoAdminService.eliminarInsumo(id_insumo);
      setSuccess('Insumo eliminado correctamente');
      cargarInsumos();
      setTimeout(() => setSuccess(''), 2000);
    } catch {
      setError('Error al eliminar insumo');
    }
  };

  return (
    <div className="gestion-insumos-container">
      <button className="btn btn-secondary" style={{marginBottom: '18px'}} onClick={() => navigate('/dashboard')}>Volver al Dashboard</button>
      <div className="header">
        <h1>Gestión de Insumos</h1>
        <button className="btn btn-primary" onClick={abrirModalNuevo}>Nuevo Insumo</button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      {loading ? (
        <div className="loading">Cargando insumos...</div>
      ) : (
        <div className="tabla-insumos-container">
          <table className="tabla-insumos">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Unidad</th>
                <th>Costo Unitario</th>
                <th>Nombre Proveedor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {insumos.map(insumo => (
                <tr key={insumo.id_insumo}>
                  <td>{insumo.id_insumo}</td>
                  <td>{insumo.nombre_insumo}</td>
                  <td>{insumo.unidad_medida}</td>
                  <td>${insumo.costo_unitario}</td>
                  <td>{insumo.nombre_proveedor}</td>
                  <td>
                    <button className="btn btn-secondary" onClick={() => abrirModalEditar(insumo)}>Editar</button>
                    <button className="btn btn-danger" onClick={() => handleEliminar(insumo.id_insumo)}>Eliminar</button>
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
              <h2>{editInsumo ? 'Editar Insumo' : 'Nuevo Insumo'}</h2>
              <button className="close-btn" onClick={cerrarModal}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="form-modal">
              <div className="form-group">
                <label>Nombre</label>
                <input name="nombre_insumo" value={form.nombre_insumo} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Unidad de Medida</label>
                <input name="unidad_medida" value={form.unidad_medida} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Costo Unitario</label>
                <input name="costo_unitario" value={form.costo_unitario} onChange={handleInputChange} required type="number" min="0" step="0.01" />
              </div>
              <div className="form-group">
                <label>Proveedor</label>
                <select name="id_proveedor" value={form.id_proveedor} onChange={handleInputChange} required>
                  <option value="">Seleccione un proveedor</option>
                  {proveedores.map(prov => (
                    <option key={prov.id_proveedor} value={prov.id_proveedor}>{prov.nombre_proveedor}</option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" type="submit">{editInsumo ? 'Actualizar' : 'Crear'}</button>
                <button className="btn btn-secondary" type="button" onClick={cerrarModal}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionInsumos; 