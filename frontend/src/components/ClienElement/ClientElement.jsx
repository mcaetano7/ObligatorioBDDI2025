import React, { useEffect, useState } from 'react';

function ClientElement() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/clientes/')
      .then(response => response.json())
      .then(data => setClientes(data))
      .catch(error => console.error('Error cargando clientes:', error));
  }, []);

  return (
    <div>
      <h2>Clientes</h2>
      <ul>
        {clientes.map(cliente => (
          <li key={cliente.id}>
            <strong>{cliente.nombre}</strong> – {cliente.correo}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClientElement;
