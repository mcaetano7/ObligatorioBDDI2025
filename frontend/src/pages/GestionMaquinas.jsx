import React, { useEffect, useState } from 'react';
import maquinaAdminService from '../services/maquinaAdminService';
import cafeAdminService from '../services/cafeAdminService';
import './GestionMaquinas.css';
import { useNavigate } from 'react-router-dom';

const GestionMaquinas = () => {
  const [maquinas, setMaquinas] = useState([]);
  const [cafes, setCafes] = useState([]);
  const [cafesSeleccionados, setCafesSeleccionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMaquina, setEditMaquina] = useState(null);
  const [form, setForm] = useState({
    modelo: '',
    marca: '',
    capacidad_cafe: '',
    capacidad_agua: '',
    costo_mensual_alquiler: '',
    porcentaje_ganancia_empresa: '',
    estado: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    cargarMaquinas();
    cargarCafes();
  }, []);

  const cargarMaquinas = async () => {
    setLoading(true);
    try {
      const data = await maquinaAdminService.obtenerMaquinasConCafes();
      setMaquinas(data);
    } catch {
      setError('Error al cargar máquinas');
    } finally {
      setLoading(false);
    }
  };

  const cargarCafes = async () => {
    try {
      const data = await cafeAdminService.obtenerCafes();
      setCafes(data);
    } catch {
      setError('Error al cargar cafés');
    }
  };

  const abrirModalNuevo = () => {
    setEditMaquina(null);
    setForm({ modelo: '', marca: '', capacidad_cafe: '', capacidad_agua: '', costo_mensual_alquiler: '', porcentaje_ganancia_empresa: '' });
    setCafesSeleccionados([]);
    setShowModal(true);
    setError('');
  };

  const abrirModalEditar = async (maquina) => {
    setEditMaquina(maquina);
    setForm({
      modelo: maquina.modelo,
      marca: maquina.marca,
      capacidad_cafe: maquina.capacidad_cafe,
      capacidad_agua: maquina.capacidad_agua,
      costo_mensual_alquiler: maquina.costo_mensual_alquiler,
      porcentaje_ganancia_empresa: maquina.porcentaje_ganancia_empresa,
      estado: maquina.estado
    });
    try {
      const cafesMaquina = await cafeAdminService.obtenerCafesPorMaquina(maquina.id_maquina);
      setCafesSeleccionados(cafesMaquina.map(c => c.id_cafe));
    } catch {
      setCafesSeleccionados([]);
    }
    setShowModal(true);
    setError('');
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditMaquina(null);
    setForm({ modelo: '', marca: '', capacidad_cafe: '', capacidad_agua: '', costo_mensual_alquiler: '', porcentaje_ganancia_empresa: '', estado: false });
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleCafeChange = (e) => {
    const id = parseInt(e.target.value);
    setCafesSeleccionados(prev =>
      e.target.checked ? [...prev, id] : prev.filter(cid => cid !== id)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let id_maquina;
      let formToSend = { ...form, estado: form.estado ? 1 : 0 };
      if (editMaquina) {
        await maquinaAdminService.actualizarMaquina(editMaquina.id_maquina, formToSend);
        id_maquina = editMaquina.id_maquina;
      } else {
        const res = await maquinaAdminService.crearMaquina({ ...formToSend, estado: 0 });
        id_maquina = res.id_maquina || null;
        await cargarMaquinas();
        if (!id_maquina) {
          const maquinasActualizadas = await maquinaAdminService.obtenerMaquinasConCafes();
          id_maquina = maquinasActualizadas[maquinasActualizadas.length - 1]?.id_maquina;
        }
      }
      if (id_maquina) {
        await maquinaAdminService.actualizarCafesMaquina(id_maquina, cafesSeleccionados);
      }
      setSuccess(editMaquina ? 'Máquina actualizada correctamente' : 'Máquina creada correctamente');
      cerrarModal();
      cargarMaquinas();
      setTimeout(() => setSuccess(''), 2000);
    } catch {
      setError('Error al guardar máquina');
    }
  };

  const handleEliminar = async (id_maquina) => {
    if (!window.confirm('¿Seguro que desea eliminar esta máquina?')) return;
    try {
      await maquinaAdminService.eliminarMaquina(id_maquina);
      setSuccess('Máquina eliminada correctamente');
      cargarMaquinas();
      setTimeout(() => setSuccess(''), 2000);
    } catch {
      setError('Error al eliminar máquina');
    }
  };

  return (
    <div className="gestion-maquinas-container">
      <button className="btn btn-secondary" style={{marginBottom: '18px'}} onClick={() => navigate('/dashboard')}>Volver al Dashboard</button>
      <div className="header">
        <h1>Gestión de Máquinas</h1>
        <button className="btn btn-primary" onClick={abrirModalNuevo}>Nueva Máquina</button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      {loading ? (
        <div className="loading">Cargando máquinas...</div>
      ) : (
        <div className="tabla-maquinas-container">
          <table className="tabla-maquinas">
            <thead>
              <tr>
                <th>ID</th>
                <th>Modelo</th>
                <th>Marca</th>
                <th>Cap. Café</th>
                <th>Cap. Agua</th>
                <th>Costo Mensual</th>
                <th>% Ganancia</th>
                <th>Estado</th>
                <th>Cafés</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {maquinas.map(maquina => (
                <tr key={maquina.id_maquina}>
                  <td>{maquina.id_maquina}</td>
                  <td>{maquina.modelo}</td>
                  <td>{maquina.marca}</td>
                  <td>{maquina.capacidad_cafe}</td>
                  <td>{maquina.capacidad_agua}</td>
                  <td>${maquina.costo_mensual_alquiler}</td>
                  <td>{maquina.porcentaje_ganancia_empresa}%</td>
                  <td>{maquina.estado ? 'Alquilada' : 'Disponible'}</td>
                  <td>{maquina.cafes && maquina.cafes.length > 0 ? maquina.cafes.map(c => c.nombre_cafe).join(', ') : '-'}</td>
                  <td>
                    <button className="btn btn-secondary" onClick={() => abrirModalEditar(maquina)}>Editar</button>
                    <button className="btn btn-danger" onClick={() => handleEliminar(maquina.id_maquina)}>Eliminar</button>
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
              <h2>{editMaquina ? 'Editar Máquina' : 'Nueva Máquina'}</h2>
              <button className="close-btn" onClick={cerrarModal}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="form-modal">
              <div className="form-group">
                <label>Modelo</label>
                <input name="modelo" value={form.modelo} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Marca</label>
                <input name="marca" value={form.marca} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Capacidad Café</label>
                <input name="capacidad_cafe" value={form.capacidad_cafe} onChange={handleInputChange} required type="number" min="0" step="0.01" />
              </div>
              <div className="form-group">
                <label>Capacidad Agua</label>
                <input name="capacidad_agua" value={form.capacidad_agua} onChange={handleInputChange} required type="number" min="0" step="0.01" />
              </div>
              <div className="form-group">
                <label>Costo Mensual Alquiler</label>
                <input name="costo_mensual_alquiler" value={form.costo_mensual_alquiler} onChange={handleInputChange} required type="number" min="0" step="0.01" />
              </div>
              <div className="form-group">
                <label>% Ganancia Empresa</label>
                <input name="porcentaje_ganancia_empresa" value={form.porcentaje_ganancia_empresa} onChange={handleInputChange} required type="number" min="0" max="100" step="0.01" />
              </div>
              <div className="form-group">
                <label>Cafés disponibles en la máquina</label>
                <div style={{display:'flex', flexWrap:'wrap', gap:'10px'}}>
                  {cafes.map(cafe => (
                    <label key={cafe.id_cafe} style={{marginRight:'12px'}}>
                      <input
                        type="checkbox"
                        value={cafe.id_cafe}
                        checked={cafesSeleccionados.includes(Number(cafe.id_cafe))}
                        onChange={handleCafeChange}
                      />
                      {cafe.nombre_cafe}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" type="submit">{editMaquina ? 'Actualizar' : 'Crear'}</button>
                <button className="btn btn-secondary" type="button" onClick={cerrarModal}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionMaquinas; 