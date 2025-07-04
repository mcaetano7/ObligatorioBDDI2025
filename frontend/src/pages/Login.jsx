import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = await authService.login(formData.email, formData.password);
      login(userData);
      navigate('/dashboard');
    } catch (error) {
      if (error.error === 'Credenciales inválidas') {
        setError('Credenciales incorrectas, pruebe registrando un usuario');
      } else {
        setError(error.error || 'Error al iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShowRegister = () => {
    setShowRegister(true);
  };

  const handleBackToLogin = () => {
    setShowRegister(false);
    setError('');
  };

  if (showRegister) {
    return <Register onBack={handleBackToLogin} />;
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Cafés Marloy</h1>
          <p>Iniciar Sesión</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Ingrese su email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Ingrese su contraseña"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="button-group">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
            
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleShowRegister}
            >
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente de registro
const Register = ({ onBack }) => {
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Campos específicos para cliente
    nombre_empresa: '',
    direccion: '',
    telefono: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        nombre_usuario: formData.nombre_usuario,
        email: formData.email,
        password: formData.password
      };

      if (tipoUsuario === 'cliente') {
        userData.nombre_empresa = formData.nombre_empresa;
        userData.direccion = formData.direccion;
        userData.telefono = formData.telefono;
        
        await authService.registrarCliente(userData);
      } else if (tipoUsuario === 'admin') {
        await authService.registrarAdmin(userData);
      }

      setSuccess(tipoUsuario === 'cliente' ? 'Cliente registrado correctamente' : 'Administrador registrado correctamente');
      
      // Limpiar formulario
      setFormData({
        nombre_usuario: '',
        email: '',
        password: '',
        confirmPassword: '',
        nombre_empresa: '',
        direccion: '',
        telefono: ''
      });
      
      // Volver al login después de 2 segundos
      setTimeout(() => {
        onBack();
      }, 2000);

    } catch (error) {
      setError(error.error || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Registro</h1>
          <p>Crear nueva cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Tipo de Usuario:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="tipoUsuario"
                  value="cliente"
                  checked={tipoUsuario === 'cliente'}
                  onChange={(e) => setTipoUsuario(e.target.value)}
                />
                Cliente
              </label>
              <label>
                <input
                  type="radio"
                  name="tipoUsuario"
                  value="admin"
                  checked={tipoUsuario === 'admin'}
                  onChange={(e) => setTipoUsuario(e.target.value)}
                />
                Administrador
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="nombre_usuario">Nombre de Usuario:</label>
            <input
              type="text"
              id="nombre_usuario"
              name="nombre_usuario"
              value={formData.nombre_usuario}
              onChange={handleInputChange}
              required
              placeholder="Ingrese nombre de usuario"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Ingrese su email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Ingrese su contraseña"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              placeholder="Confirme su contraseña"
            />
          </div>

          {tipoUsuario === 'cliente' && (
            <>
              <div className="form-group">
                <label htmlFor="nombre_empresa">Nombre de la Empresa:</label>
                <input
                  type="text"
                  id="nombre_empresa"
                  name="nombre_empresa"
                  value={formData.nombre_empresa}
                  onChange={handleInputChange}
                  required
                  placeholder="Ingrese nombre de la empresa"
                />
              </div>

              <div className="form-group">
                <label htmlFor="direccion">Dirección:</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  required
                  placeholder="Ingrese dirección"
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefono">Teléfono:</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  required
                  placeholder="Ingrese teléfono"
                />
              </div>
            </>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          <div className="button-group">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || !tipoUsuario}
            >
              {loading ? 'Registrando...' : 'Registrar'}
            </button>
            
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onBack}
            >
              Volver al Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 