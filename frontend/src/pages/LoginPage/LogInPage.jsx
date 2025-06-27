import React, { useState } from "react";

export default function LoginRegisterForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nombre_usuario: "",
    correo: "",
    password: "",
  });

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ nombre_usuario: "", correo: "", password: "" });
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
    // Reemplaza esta parte con tu llamada real al backend
    console.log("Login:", formData);
  };

  const handleRegister = async () => {
    // Reemplaza esta parte con tu llamada real al backend
    console.log("Register:", formData);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isLogin ? "Iniciar Sesión" : "Registro de Usuario"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium">Correo</label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          </div>
        )}

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
