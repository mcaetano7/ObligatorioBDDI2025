import React, { useState, useEffect } from 'react';

const RegistroConsumo = () => {
  const [form, setForm] = useState({ id_alquiler: '', id_insumo: '', cantidad_consumida: '', fecha_consumo: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [insumos, setInsumos] = useState([]);
  const [alquileres, setAlquileres] = useState([]);

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
      const res = await fetch('http://localhost:5000/maquinas/en-alquiler');
      if (res.ok) {
        const data = await res.json();
        setAlquileres(data);
      }
    } catch (err) {
      console.error('Error cargando alquileres:', err);
    }
  };

  useEffect(() => {
    fetchInsumos();
    fetchAlquileres();
  }, []);

  const handleChange = (e) => {
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
                {alquiler.nombre_empresa} - {alquiler.modelo} {alquiler.marca}
              </option>
            ))}
          </select>
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