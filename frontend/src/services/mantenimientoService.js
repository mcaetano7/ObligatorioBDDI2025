import axios from 'axios';

const API_URL = 'http://localhost:5000';

const mantenimientoService = {
  // Obtener todas las solicitudes de mantenimiento
  obtenerSolicitudes: async () => {
    try {
      const response = await axios.get(`${API_URL}/mantenimiento/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Obtener solicitudes pendientes
  obtenerSolicitudesPendientes: async () => {
    try {
      const response = await axios.get(`${API_URL}/mantenimiento/pendientes`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Obtener solicitud por ID
  obtenerSolicitud: async (idSolicitud) => {
    try {
      const response = await axios.get(`${API_URL}/mantenimiento/${idSolicitud}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Crear nueva solicitud de mantenimiento
  crearSolicitud: async (solicitudData) => {
    try {
      const response = await axios.post(`${API_URL}/mantenimiento/`, solicitudData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Actualizar solicitud de mantenimiento
  actualizarSolicitud: async (idSolicitud, solicitudData) => {
    try {
      const response = await axios.put(`${API_URL}/mantenimiento/${idSolicitud}`, solicitudData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Marcar solicitud como completada
  completarSolicitud: async (idSolicitud) => {
    try {
      const response = await axios.put(`${API_URL}/mantenimiento/${idSolicitud}/completar`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Eliminar solicitud de mantenimiento
  eliminarSolicitud: async (idSolicitud) => {
    try {
      const response = await axios.delete(`${API_URL}/mantenimiento/${idSolicitud}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Obtener solicitudes por técnico
  obtenerSolicitudesPorTecnico: async (idTecnico) => {
    try {
      const response = await axios.get(`${API_URL}/mantenimiento/tecnico/${idTecnico}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  }
};

export default mantenimientoService; 