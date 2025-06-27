// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Maquinas from './pages/Maquinas';
import Register from './pages/Register';
import LoginRegisterForm from './pages/LoginPage/LogInPage';
import Proveedores from './pages/Proveedores';
import Insumos from './pages/Insumos';
import Tecnicos from './pages/Tecnicos';
import Mantenimientos from './pages/Mantenimientos';
import RegistroConsumo from './pages/RegistroConsumo';
import Reportes from './pages/Reportes';

// Simulación de autenticación (reemplazar por lógica real)
const isAuthenticated = () => !!localStorage.getItem('token');
const isAdmin = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  return usuario && usuario.es_administrador;
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};
const AdminRoute = ({ children }) => {
  return isAuthenticated() && isAdmin() ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Panel Cafés Marloy</h1>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<LoginRegisterForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/clientes" element={<PrivateRoute><Clientes /></PrivateRoute>} />
        <Route path="/maquinas" element={<PrivateRoute><Maquinas /></PrivateRoute>} />
        <Route path="/insumos" element={<PrivateRoute><Insumos /></PrivateRoute>} />
        <Route path="/mantenimientos" element={<PrivateRoute><Mantenimientos /></PrivateRoute>} />
        <Route path="/registro-consumo" element={<PrivateRoute><RegistroConsumo /></PrivateRoute>} />
        <Route path="/reportes" element={<PrivateRoute><Reportes /></PrivateRoute>} />
        <Route path="/proveedores" element={<AdminRoute><Proveedores /></AdminRoute>} />
        <Route path="/tecnicos" element={<AdminRoute><Tecnicos /></AdminRoute>} />
      </Routes>
    </div>
  );
}

export default App;

