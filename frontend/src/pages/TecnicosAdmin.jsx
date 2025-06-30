import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TecnicosAdmin = () => {
  const [tecnicos, setTecnicos] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: '', especialidad: '' });

  const fetchTecnicos = async () => {
    const res = await axios.get('http://localhost:5000/tecnicos');
    setTecnicos(res.data);
  };

  useEffect(() => {
    fetchTecnicos();
  }, []);

  const agregarTecnico = async () => {
    if (!nuevo.nombre || !nuevo.especialidad) return alert('Faltan campos');
    await axios.post('http://localhost:5000/tecnicos', nuevo);
    setNuevo({ nombre: '', especialidad: '' });
    fetchTecnicos();
  };

  const eliminarTecnico = async (id) => {
    if (!window.confirm('¿Eliminar técnico?')) return;
    await axios.delete(`http://localhost:5000/tecnicos/${id}`);
    fetchTecnicos();
  };

  const editarTecnico = async (id) => {
    const nombre = prompt('Nuevo nombre:');
    const especialidad = prompt('Nueva especialidad:');
    if (!nombre || !especialidad) return;
    await axios.put(`http://localhost:5000/tecnicos/${id}`, { nombre, especialidad });
    fetchTecnicos();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Gestión de Técnicos</h2>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Nombre"
          value={nuevo.nombre}
          onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })}
        />
        <input
          type="text"
          placeholder="Especialidad"
          value={nuevo.especialidad}
          onChange={e => setNuevo({ ...nuevo, especialidad: e.target.value })}
        />
        <button onClick={agregarTecnico}>Agregar</button>
      </div>

      <ul>
        {tecnicos.map(t => (
          <li key={t.id_tecnico}>
            <b>{t.nombre}</b> — {t.especialidad}
            <button onClick={() => editarTecnico(t.id_tecnico)}>Editar</button>
            <button onClick={() => eliminarTecnico(t.id_tecnico)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TecnicosAdmin;