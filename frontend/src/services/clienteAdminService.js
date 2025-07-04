import axios from 'axios';

const API_URL = 'http://localhost:5000';

const clienteAdminService = {
  // Obtener todos los clientes
  obtenerClientes: async () => {
    const res = await axios.get(`${API_URL}/cliente/`);
    return res.data;
  },
  // Crear cliente
  crearCliente: async (data) => {
    const res = await axios.post(`${API_URL}/cliente/`, data);
    return res.data;
  },
  // Actualizar cliente
  actualizarCliente: async (id_cliente, data) => {
    const res = await axios.put(`${API_URL}/cliente/${id_cliente}`, data);
    return res.data;
  },
  // Eliminar cliente
  eliminarCliente: async (id_cliente) => {
    const res = await axios.delete(`${API_URL}/cliente/${id_cliente}`);
    return res.data;
  }
};

export default clienteAdminService; 