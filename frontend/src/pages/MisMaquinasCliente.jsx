import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MisMaquinasCliente = () => {
  const [maquinas, setMaquinas] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [alquilerSeleccionado, setAlquilerSeleccionado] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      // 1. Obtener id_cliente a partir de id_usuario
      const resId = await axios.get(`http://localhost:5000/cliente/id-cliente/${user.id_usuario}`);
      const id_cliente = resId.data.id_cliente;
      // 2. Obtener alquileres del cliente
      const resAlq = await axios.get(`http://localhost:5000/cliente/alquileres-cliente/${id_cliente}`);
      // 3. Obtener datos de las máquinas para cada alquiler
      const maquinasPromises = resAlq.data.map(alq =>
        axios.get(`http://localhost:5000/maquinas/${alq.id_maquina}`)
          .then(res => ({ ...alq, ...res.data }))
      );
      const maquinasData = await Promise.all(maquinasPromises);
      setMaquinas(maquinasData);
    };
    fetchData();
  }, [user]);

  const handleSolicitarMantenimiento = (alquiler) => {
    setAlquilerSeleccionado(alquiler);
    setMostrarModal(true);
    setDescripcion('');
    setError('');
    setMensaje('');
  };

  const handleEnviarSolicitud = async () => {
    if (!descripcion.trim()) {
      setError('Por favor, describe el problema');
      return;
    }

    try {
      await axios.post('http://localhost:5000/mantenimientos/', {
        id_alquiler: alquilerSeleccionado.id_alquiler,
        descripcion: descripcion
      });
      setMensaje('Solicitud de mantenimiento enviada correctamente');
      setDescripcion('');
      setTimeout(() => {
        setMostrarModal(false);
        setMensaje('');
      }, 2000);
    } catch {
      setError('Error al enviar la solicitud de mantenimiento');
    }
  };

  const handleCancelar = () => {
    setMostrarModal(false);
    setAlquilerSeleccionado(null);
    setDescripcion('');
    setError('');
    setMensaje('');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Mis Máquinas Alquiladas</h2>
      {maquinas.length === 0 ? (
        <p>No tienes máquinas alquiladas actualmente.</p>
      ) : (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>ID</th>
              <th>Modelo</th>
              <th>Marca</th>
              <th>Fecha de inicio</th>
              <th>Fecha de fin</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {maquinas.map((row, idx) => (
              <tr key={idx}>
                <td>{row.id_maquina}</td>
                <td>{row.modelo}</td>
                <td>{row.marca}</td>
                <td>{row.fecha_inicio ? row.fecha_inicio.substring(0, 10) : '-'}</td>
                <td>{row.fecha_fin ? row.fecha_fin.substring(0, 10) : '-'}</td>
                <td>
                  <button 
                    onClick={() => handleSolicitarMantenimiento(row)}
                    style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                  >
                    Solicitar Mantenimiento
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal para solicitar mantenimiento */}
      {mostrarModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            minWidth: '400px',
            maxWidth: '600px'
          }}>
            <h3>Solicitar Mantenimiento</h3>
            <p><strong>Máquina:</strong> {alquilerSeleccionado?.modelo} - {alquilerSeleccionado?.marca}</p>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                <strong>Descripción del problema:</strong>
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe el problema que tienes con la máquina..."
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  resize: 'vertical'
                }}
              />
            </div>
            
            {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
            {mensaje && <p style={{ color: 'green', marginBottom: '10px' }}>{mensaje}</p>}
            
            <div style={{ textAlign: 'right' }}>
              <button
                onClick={handleCancelar}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  marginRight: '10px',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleEnviarSolicitud}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                Enviar Solicitud
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisMaquinasCliente; 