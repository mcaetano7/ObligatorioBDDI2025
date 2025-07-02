// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MisAlquileres from './pages/MisAlquileres';
import MisVentas from './pages/MisVentas';
import SolicitarMantenimiento from './pages/SolicitarMantenimiento';
import ProtectedRoute from './components/ProtectedRoute';
import GestionClientes from './pages/GestionClientes';
import GestionMaquinas from './pages/GestionMaquinas';
import GestionCafes from './pages/GestionCafes';
import GestionInsumos from './pages/GestionInsumos';
import GestionProveedores from './pages/GestionProveedores';
import GestionTecnicos from './pages/GestionTecnicos';
import GestionMantenimientos from './pages/GestionMantenimientos';
import GestionVentas from './pages/GestionVentas';
import GestionGanancias from './pages/GestionGanancias';
import GestionCostosInsumos from './pages/GestionCostosInsumos';

const App = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/mis-alquileres" 
        element={
          <ProtectedRoute>
            <MisAlquileres />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/mis-ventas" 
        element={
          <ProtectedRoute>
            <MisVentas />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/solicitar-mantenimiento" 
        element={
          <ProtectedRoute>
            <SolicitarMantenimiento />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/gestion-clientes" 
        element={
          <ProtectedRoute>
            <GestionClientes />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/gestion-maquinas" 
        element={
          <ProtectedRoute>
            <GestionMaquinas />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/gestion-cafes" 
        element={
          <ProtectedRoute>
            <GestionCafes />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/gestion-insumos" 
        element={
          <ProtectedRoute>
            <GestionInsumos />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/gestion-proveedores" 
        element={
          <ProtectedRoute>
            <GestionProveedores />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/gestion-tecnicos" 
        element={
          <ProtectedRoute>
            <GestionTecnicos />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/gestion-mantenimientos" 
        element={
          <ProtectedRoute>
            <GestionMantenimientos />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/gestion-ventas" 
        element={
          <ProtectedRoute>
            <GestionVentas />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/gestion-ganancias" 
        element={
          <ProtectedRoute>
            <GestionGanancias />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/gestion-costos-insumos" 
        element={
          <ProtectedRoute>
            <GestionCostosInsumos />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;

/* */
