// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Maquinas from './pages/Maquinas';
import Register from './pages/Register';
import LoginRegisterForm from './pages/LoginPage/LogInPage';

// Simulación de autenticación (reemplazar por lógica real)
const isAuthenticated = () => !!localStorage.getItem('token');

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
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
      </Routes>
    </div>
  );
}

export default App;

