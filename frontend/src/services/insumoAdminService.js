import axios from 'axios';

const API_URL = 'http://localhost:5000';

const insumoAdminService = {
  obtenerInsumos: async () => {
    const res = await axios.get(`${API_URL}/insumo/`);
    return res.data;
  },
  crearInsumo: async (data) => {
    const res = await axios.post(`${API_URL}/insumo/`, data);
    return res.data;
  },
  actualizarInsumo: async (id_insumo, data) => {
    const res = await axios.put(`${API_URL}/insumo/${id_insumo}`, data);
    return res.data;
  },
  eliminarInsumo: async (id_insumo) => {
    const res = await axios.delete(`${API_URL}/insumo/${id_insumo}`);
    return res.data;
  }
};

export default insumoAdminService; 