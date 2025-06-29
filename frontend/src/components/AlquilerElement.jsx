import React, { useState } from 'react';
import axios from 'axios';

const AlquilerElement = ({ alquiler }) => {
  const [mostrarDetalles, setMostrarDetalles] = useState(false);

  const solicitarMantenimiento = async () => {
    const descripcion = prompt("Describe el problema:");
    if (!descripcion) return;
    try {
      await axios.post('http://localhost:5000/cliente/solicitudes', {
        id_alquiler: alquiler.id_alquiler,
        descripcion
      });
      alert('Solicitud enviada correctamente');
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert('Error al solicitar mantenimiento');
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
      <div onClick={() => setMostrarDetalles(!mostrarDetalles)}>
        🧃 Máquina alquilada #{alquiler.id_maquina}
      </div>
      {mostrarDetalles && (
        <div>
          <p><b>Inicio:</b> {alquiler.fecha_inicio}</p>
          <p><b>Fin:</b> {alquiler.fecha_fin}</p>
          <p><b>Coste:</b> ${alquiler.coste_total_alquiler}</p>
          <button onClick={solicitarMantenimiento}>Solicitar mantenimiento</button>
        </div>
      )}
    </div>
  );
};

export default AlquilerElement;