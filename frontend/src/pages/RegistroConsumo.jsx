import React, { useState, useEffect } from 'react';

const RegistroConsumo = () => {
  const [form, setForm] = useState({ id_alquiler: '', id_insumo: '', cantidad_consumida: '', fecha_consumo: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [insumos, setInsumos] = useState([]);
  const [alquileres, setAlquileres] = useState([]);

  // Obtener información del alquiler seleccionado
  const alquilerSeleccionado = alquileres.find(a => a.id_alquiler == form.id_alquiler);

  const fetchInsumos = async () => {
    try {
      const res = await fetch('http://localhost:5000/insumos/');
      if (res.ok) {
        const data = await res.json();
        setInsumos(data);
      }
    } catch (err) {
      console.error('Error cargando insumos:', err);
    }
  };

  const fetchAlquileres = async () => {
    try {
      const res = await fetch('http://localhost:5000/maquinas/alquileres-activos');
      console.log('Respuesta del servidor:', res.status, res.ok);
      if (res.ok) {
        const data = await res.json();
        console.log('Datos de alquileres:', data);
        setAlquileres(data);
      } else {
        console.error('Error en la respuesta:', res.status, res.statusText);
      }
    } catch (err) {
      console.error('Error cargando alquileres:', err);
    }
  };

  useEffect(() => {
    console.log('Componente RegistroConsumo montado');
    fetchInsumos();
    fetchAlquileres();
  }, []);

  useEffect(() => {
    console.log('Estado de alquileres actualizado:', alquileres);
  }, [alquileres]);

  const handleChange = (e) => {
    console.log('Campo cambiado:', e.target.name, 'Valor:', e.target.value);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const res = await fetch('http://localhost:5000/insumos/consumo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_alquiler: parseInt(form.id_alquiler),
          id_insumo: parseInt(form.id_insumo),
          cantidad_consumida: parseFloat(form.cantidad_consumida),
          fecha_consumo: form.fecha_consumo || new Date().toISOString().split('T')[0]
        }),
      });
      
      if (!res.ok) throw new Error('Error al registrar consumo');
      
      setSuccess('Consumo registrado correctamente');
      setForm({ id_alquiler: '', id_insumo: '', cantidad_consumida: '', fecha_consumo: '' });
    } catch (err) {
      setError('Error al registrar consumo: ' + err.message);
    }
  };

  return (
    <div>
      <h2>Registro de Consumo</h2>
      {error && <p style={{color:'red'}}>{error}</p>}
      {success && <p style={{color:'green'}}>{success}</p>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Alquiler:</label>
          <select name="id_alquiler" value={form.id_alquiler} onChange={handleChange} required>
            <option value="">Seleccionar alquiler</option>
            {alquileres.map(alquiler => (
              <option key={alquiler.id_alquiler} value={alquiler.id_alquiler}>
                {alquiler.nombre_empresa} - {alquiler.modelo} {alquiler.marca} (ID: {alquiler.id_alquiler})
              </option>
            ))}
          </select>
          {alquilerSeleccionado && (
            <div style={{marginTop: '10px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px'}}>
              <strong>Detalles del alquiler:</strong><br/>
              Cliente: {alquilerSeleccionado.nombre_empresa}<br/>
              Máquina: {alquilerSeleccionado.modelo} {alquilerSeleccionado.marca}<br/>
              Fecha inicio: {alquilerSeleccionado.fecha_inicio}<br/>
              Fecha fin: {alquilerSeleccionado.fecha_fin}
            </div>
          )}
        </div>
        
        <div>
          <label>Insumo:</label>
          <select name="id_insumo" value={form.id_insumo} onChange={handleChange} required>
            <option value="">Seleccionar insumo</option>
            {insumos.map(insumo => (
              <option key={insumo.id_insumo} value={insumo.id_insumo}>
                {insumo.nombre_insumo} - ${insumo.costo_unitario}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label>Cantidad consumida:</label>
          <input 
            name="cantidad_consumida" 
            type="number" 
            step="0.01"
            placeholder="Cantidad" 
            value={form.cantidad_consumida} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div>
          <label>Fecha de consumo:</label>
          <input 
            name="fecha_consumo" 
            type="date" 
            value={form.fecha_consumo} 
            onChange={handleChange} 
          />
        </div>
        
        <button type="submit">Registrar Consumo</button>
      </form>
    </div>
  );
};

export default RegistroConsumo; 