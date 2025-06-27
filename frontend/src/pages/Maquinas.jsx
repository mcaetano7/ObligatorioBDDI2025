import React, { useEffect, useState } from 'react';

const Maquinas = () => {
  const [maquinas, setMaquinas] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMaquinas = async () => {
      try {
        const res = await fetch('http://localhost:5000/maquinas', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          },
        });
        if (!res.ok) throw new Error('Error al obtener máquinas');
        const data = await res.json();
        setMaquinas(data);
      } catch (err) {
        setError('No se pudieron cargar las máquinas');
      }
    };
    fetchMaquinas();
  }, []);

  return (
    <div>
      <h2>Máquinas</h2>
      {error && <p style={{color:'red'}}>{error}</p>}
      <ul>
        {maquinas.length === 0 ? (
          <li>No hay máquinas para mostrar.</li>
        ) : (
          maquinas.map((maquina) => (
            <li key={maquina.id}>{maquina.nombre}</li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Maquinas; 