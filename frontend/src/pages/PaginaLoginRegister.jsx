import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PaginaLoginRegister = () => {
  const [modoRegistro, setModoRegistro] = useState(false);
  const [form, setForm] = useState({
    nombre_usuario: '',
    email: '',
    password: '',
    nombre_empresa: '',
    direccion: '',
    telefono: ''
  });

  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/auth/login', {
        email: form.email,
        password: form.password
      });

      const { usuario } = res.data;

      localStorage.setItem('usuario', JSON.stringify(usuario));
      setUser(usuario);

      if (usuario.id_rol === 1) {
        navigate('/dashboard-cliente');
      } else {
        alert('Este usuario no es del tipo Cliente.');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  const handleRegister = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/auth/register', {
        ...form,
        id_rol: 1
      });
      alert(res.data.mensaje);
      setModoRegistro(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Error al registrar usuario');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>{modoRegistro ? 'Registro Cliente' : 'Iniciar Sesión'}</h2>
      <form onSubmit={modoRegistro ? handleRegister : handleLogin}>
        {modoRegistro && (
          <>
            <input
              type="text"
              name="nombre_usuario"
              placeholder="Nombre de usuario"
              value={form.nombre_usuario}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="nombre_empresa"
              placeholder="Nombre empresa"
              value={form.nombre_empresa}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="direccion"
              placeholder="Dirección"
              value={form.direccion}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="telefono"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={handleChange}
              required
            />
          </>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {modoRegistro ? 'Registrar' : 'Iniciar Sesión'}
        </button>
      </form>
      <button onClick={() => setModoRegistro(!modoRegistro)} style={{ marginTop: 10 }}>
        {modoRegistro ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
      </button>
    </div>
  );
};

export default PaginaLoginRegister;