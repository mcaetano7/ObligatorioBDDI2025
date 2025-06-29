import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function LoginRegisterForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nombre_usuario: "",
    email: "",
    password: "",
    id_rol: 1,
    nombre_empresa: "",
    direccion: "",
    telefono: ""
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      nombre_usuario: "",
      email: "",
      password: "",
      id_rol: 1,
      nombre_empresa: "",
      direccion: "",
      telefono: ""
    });
    setMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        setMessage("Inicio de sesión exitoso.");
        navigate('/dashboard');
      } else {
        setMessage(data.error || "Error al iniciar sesión.");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setMessage("Error de red al intentar iniciar sesión.");
    }
  };

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Registro exitoso. Ahora puedes iniciar sesión.");
        setIsLogin(true);
      } else {
        setMessage(data.error || "Error al registrar usuario.");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setMessage("Error de red al intentar registrar.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isLogin ? "Iniciar Sesión" : "Registro de Usuario"}
      </h2>

      {message && (
        <div className="mb-4 text-center text-sm text-red-600">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Correo</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {!isLogin && (
          <>
            <div>
              <label className="block text-sm font-medium">Nombre de Usuario</label>
              <input
                type="text"
                name="nombre_usuario"
                value={formData.nombre_usuario}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>
            {formData.id_rol === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium">Nombre Empresa</label>
                  <input
                    type="text"
                    name="nombre_empresa"
                    value={formData.nombre_empresa}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Dirección</label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                  />
                </div>
              </>
            )}
          </>
        )}

        <div>
          <label className="block text-sm font-medium">Contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          {isLogin ? "Iniciar Sesión" : "Registrarse"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={toggleMode}
          className="text-sm text-blue-500 hover:underline"
        >
          {isLogin
            ? "¿No tienes una cuenta? Regístrate"
            : "¿Ya tienes cuenta? Inicia sesión"}
        </button>
      </div>
    </div>
  );
}
