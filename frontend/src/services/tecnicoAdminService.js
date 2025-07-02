import axios from 'axios';

const API_URL = 'http://localhost:5000';

const tecnicoAdminService = {
  obtenerTecnicos: async () => {
    const res = await axios.get(`${API_URL}/tecnico/`);
    return res.data;
  },
  crearTecnico: async (data) => {
    const res = await axios.post(`${API_URL}/tecnico/`, data);
    return res.data;
  },
  actualizarTecnico: async (id_tecnico, data) => {
    const res = await axios.put(`${API_URL}/tecnico/${id_tecnico}`, data);
    return res.data;
  },
  eliminarTecnico: async (id_tecnico) => {
    const res = await axios.delete(`${API_URL}/tecnico/${id_tecnico}`);
    return res.data;
  },
  obtenerTecnicosDisponibles: async () => {
    const res = await axios.get(`${API_URL}/tecnico/disponibles`);
    return res.data;
  }
};

export default tecnicoAdminService; 