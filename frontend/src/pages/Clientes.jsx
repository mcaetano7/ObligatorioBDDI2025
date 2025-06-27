import React, { useEffect, useState } from 'react';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await fetch('http://localhost:5000/clientes', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          },
        });
        if (!res.ok) throw new Error('Error al obtener clientes');
        const data = await res.json();
        setClientes(data);
      } catch (err) {
        setError('No se pudieron cargar los clientes');
      }
    };
    fetchClientes();
  }, []);

  return (
    <div>
      <h2>Clientes</h2>
      {error && <p style={{color:'red'}}>{error}</p>}
      <ul>
        {clientes.length === 0 ? (
          <li>No hay clientes para mostrar.</li>
        ) : (
          clientes.map((cliente) => (
            <li key={cliente.id}>{cliente.nombre}</li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Clientes; 