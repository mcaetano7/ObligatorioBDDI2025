import React, { useState } from "react";

const AdminAlquilerElement = ({ alquiler }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <div className="border p-3 rounded mb-2 shadow-md bg-white">
      <div
        className="cursor-pointer font-semibold text-lg text-blue-800"
        onClick={toggleExpanded}
      >
        {alquiler.marca} {alquiler.modelo}
      </div>
      {expanded && (
        <div className="mt-2 ml-4 text-gray-700">
          <p><strong>ID Máquina:</strong> {alquiler.id_maquina}</p>
          <p><strong>Ubicación:</strong> {alquiler.ubicacion}</p>
          <p><strong>Fecha Inicio:</strong> {alquiler.fecha_inicio || 'N/A'}</p>
          <p><strong>Fecha Fin:</strong> {alquiler.fecha_fin || 'N/A'}</p>
          <p><strong>Precio Alquiler:</strong> ${alquiler.coste_total_alquiler || '0.00'}</p>
          <p><strong>Ganancia Empresa:</strong> ${alquiler.ganancia_empresa || '0.00'}</p>
        </div>
      )}
    </div>
  );
};

export default AdminAlquilerElement;