import React, { useState } from 'react';

const Insumos = () => {
  // Placeholder: cuando el backend esté listo, usar useEffect para fetch real
  const [insumos, setInsumos] = useState([
    // Ejemplo de datos estáticos
    { id_insumo: 1, nombre_insumo: 'Café instantáneo 1kg', unidad_medida: 'Café', costo_unitario: 720.00, id_proveedor: 1 },
    { id_insumo: 2, nombre_insumo: 'Leche en polvo 1kg', unidad_medida: 'Lácteo', costo_unitario: 680.00, id_proveedor: 2 },
  ]);
  const [form, setForm] = useState({ nombre_insumo: '', unidad_medida: '', costo_unitario: '', id_proveedor: '' });
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Alta de insumo no implementada aún.');
    // Aquí irá el fetch POST cuando el backend esté listo
  };

  const handleEdit = (insumo) => {
    setEditId(insumo.id_insumo);
    setForm({
      nombre_insumo: insumo.nombre_insumo,
      unidad_medida: insumo.unidad_medida,
      costo_unitario: insumo.costo_unitario,
      id_proveedor: insumo.id_proveedor,
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    alert('Edición de insumo no implementada aún.');
    setEditId(null);
    // Aquí irá el fetch PUT cuando el backend esté listo
  };

  const handleDelete = (id) => {
    alert('Eliminación de insumo no implementada aún.');
    // Aquí irá el fetch DELETE cuando el backend esté listo
  };

  return (
    <div>
      <h2>Insumos</h2>
      <ul>
        {insumos.length === 0 ? (
          <li>No hay insumos para mostrar.</li>
        ) : (
          insumos.map((insumo) => (
            <li key={insumo.id_insumo}>
              {editId === insumo.id_insumo ? (
                <form onSubmit={handleUpdate} style={{display:'inline'}}>
                  <input name="nombre_insumo" value={form.nombre_insumo} onChange={handleChange} required />
                  <input name="unidad_medida" value={form.unidad_medida} onChange={handleChange} required />
                  <input name="costo_unitario" value={form.costo_unitario} onChange={handleChange} required />
                  <input name="id_proveedor" value={form.id_proveedor} onChange={handleChange} required />
                  <button type="submit">Guardar</button>
                  <button type="button" onClick={()=>setEditId(null)}>Cancelar</button>
                </form>
              ) : (
                <>
                  <b>{insumo.nombre_insumo}</b> | {insumo.unidad_medida} | ${insumo.costo_unitario} | Proveedor: {insumo.id_proveedor}
                  <button onClick={()=>handleEdit(insumo)}>Editar</button>
                  <button onClick={()=>handleDelete(insumo.id_insumo)}>Eliminar</button>
                </>
              )}
            </li>
          ))
        )}
      </ul>
      <h3>Agregar Insumo</h3>
      <form onSubmit={handleSubmit}>
        <input name="nombre_insumo" placeholder="Nombre insumo" value={form.nombre_insumo} onChange={handleChange} required />
        <input name="unidad_medida" placeholder="Unidad" value={form.unidad_medida} onChange={handleChange} required />
        <input name="costo_unitario" placeholder="Costo unitario" value={form.costo_unitario} onChange={handleChange} required />
        <input name="id_proveedor" placeholder="ID proveedor" value={form.id_proveedor} onChange={handleChange} required />
        <button type="submit">Agregar</button>
      </form>
    </div>
  );
};

export default Insumos; 