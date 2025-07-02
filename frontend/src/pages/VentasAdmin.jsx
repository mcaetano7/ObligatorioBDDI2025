import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './VentasAdmin.css';

const VentasAdmin = () => {
  const { user } = useAuth();
  const [ventas, setVentas] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    maquina_id: '',
    cafe_id: '',
    cantidad: 1,
    fecha: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (user) {
      fetchVentas();
      fetchMaquinas();
      fetchCafes();
    }
  }, [user]);

  const fetchVentas = async () => {
    try {
      const response = await fetch('http://localhost:5000/ventas');
      const data = await response.json();
      setVentas(data);
    } catch (error) {
      console.error('Error fetching ventas:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaquinas = async () => {
    try {
      const response = await fetch('http://localhost:5000/reportes/maquinas-por-cliente');
      const data = await response.json();
      // Filtrar solo alquileres activos (fecha_fin nula)
      const activas = data.filter(m => !m.fecha_fin);
      // Mapear a solo los campos necesarios
      const maquinasActivas = activas.map(m => ({
        id_maquina: Number(m.id_maquina),
        modelo: m.modelo,
        marca: m.marca
      }));
      setMaquinas(maquinasActivas);
      console.log('Máquinas activas:', maquinasActivas);
    } catch (error) {
      console.error('Error fetching maquinas:', error);
    }
  };

  const fetchCafes = async () => {
    try {
      const response = await fetch('http://localhost:5000/cafes');
      const data = await response.json();
      setCafes(data);
    } catch (error) {
      console.error('Error fetching cafes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Error registrando venta');
      setShowModal(false);
      resetForm();
      fetchVentas();
    } catch (error) {
      console.error('Error creating venta:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta venta?')) {
      try {
        const res = await fetch(`http://localhost:5000/ventas/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Error eliminando venta');
        fetchVentas();
      } catch (error) {
        console.error('Error deleting venta:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      maquina_id: '',
      cafe_id: '',
      cantidad: 1,
      fecha: new Date().toISOString().split('T')[0]
    });
  };

  const getCafesByMaquina = (maquinaId) => {
    const maquina = maquinas.find(m => m.id_maquina === parseInt(maquinaId));
    if (!maquina || !maquina.cafes) return [];
    return cafes.filter(cafe => 
      maquina.cafes.some(mc => mc.id_cafe === cafe.id_cafe)
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotal = () => {
    return ventas.reduce((total, venta) => {
      const cafe = cafes.find(c => c.id_cafe === venta.cafe_id);
      return total + (cafe ? cafe.precio_venta * venta.cantidad : 0);
    }, 0);
  };

  if (loading) {
    return <div className="loading">Cargando ventas...</div>;
  }

  return (
    <div className="ventas-admin">
      <div className="header">
        <div className="header-info">
          <h1>Gestión de Ventas</h1>
          <div className="stats">
            <div className="stat-item">
              <span className="stat-label">Total Ventas:</span>
              <span className="stat-value">{ventas.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Ingresos Totales:</span>
              <span className="stat-value">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowModal(true)}
        >
          Registrar Venta
        </button>
      </div>

      <div className="ventas-table-container">
        <table className="ventas-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Máquina</th>
              <th>Café</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map(venta => {
              const cafe = cafes.find(c => c.id_cafe === venta.id_cafe);
              const maquina = maquinas.find(m => m.id_maquina === venta.id_maquina || m.nombre === venta.nombre_maquina);
              const total = cafe ? cafe.precio_venta * venta.cantidad : 0;
              
                              return (
                  <tr key={venta.id_venta}>
                  <td>{formatDate(venta.fecha_venta)}</td>
                                 <td>{venta.nombre_maquina || maquina?.nombre || 'N/A'}</td>
               <td>{cafe?.nombre_cafe || 'N/A'}</td>
                  <td>{venta.cantidad}</td>
                                     <td>${venta.precio_unitario || cafe?.precio_venta || 0}</td>
                  <td className="total-cell">${total.toFixed(2)}</td>
                  <td>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(venta.id_venta)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Registrar Nueva Venta</h2>
              <button 
                className="btn-close"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Máquina:</label>
                <select
                  value={formData.maquina_id}
                  onChange={e => setFormData({ ...formData, maquina_id: Number(e.target.value), cafe_id: '' })}
                  required
                >
                  <option value="">Seleccionar máquina</option>
                  {maquinas.map(maquina => (
                    <option key={maquina.id_maquina} value={maquina.id_maquina}>
                      {maquina.modelo} - {maquina.marca}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Café:</label>
                <select
                  value={formData.cafe_id}
                  onChange={(e) => setFormData({...formData, cafe_id: e.target.value})}
                  required
                  disabled={!formData.maquina_id}
                >
                  <option value="">Seleccionar café</option>
                  {getCafesByMaquina(formData.maquina_id).map(cafe => (
                    <option key={cafe.id_cafe} value={cafe.id_cafe}>
                      {cafe.nombre_cafe} - ${cafe.precio_venta}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Cantidad:</label>
                <input
                  type="number"
                  min="1"
                  value={formData.cantidad}
                  onChange={(e) => setFormData({...formData, cantidad: parseInt(e.target.value) || 1})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Fecha:</label>
                <input
                  type="datetime-local"
                  value={formData.fecha + 'T00:00'}
                  onChange={(e) => setFormData({...formData, fecha: e.target.value.split('T')[0]})}
                  required
                />
              </div>
              
              {formData.cafe_id && (
                <div className="preview-total">
                  <strong>Total: ${(cafes.find(c => c.id_cafe === parseInt(formData.cafe_id))?.precio_venta * formData.cantidad || 0).toFixed(2)}</strong>
                </div>
              )}
              
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  Registrar Venta
                </button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VentasAdmin; 