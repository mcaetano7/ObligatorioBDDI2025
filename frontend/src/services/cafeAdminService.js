import axios from 'axios';

const API_URL = 'http://localhost:5000';

const cafeAdminService = {
  obtenerCafes: async () => {
    const res = await axios.get(`${API_URL}/cafe/`);
    return res.data;
  },
  crearCafe: async (data) => {
    const res = await axios.post(`${API_URL}/cafe/`, data);
    return res.data;
  },
  actualizarCafe: async (id_cafe, data) => {
    const res = await axios.put(`${API_URL}/cafe/${id_cafe}`, data);
    return res.data;
  },
  eliminarCafe: async (id_cafe) => {
    const res = await axios.delete(`${API_URL}/cafe/${id_cafe}`);
    return res.data;
  },
  obtenerCafesPorMaquina: async (id_maquina) => {
    const res = await axios.get(`${API_URL}/cafe/maquina/${id_maquina}`);
    return res.data;
  },
  asociarCafeAMaquina: async (id_maquina, id_cafe) => {
    const res = await axios.post(`${API_URL}/cafe/maquina/${id_maquina}/cafe/${id_cafe}`);
    return res.data;
  },
  desasociarCafeDeMaquina: async (id_maquina, id_cafe) => {
    const res = await axios.delete(`${API_URL}/cafe/maquina/${id_maquina}/cafe/${id_cafe}`);
    return res.data;
  }
};

export default cafeAdminService; 