import axios from 'axios';

const API_URL = 'http://localhost:5000';

const mantenimientoAdminService = {
  obtenerMantenimientos: async () => {
    const res = await axios.get(`${API_URL}/mantenimiento/`);
    return res.data;
  },
  crearMantenimiento: async (data) => {
    const res = await axios.post(`${API_URL}/mantenimiento/`, data);
    return res.data;
  },
  actualizarMantenimiento: async (id_solicitud, data) => {
    const res = await axios.put(`${API_URL}/mantenimiento/${id_solicitud}`, data);
    return res.data;
  },
  eliminarMantenimiento: async (id_solicitud) => {
    const res = await axios.delete(`${API_URL}/mantenimiento/${id_solicitud}`);
    return res.data;
  },
  completarMantenimiento: async (id_solicitud) => {
    const res = await axios.put(`${API_URL}/mantenimiento/${id_solicitud}/completar`);
    return res.data;
  }
};

export default mantenimientoAdminService; 