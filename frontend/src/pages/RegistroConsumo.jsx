import React, { useState } from 'react';

const RegistroConsumo = () => {
  const [form, setForm] = useState({ id_alquiler: '', id_insumo: '', cantidad_usada: '', fecha: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Registro de consumo no implementado aún.');
    // Aquí irá el fetch POST cuando el backend esté listo
  };

  return (
    <div>
      <h2>Registro de Consumo</h2>
      <form onSubmit={handleSubmit}>
        <input name="id_alquiler" placeholder="ID Alquiler" value={form.id_alquiler} onChange={handleChange} required />
        <input name="id_insumo" placeholder="ID Insumo" value={form.id_insumo} onChange={handleChange} required />
        <input name="cantidad_usada" placeholder="Cantidad usada" value={form.cantidad_usada} onChange={handleChange} required />
        <input name="fecha" type="date" placeholder="Fecha" value={form.fecha} onChange={handleChange} required />
        <button type="submit">Registrar Consumo</button>
      </form>
    </div>
  );
};

export default RegistroConsumo; 