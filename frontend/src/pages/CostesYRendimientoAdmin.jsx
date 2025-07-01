import React, { useEffect, useState } from 'react';

const CostesYRendimientoAdmin = () => {
  const [datos, setDatos] = useState([]);
  const [resumen, setResumen] = useState({
    totalCoste: 0,
    totalGanancia: 0,
    totalRendimiento: 0
  });

  const [mes, setMes] = useState('');
  const [anio, setAnio] = useState('');

  const fetchData = async () => {
    try {
      let url = 'http://localhost:5000/reportes/rendimiento-maquinas';
      const params = [];

      if (mes) params.push(`mes=${mes}`);
      if (anio) params.push(`anio=${anio}`);
      if (params.length > 0) url += `?${params.join('&')}`;

      const response = await fetch(url);
      const resultados = await response.json();

      const totalGanancia = resultados.reduce((acc, item) => acc + (parseFloat(item.ganancia_total) || 0), 0);
      const totalCoste = resultados.reduce((acc, item) => acc + (parseFloat(item.costo_insumos) || 0), 0);
      const totalRendimiento = totalGanancia - totalCoste;

      setDatos(resultados);
      setResumen({
        totalGanancia,
        totalCoste,
        totalRendimiento
      });
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Rendimiento por Máquina</h2>

      <div className="mb-4 flex gap-4 items-end">
        <div>
          <label className="block mb-1">Mes:</label>
          <select className="border px-2 py-1" value={mes} onChange={(e) => setMes(e.target.value)}>
            <option value="">Todos</option>
            {[...Array(12)].map((_, idx) => (
              <option key={idx + 1} value={idx + 1}>{idx + 1}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Año:</label>
          <input
            className="border px-2 py-1"
            type="number"
            value={anio}
            onChange={(e) => setAnio(e.target.value)}
            placeholder="2025"
          />
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={fetchData}
        >
          Aplicar Filtros
        </button>
      </div>

      <table className="w-full table-auto border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-200 text-center">
            <th className="border px-4 py-2">Modelo</th>
            <th className="border px-4 py-2">Marca</th>
            <th className="border px-4 py-2">Ganancia Empresa</th>
            <th className="border px-4 py-2">Coste en Insumos</th>
            <th className="border px-4 py-2">Rendimiento</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((item, idx) => (
            <tr key={idx} className="text-center">
              <td className="border px-4 py-2">{item.modelo}</td>
              <td className="border px-4 py-2">{item.marca}</td>
              <td className="border px-4 py-2">
                ${Number(item.ganancia_total || 0).toFixed(2)}
              </td>
              <td className="border px-4 py-2">
                ${Number(item.costo_insumos || 0).toFixed(2)}
              </td>
              <td className="border px-4 py-2">
                ${Number(item.rendimiento || 0).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right font-bold text-lg">
        Total Ganancia: ${Number(resumen.totalGanancia || 0).toFixed(2)} <br />
        Total Coste: ${Number(resumen.totalCoste || 0).toFixed(2)} <br />
        Rendimiento Neto: ${Number(resumen.totalRendimiento || 0).toFixed(2)}
      </div>
    </div>
  );
};

export default CostesYRendimientoAdmin;

/*
import React, { useEffect, useState } from 'react';

const CostesYRendimientoAdmin = () => {
  const [datos, setDatos] = useState([]);
  const [resumen, setResumen] = useState({ totalCoste: 0, totalGanancia: 0, totalRendimiento: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/reportes/maquinas-por-cliente');
        const alquileres = await response.json();

        const agrupadoPorMaquina = {};

        for (const alquiler of alquileres) {
          const clave = `${alquiler.modelo} - ${alquiler.marca}`;

          const consumoRes = await fetch(`http://localhost:5000/insumos/consumo/${alquiler.id_alquiler}`);
          const consumos = await consumoRes.json();

          const costeInsumos = consumos.reduce((acc, item) => {
            return acc + parseFloat(item.costo_unitario) * parseFloat(item.cantidad_consumida);
          }, 0);

          if (!agrupadoPorMaquina[clave]) {
            agrupadoPorMaquina[clave] = {
              modelo: alquiler.modelo,
              marca: alquiler.marca,
              ganancia: 0,
              coste: 0
            };
          }

          agrupadoPorMaquina[clave].ganancia += parseFloat(alquiler.ganancia_empresa || 0);
          agrupadoPorMaquina[clave].coste += costeInsumos;
        }

        const resultados = Object.values(agrupadoPorMaquina).map((item) => ({
          ...item,
          rendimiento: item.ganancia - item.coste
        }));

        const totalGanancia = resultados.reduce((acc, item) => acc + item.ganancia, 0);
        const totalCoste = resultados.reduce((acc, item) => acc + item.coste, 0);
        const totalRendimiento = totalGanancia - totalCoste;

        setDatos(resultados);
        setResumen({ totalGanancia, totalCoste, totalRendimiento });
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Rendimiento por Máquina</h2>
      <table className="w-full table-auto border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-200 text-center">
            <th className="border px-4 py-2">Modelo</th>
            <th className="border px-4 py-2">Marca</th>
            <th className="border px-4 py-2">Ganancia Empresa</th>
            <th className="border px-4 py-2">Coste en Insumos</th>
            <th className="border px-4 py-2">Rendimiento</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((item, idx) => (
            <tr key={idx} className="text-center">
              <td className="border px-4 py-2">{item.modelo}</td>
              <td className="border px-4 py-2">{item.marca}</td>
              <td className="border px-4 py-2">${item.ganancia.toFixed(2)}</td>
              <td className="border px-4 py-2">${item.coste.toFixed(2)}</td>
              <td className="border px-4 py-2">${item.rendimiento.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-right font-bold text-lg">
        Total Ganancia: ${resumen.totalGanancia.toFixed(2)} <br />
        Total Coste: ${resumen.totalCoste.toFixed(2)} <br />
        Rendimiento Neto: ${resumen.totalRendimiento.toFixed(2)}
      </div>
    </div>
  );
};

export default CostesYRendimientoAdmin;
*/