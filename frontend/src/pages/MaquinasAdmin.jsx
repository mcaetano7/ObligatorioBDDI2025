import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MaquinasAdmin = () => {
  const [maquinas, setMaquinas] = useState([]);
  const [nueva, setNueva] = useState({
    modelo: '',
    marca: '',
    capacidad_cafe: '',
    capacidad_agua: '',
    costo_mensual_alquiler: '',
    porcentaje_ganancia_empresa: ''
  });

  const fetchMaquinas = async () => {
    const res = await axios.get('http://localhost:5000/maquinas');
    setMaquinas(res.data);
  };

  useEffect(() => {
    fetchMaquinas();
  }, []);

  const agregarMaquina = async () => {
    await axios.post('http://localhost:5000/maquinas', nueva);
    setNueva({ modelo: '', marca: '', capacidad_cafe: '', capacidad_agua: '', costo_mensual_alquiler: '', porcentaje_ganancia_empresa: '' });
    fetchMaquinas();
  };

  const eliminarMaquina = async (id) => {
    if (!window.confirm('¿Eliminar esta máquina?')) return;
    await axios.delete(`http://localhost:5000/maquinas/${id}`);
    fetchMaquinas();
  };

  const editarMaquina = async (id) => {
    const datos = prompt('Introduce los nuevos datos separados por coma (modelo,marca,cafe,agua,costo,porcentaje)');
    if (!datos) return;
    const [modelo, marca, cafe, agua, costo, porcentaje] = datos.split(',');
    await axios.put(`http://localhost:5000/maquinas/${id}`, {
      modelo, marca,
      capacidad_cafe: parseInt(cafe),
      capacidad_agua: parseInt(agua),
      costo_mensual_alquiler: parseFloat(costo),
      porcentaje_ganancia_empresa: parseFloat(porcentaje)
    });
    fetchMaquinas();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Gestión de Máquinas</h2>

      <div style={{ marginBottom: 20 }}>
        {['modelo', 'marca', 'capacidad_cafe', 'capacidad_agua', 'costo_mensual_alquiler', 'porcentaje_ganancia_empresa'].map(field => (
          <input
            key={field}
            type="text"
            placeholder={field.replace(/_/g, ' ')}
            value={nueva[field]}
            onChange={e => setNueva({ ...nueva, [field]: e.target.value })}
          />
        ))}
        <button onClick={agregarMaquina}>Agregar</button>
      </div>

      <ul>
        {maquinas.map(m => (
          <li key={m.id_maquina}>
            <b>{m.marca} {m.modelo}</b> - Café: {m.capacidad_cafe}g / Agua: {m.capacidad_agua}ml - ${m.costo_mensual_alquiler} / {m.porcentaje_ganancia_empresa}%
            <button onClick={() => editarMaquina(m.id_maquina)}>Editar</button>
            <button onClick={() => eliminarMaquina(m.id_maquina)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MaquinasAdmin;