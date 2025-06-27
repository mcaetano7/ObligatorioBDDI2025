import React, { useState } from "react";

export default function LoginRegisterForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nombre_usuario: "",
    correo: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ nombre_usuario: "", correo: "", password: "" });
    setMessage("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        setMessage("Inicio de sesión exitoso.");
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
        body: JSON.stringify({
          nombre_usuario: formData.nombre_usuario,
          email: formData.email,
          password: formData.password,
          id_rol: 1, // Asume que 1 es el rol de cliente. Ajusta según tu BD.
        }),
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