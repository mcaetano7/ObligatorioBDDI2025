import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProveedoresAdmin = () => {
  const [proveedores, setProveedores] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: '', contacto: '' });

  const fetchProveedores = async () => {
    const res = await axios.get('http://localhost:5000/proveedores');
    setProveedores(res.data);
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const agregarProveedor = async () => {
    if (!nuevo.nombre || !nuevo.contacto) return alert('Faltan campos');
    await axios.post('http://localhost:5000/proveedores', nuevo);
    setNuevo({ nombre: '', contacto: '' });
    fetchProveedores();
  };

  const eliminarProveedor = async (id) => {
    if (!window.confirm('¿Eliminar proveedor?')) return;
    await axios.delete(`http://localhost:5000/proveedores/${id}`);
    fetchProveedores();
  };

  const editarProveedor = async (id) => {
    const nombre = prompt('Nuevo nombre:');
    const contacto = prompt('Nuevo contacto:');
    if (!nombre || !contacto) return;
    await axios.put(`http://localhost:5000/proveedores/${id}`, { nombre, contacto });
    fetchProveedores();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Gestión de Proveedores</h2>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Nombre"
          value={nuevo.nombre}
          onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })}
        />
        <input
          type="text"
          placeholder="Contacto"
          value={nuevo.contacto}
          onChange={e => setNuevo({ ...nuevo, contacto: e.target.value })}
        />
        <button onClick={agregarProveedor}>Agregar</button>
      </div>

      <ul>
        {proveedores.map(p => (
          <li key={p.id_proveedor}>
            <b>{p.nombre}</b> — {p.contacto}
            <button onClick={() => editarProveedor(p.id_proveedor)}>Editar</button>
            <button onClick={() => eliminarProveedor(p.id_proveedor)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProveedoresAdmin;