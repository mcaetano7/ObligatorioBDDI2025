import axios from 'axios';

const API_URL = 'http://localhost:5000';

const clienteService = {
  // Obtener ID del cliente por ID de usuario
  obtenerIdCliente: async (idUsuario) => {
    try {
      const response = await axios.get(`${API_URL}/cliente/id-cliente/${idUsuario}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Obtener alquileres del cliente
  obtenerAlquileres: async (idCliente) => {
    try {
      const response = await axios.get(`${API_URL}/cliente/alquileres-cliente/${idCliente}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Obtener detalle de un alquiler específico
  obtenerDetalleAlquiler: async (idAlquiler) => {
    try {
      const response = await axios.get(`${API_URL}/cliente/alquiler-detalle/${idAlquiler}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Obtener máquinas disponibles para alquilar
  obtenerMaquinasDisponibles: async () => {
    try {
      const response = await axios.get(`${API_URL}/cliente/maquinas/disponibles`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Crear nuevo alquiler
  crearAlquiler: async (alquilerData) => {
    try {
      const response = await axios.post(`${API_URL}/cliente/alquileres`, alquilerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Obtener ganancias por máquina
  obtenerGananciasPorMaquina: async (idCliente) => {
    try {
      const response = await axios.get(`${API_URL}/cliente/ganancias-maquina/${idCliente}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Obtener ganancias totales del cliente
  obtenerGananciasTotales: async (idCliente) => {
    try {
      const response = await axios.get(`${API_URL}/cliente/ganancias-totales/${idCliente}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Solicitar mantenimiento
  solicitarMantenimiento: async (solicitudData) => {
    try {
      const response = await axios.post(`${API_URL}/cliente/solicitudes`, solicitudData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  }
};

export default clienteService; 