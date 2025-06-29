import React, { useState, useEffect } from 'react';

const Maquinas = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const esCliente = usuario?.id_rol === 1;
  const esAdmin = usuario?.id_rol === 2;

  const [maquinas, setMaquinas] = useState([]);
  const [form, setForm] = useState({
    modelo: '',
    marca: '',
    capacidad_cafe: '',
    capacidad_agua: '',
    costo_mensual_alquiler: '',
    porcentaje_ganancia_empresa: ''
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMaquinas = async () => {
      try {
        const res = await fetch('http://localhost:5000/maquinas');
        const data = await res.json();
        if (res.ok) {
          setMaquinas(data);
        } else {
          setError(data.error || 'Error al obtener las máquinas');
        }
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError('Error de red al obtener máquinas');
      }
    };

    fetchMaquinas();
  }, []);

  const handleAlquilar = async (id_maquina) => {
    try {
      const resCliente = await fetch(`http://localhost:5000/cliente/id-cliente/${usuario.id_usuario}`);
      const dataCliente = await resCliente.json();

      if (!resCliente.ok) {
        alert(dataCliente.error || 'No se pudo obtener el cliente');
        return;
      }

      const id_cliente = dataCliente.id_cliente;

      const fecha_inicio = new Date().toISOString().split('T')[0];
      const fecha_fin = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const res = await fetch('http://localhost:5000/cliente/alquileres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_cliente,
          id_maquina,
          fecha_inicio,
          fecha_fin
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Alquiler realizado con éxito');
      } else {
        alert(data.error || 'Error al alquilar la máquina');
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert('Error de red al intentar alquilar.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editId
        ? `http://localhost:5000/maquinas/${editId}`
        : 'http://localhost:5000/maquinas';
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (res.ok) {
        alert(editId ? 'Máquina actualizada' : 'Máquina creada');
        window.location.reload();
      } else {
        alert(data.error || 'Error al guardar');
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert('Error de red');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta máquina?')) return;

    try {
      const res = await fetch(`http://localhost:5000/maquinas/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok) {
        alert('Máquina eliminada');
        window.location.reload();
      } else {
        alert(data.error || 'Error al eliminar máquina');
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert('Error de red al eliminar máquina');
    }
  };

  const handleEdit = (maq) => {
    setForm({
      modelo: maq.modelo,
      marca: maq.marca,
      capacidad_cafe: maq.capacidad_cafe,
      capacidad_agua: maq.capacidad_agua,
      costo_mensual_alquiler: maq.costo_mensual_alquiler,
      porcentaje_ganancia_empresa: maq.porcentaje_ganancia_empresa
    });
    setEditId(maq.id_maquina);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Máquinas</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <ul className="space-y-4">
        {maquinas.length === 0 ? (
          <li>No hay máquinas registradas.</li>
        ) : (
          maquinas.map((maq) => (
            <li key={maq.id_maquina} className="border p-4 rounded shadow">
              <p><strong>Modelo:</strong> {maq.modelo}</p>
              <p><strong>Marca:</strong> {maq.marca}</p>
              <p><strong>Capacidad Café:</strong> {maq.capacidad_cafe}L</p>
              <p><strong>Capacidad Agua:</strong> {maq.capacidad_agua}L</p>
              <p><strong>Costo mensual:</strong> ${maq.costo_mensual_alquiler}</p>
              <p><strong>% Ganancia empresa:</strong> {maq.porcentaje_ganancia_empresa}%</p>

              {esCliente && (
                <button
                  onClick={() => handleAlquilar(maq.id_maquina)}
                  className="mt-2 px-4 py-1 bg-blue-600 text-white rounded"
                >
                  Alquilar
                </button>
              )}

              {esAdmin && (
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => handleEdit(maq)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(maq.id_maquina)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </li>
          ))
        )}
      </ul>

      {esAdmin && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">
            {editId ? 'Editar Máquina' : 'Nueva Máquina'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-2">
            {Object.entries(form).map(([key, value]) => (
              <input
                key={key}
                name={key}
                value={value}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={key.replace(/_/g, ' ')}
                required
                className="w-full border p-2 rounded"
              />
            ))}
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              {editId ? 'Guardar Cambios' : 'Agregar Máquina'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Maquinas;