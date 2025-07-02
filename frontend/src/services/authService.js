import axios from 'axios';

const API_URL = 'http://localhost:5000';

const authService = {
  // Login de usuario
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Registrar cliente
  registrarCliente: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/registro/cliente`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Registrar administrador
  registrarAdmin: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/registro/admin`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Obtener roles disponibles
  obtenerRoles: async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/roles`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  }
};

export default authService; 