import React, { useEffect, useState } from 'react';
import clienteAdminService from '../services/clienteAdminService';
import './GestionClientes.css';
import { useNavigate } from 'react-router-dom';

const GestionClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editCliente, setEditCliente] = useState(null);
  const [form, setForm] = useState({
    rut: '',
    nombre_empresa: '',
    direccion: '',
    telefono: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    setLoading(true);
    try {
      const data = await clienteAdminService.obtenerClientes();
      setClientes(data);
    } catch (e) {
      setError('Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  const abrirModalNuevo = () => {
    setEditCliente(null);
    setForm({ rut: '', nombre_empresa: '', direccion: '', telefono: '' });
    setShowModal(true);
    setError('');
  };

  const abrirModalEditar = (cliente) => {
    setEditCliente(cliente);
    setForm({
      nombre_empresa: cliente.nombre_empresa,
      direccion: cliente.direccion,
      telefono: cliente.telefono
    });
    setShowModal(true);
    setError('');
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditCliente(null);
    setForm({ rut: '', nombre_empresa: '', direccion: '', telefono: '' });
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCliente) {
        await clienteAdminService.actualizarCliente(editCliente.id_cliente, {
          nombre_empresa: form.nombre_empresa,
          direccion: form.direccion,
          telefono: form.telefono
        });
        setSuccess('Cliente actualizado correctamente');
      } else {
        await clienteAdminService.crearCliente(form);
        setSuccess('Cliente creado correctamente');
      }
      cerrarModal();
      cargarClientes();
      setTimeout(() => setSuccess(''), 2000);
    } catch (e) {
      setError('Error al guardar cliente');
    }
  };

  const handleEliminar = async (id_cliente) => {
    if (!window.confirm('¿Seguro que desea eliminar este cliente?')) return;
    try {
      await clienteAdminService.eliminarCliente(id_cliente);
      setSuccess('Cliente eliminado correctamente');
      cargarClientes();
      setTimeout(() => setSuccess(''), 2000);
    } catch (e) {
      if (e.response && e.response.data && e.response.data.error && e.response.data.error.includes('alquileres')) {
        setError('No se puede eliminar un cliente que tiene alquileres asociados.');
      } else {
        setError('Error al eliminar cliente');
      }
    }
  };

  return (
    <div className="gestion-clientes-container">
      <button className="btn btn-secondary" style={{marginBottom: '18px'}} onClick={() => navigate('/dashboard')}>Volver al Dashboard</button>
      <div className="header">
        <h1>Gestión de Clientes</h1>
        <button className="btn btn-primary" onClick={abrirModalNuevo}>Nuevo Cliente</button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      {loading ? (
        <div className="loading">Cargando clientes...</div>
      ) : (
        <div className="tabla-clientes-container">
          <table className="tabla-clientes">
            <thead>
              <tr>
                <th>ID</th>
                <th>RUT</th>
                <th>Empresa</th>
                <th>Dirección</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(cliente => (
                <tr key={cliente.id_cliente}>
                  <td>{cliente.id_cliente}</td>
                  <td>{cliente.rut}</td>
                  <td>{cliente.nombre_empresa}</td>
                  <td>{cliente.direccion}</td>
                  <td>{cliente.telefono}</td>
                  <td>
                    <button className="btn btn-secondary" onClick={() => abrirModalEditar(cliente)}>Editar</button>
                    <button className="btn btn-danger" onClick={() => handleEliminar(cliente.id_cliente)}>Eliminar</button>
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
              <h2>{editCliente ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
              <button className="close-btn" onClick={cerrarModal}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="form-modal">
              {!editCliente && (
                <div className="form-group">
                  <label>RUT</label>
                  <input name="rut" value={form.rut || ''} onChange={handleInputChange} required />
                </div>
              )}
              <div className="form-group">
                <label>Nombre Empresa</label>
                <input name="nombre_empresa" value={form.nombre_empresa} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Dirección</label>
                <input name="direccion" value={form.direccion} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input name="telefono" value={form.telefono} onChange={handleInputChange} required />
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" type="submit">{editCliente ? 'Actualizar' : 'Crear'}</button>
                <button className="btn btn-secondary" type="button" onClick={cerrarModal}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionClientes; 