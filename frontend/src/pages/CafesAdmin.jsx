import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './CafesAdmin.css';

const CafesAdmin = () => {
  const { user } = useAuth();
  const [cafes, setCafes] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCafe, setEditingCafe] = useState(null);
  const [formData, setFormData] = useState({
    nombre_cafe: '',
    descripcion: '',
    precio_venta: '',
    insumos: []
  });

  useEffect(() => {
    if (user) {
      fetchCafes();
      fetchInsumos();
    }
  }, [user]);

  const fetchCafes = async () => {
    try {
      const response = await fetch('/cafes');
      const data = await response.json();
      setCafes(data);
    } catch (error) {
      console.error('Error fetching cafes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInsumos = async () => {
    try {
      const response = await fetch('/insumos');
      const data = await response.json();
      setInsumos(data);
    } catch (error) {
      console.error('Error fetching insumos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingCafe ? 'PUT' : 'POST';
      const url = editingCafe ? `/cafes/${editingCafe.id_cafe}` : '/cafes';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Error guardando café');
      setShowModal(false);
      setEditingCafe(null);
      resetForm();
      fetchCafes();
    } catch (error) {
      console.error('Error saving cafe:', error);
    }
  };

  const handleEdit = (cafe) => {
    setEditingCafe(cafe);
    setFormData({
      nombre_cafe: cafe.nombre_cafe,
      descripcion: cafe.descripcion,
      precio_venta: cafe.precio_venta.toString(),
      insumos: cafe.insumos || []
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este café?')) {
      try {
        const res = await fetch(`/cafes/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Error eliminando café');
        fetchCafes();
      } catch (error) {
        console.error('Error deleting cafe:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre_cafe: '',
      descripcion: '',
      precio_venta: '',
      insumos: []
    });
  };

  const handleInsumoChange = (insumoId, checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        insumos: [...prev.insumos, { id_insumo: insumoId, cantidad: 1 }]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        insumos: prev.insumos.filter(i => i.id_insumo !== insumoId)
      }));
    }
  };

  const handleCantidadChange = (insumoId, cantidad) => {
    setFormData(prev => ({
      ...prev,
      insumos: prev.insumos.map(i => 
        i.id_insumo === insumoId ? { ...i, cantidad: parseInt(cantidad) || 1 } : i
      )
    }));
  };

  if (loading) {
    return <div className="loading">Cargando cafés...</div>;
  }

  return (
    <div className="cafes-admin">
      <div className="header">
        <h1>Gestión de Cafés</h1>
        <button 
          className="btn-primary"
          onClick={() => {
            setEditingCafe(null);
            resetForm();
            setShowModal(true);
          }}
        >
          Nuevo Café
        </button>
      </div>

      <div className="cafes-grid">
        {cafes.map(cafe => (
          <div key={cafe.id} className="cafe-card">
            <div className="cafe-header">
              <h3>{cafe.nombre_cafe}</h3>
              <div className="cafe-actions">
                <button 
                  className="btn-edit"
                  onClick={() => handleEdit(cafe)}
                >
                  Editar
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(cafe.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
            <p className="cafe-description">{cafe.descripcion}</p>
            <p className="cafe-price">Precio: ${cafe.precio_venta}</p>
            <div className="cafe-insumos">
              <h4>Insumos:</h4>
              <ul>
                {cafe.insumos?.map(insumo => (
                  <li key={insumo.id_insumo}>
                    {insumos.find(i => i.id_insumo === insumo.id_insumo)?.nombre_insumo} - {insumo.cantidad_por_servicio} unidades
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingCafe ? 'Editar Café' : 'Nuevo Café'}</h2>
              <button 
                className="btn-close"
                onClick={() => {
                  setShowModal(false);
                  setEditingCafe(null);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  value={formData.nombre_cafe}
                  onChange={(e) => setFormData({...formData, nombre_cafe: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Descripción:</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Precio:</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.precio_venta}
                  onChange={(e) => setFormData({...formData, precio_venta: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Insumos:</label>
                <div className="insumos-list">
                  {insumos.map(insumo => (
                    <div key={insumo.id} className="insumo-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={formData.insumos.some(i => i.id_insumo === insumo.id_insumo)}
                          onChange={(e) => handleInsumoChange(insumo.id_insumo, e.target.checked)}
                        />
                        {insumo.nombre_insumo}
                      </label>
                                              {formData.insumos.some(i => i.id_insumo === insumo.id_insumo) && (
                          <input
                            type="number"
                            min="1"
                            value={formData.insumos.find(i => i.id_insumo === insumo.id_insumo)?.cantidad || 1}
                            onChange={(e) => handleCantidadChange(insumo.id_insumo, e.target.value)}
                            className="cantidad-input"
                          />
                        )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingCafe ? 'Actualizar' : 'Crear'}
                </button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCafe(null);
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

export default CafesAdmin; 