import axios from 'axios';

const API_URL = 'http://localhost:5000';

const ventaService = {
  // Obtener ventas por período
  obtenerVentasPorPeriodo: async (fechaInicio, fechaFin) => {
    try {
      const response = await axios.get(`${API_URL}/venta/periodo`, {
        params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Obtener consumo de insumos por período
  obtenerConsumoInsumos: async (fechaInicio, fechaFin) => {
    try {
      const response = await axios.get(`${API_URL}/venta/consumo-insumos`, {
        params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Obtener alquileres activos
  obtenerAlquileresActivos: async () => {
    try {
      const response = await axios.get(`${API_URL}/venta/alquileres-activos`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Obtener estadísticas de ventas
  obtenerEstadisticas: async (fechaInicio, fechaFin) => {
    try {
      const response = await axios.get(`${API_URL}/venta/estadisticas`, {
        params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Obtener reporte de costos y rendimiento
  obtenerCostosRendimiento: async (fechaInicio, fechaFin) => {
    try {
      const response = await axios.get(`${API_URL}/venta/costos-rendimiento`, {
        params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Obtener reporte de ganancias
  obtenerGanancias: async (fechaInicio, fechaFin) => {
    try {
      const response = await axios.get(`${API_URL}/venta/ganancias`, {
        params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Obtener cafés disponibles para un alquiler
  obtenerCafesDisponibles: async (idAlquiler) => {
    try {
      const response = await axios.get(`${API_URL}/venta/cafes-disponibles/${idAlquiler}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Registrar una venta
  registrarVenta: async (ventaData) => {
    try {
      const response = await axios.post(`${API_URL}/venta/`, ventaData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Obtener costos de insumos por período
  obtenerCostosInsumos: async (fechaInicio, fechaFin) => {
    try {
      const response = await axios.get(`${API_URL}/venta/costos-insumos`, {
        params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  }
};

export default ventaService; 