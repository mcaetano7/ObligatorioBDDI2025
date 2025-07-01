import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AlquilerElement from '../components/AdminAlquilerElement';

const MaquinasPorCliente = () => {
  const [datos, setDatos] = useState({});
  const [expandedCliente, setExpandedCliente] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get('http://localhost:5000/reportes/maquinas-por-cliente');
      const agrupado = agruparPorCliente(res.data);
      setDatos(agrupado);
    };

    fetchData();
  }, []);

  const agruparPorCliente = (lista) => {
    const agrupado = {};
    lista.forEach((item) => {
      const key = item.nombre_cliente;
      if (!agrupado[key]) agrupado[key] = [];
      agrupado[key].push(item);
    });
    return agrupado;
  };

  const toggleCliente = (cliente) => {
    setExpandedCliente(prev => ({ ...prev, [cliente]: !prev[cliente] }));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Máquinas por Cliente</h2>
      {Object.keys(datos).map(cliente => (
        <div key={cliente} style={{ marginBottom: 10, border: '1px solid #ccc', padding: 10, borderRadius: 8 }}>
          <div
            onClick={() => toggleCliente(cliente)}
            style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: 16 }}
          >
            {cliente}
          </div>
          {expandedCliente[cliente] && (
            <div style={{ marginTop: 10 }}>
              {datos[cliente].map((alquiler, idx) => (
                <AlquilerElement key={idx} alquiler={alquiler} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MaquinasPorCliente;

/*import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MaquinasPorCliente = () => {
  const [datos, setDatos] = useState({});
  const [expandedCliente, setExpandedCliente] = useState({});
  const [detallesMaquina, setDetallesMaquina] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get('http://localhost:5000/reportes/maquinas-por-cliente');
      const agrupado = agruparPorCliente(res.data);
      setDatos(agrupado);
    };

    fetchData();
  }, []);

  const agruparPorCliente = (lista) => {
    const agrupado = {};
    lista.forEach((item) => {
      const key = item.nombre_cliente;
      if (!agrupado[key]) agrupado[key] = [];
      agrupado[key].push(item);
    });
    return agrupado;
  };

  const toggleCliente = (cliente) => {
    setExpandedCliente(prev => ({ ...prev, [cliente]: !prev[cliente] }));
  };

  const toggleDetallesMaquina = (cliente, index) => {
    const clave = `${cliente}_${index}`;
    setDetallesMaquina(prev => ({
      ...prev,
      [clave]: !prev[clave]
    }));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Máquinas por Cliente</h2>
      {Object.keys(datos).map(cliente => (
        <div key={cliente} style={{ marginBottom: 10, border: '1px solid #ccc', padding: 10, borderRadius: 8 }}>
          <div
            onClick={() => toggleCliente(cliente)}
            style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: 16 }}
          >
            {cliente}
          </div>
          {expandedCliente[cliente] && (
            <ul style={{ marginTop: 10 }}>
              {datos[cliente].map((m, idx) => {
                const clave = `${cliente}_${idx}`;
                return (
                  <li key={idx} style={{ cursor: 'pointer', marginBottom: 5 }}>
                    <div onClick={() => toggleDetallesMaquina(cliente, idx)}>
                      {m.marca} {m.modelo} — {m.ubicacion}
                    </div>
                    {detallesMaquina[clave] && (
                      <div style={{ marginLeft: 20, fontSize: 14 }}>
                        <p><b>ID Máquina:</b> {m.id_maquina || 'N/A'}</p>
                        <p><b>Marca:</b> {m.marca}</p>
                        <p><b>Modelo:</b> {m.modelo}</p>
                        <p><b>Ubicación:</b> {m.ubicacion}</p>
                        {m.fecha_inicio && <p><b>Inicio de alquiler:</b> {m.fecha_inicio}</p>}
                        {m.fecha_fin && <p><b>Fin de alquiler:</b> {m.fecha_fin}</p>}
                        {m.coste_total_alquiler && <p><b>Coste total:</b> ${m.coste_total_alquiler}</p>}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default MaquinasPorCliente;*/
/*import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MaquinasPorCliente = () => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const fetchDatos = async () => {
      const res = await axios.get('http://localhost:5000/reportes/maquinas-por-cliente');
      setDatos(res.data);
    };
    fetchDatos();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Máquinas por Cliente y Ubicación</h2>
      <ul>
        {datos.map((item, idx) => (
          <li key={idx} style={{ marginBottom: 10 }}>
            <b>Cliente:</b> {item.nombre_cliente || 'Desconocido'}<br />
            <b>Ubicación:</b> {item.ubicacion || 'No especificada'}<br />
            <b>Máquina:</b> {item.marca} {item.modelo}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MaquinasPorCliente;*/