import React, { useEffect, useState } from 'react';

function Maquinas() {
  const [maquinas, setMaquinas] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/maquinas/')
      .then(response => response.json())
      .then(data => setMaquinas(data))
      .catch(error => console.error('Error cargando maquinas:', error));
  }, []);

  return (
    <div>
      <h2>Máquinas</h2>
      <ul>
        {maquinas.map(maquina => (
          <li key={maquina.id}>
            Modelo: <strong>{maquina.modelo}</strong> – Cliente #{maquina.id_cliente} – Ubicación: {maquina.ubicacion_cliente}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Maquinas;
