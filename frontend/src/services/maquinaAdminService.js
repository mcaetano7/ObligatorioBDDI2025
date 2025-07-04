import axios from 'axios';

const API_URL = 'http://localhost:5000';

const maquinaAdminService = {
  obtenerMaquinas: async () => {
    const res = await axios.get(`${API_URL}/maquina/`);
    return res.data;
  },
  crearMaquina: async (data) => {
    const res = await axios.post(`${API_URL}/maquina/`, data);
    return res.data;
  },
  actualizarMaquina: async (id_maquina, data) => {
    const res = await axios.put(`${API_URL}/maquina/${id_maquina}`, data);
    return res.data;
  },
  eliminarMaquina: async (id_maquina) => {
    const res = await axios.delete(`${API_URL}/maquina/${id_maquina}`);
    return res.data;
  },
  obtenerMaquinasConCafes: async () => {
    const res = await axios.get(`${API_URL}/maquina/con-cafes-detalle`);
    return res.data;
  },
  actualizarCafesMaquina: async (id_maquina, cafes) => {
    const res = await axios.put(`${API_URL}/maquina/${id_maquina}/cafes`, { cafes });
    return res.data;
  }
};

export default maquinaAdminService; 