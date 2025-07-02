import axios from 'axios';

const API_URL = 'http://localhost:5000';

const proveedorAdminService = {
  obtenerProveedores: async () => {
    const res = await axios.get(`${API_URL}/proveedor/`);
    return res.data;
  },
  crearProveedor: async (data) => {
    const res = await axios.post(`${API_URL}/proveedor/`, data);
    return res.data;
  },
  actualizarProveedor: async (id_proveedor, data) => {
    const res = await axios.put(`${API_URL}/proveedor/${id_proveedor}`, data);
    return res.data;
  },
  eliminarProveedor: async (id_proveedor) => {
    const res = await axios.delete(`${API_URL}/proveedor/${id_proveedor}`);
    return res.data;
  }
};

export default proveedorAdminService; 