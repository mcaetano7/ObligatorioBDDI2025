import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState('1'); // 1: Cliente, 2: Administrador
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/auth/login', { email, password });
      login(res.data.usuario);
      if (res.data.usuario.id_rol === 2) {
        navigate('/dashboard-admin');
      } else {
        navigate('/dashboard-cliente');
      }
    } catch {
      setError('Credenciales incorrectas, registrese si no tiene usuario');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        nombre_usuario: nombre,
        email,
        password,
        id_rol: rol
      };
      if (rol === '1') {
        payload.nombre_empresa = nombreEmpresa;
        payload.direccion = direccion;
        payload.telefono = telefono;
      }
      await axios.post('http://localhost:5000/auth/register', payload);
      // Tras registro exitoso, loguear automáticamente
      const res = await axios.post('http://localhost:5000/auth/login', { email, password });
      login(res.data.usuario);
      if (res.data.usuario.id_rol === 2) {
        navigate('/dashboard-admin');
      } else {
        navigate('/dashboard-cliente');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <button onClick={() => setIsLogin(true)} style={{ fontWeight: isLogin ? 'bold' : 'normal' }}>Iniciar sesión</button>
        <button onClick={() => setIsLogin(false)} style={{ fontWeight: !isLogin ? 'bold' : 'normal', marginLeft: 10 }}>Registrarse</button>
      </div>
      {isLogin ? (
        <form onSubmit={handleLogin}>
          <h2>Iniciar sesión</h2>
          <div>
            <label>Email:</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label>Contraseña:</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">Entrar</button>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <h2>Registrarse</h2>
          <div>
            <label>Nombre de usuario:</label>
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label>Contraseña:</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {rol === '1' && (
            <>
              <div>
                <label>Nombre de empresa:</label>
                <input type="text" value={nombreEmpresa} onChange={e => setNombreEmpresa(e.target.value)} required={rol === '1'} />
              </div>
              <div>
                <label>Dirección:</label>
                <input type="text" value={direccion} onChange={e => setDireccion(e.target.value)} required={rol === '1'} />
              </div>
              <div>
                <label>Teléfono:</label>
                <input type="text" value={telefono} onChange={e => setTelefono(e.target.value)} required={rol === '1'} />
              </div>
            </>
          )}
          <div>
            <label>Tipo de usuario:</label>
            <select value={rol} onChange={e => setRol(e.target.value)}>
              <option value="1">Cliente</option>
              <option value="2">Administrador</option>
            </select>
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">Registrarse</button>
        </form>
      )}
    </div>
  );
};

export default Login; 