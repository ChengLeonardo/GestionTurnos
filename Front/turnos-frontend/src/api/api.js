// api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5177"
});

// ✅ Interceptor: agrega el token automáticamente
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Interceptor: maneja errores globales
api.interceptors.response.use(
  response => response, // si está OK, sigue normal
  error => {
    if (error.response) {
      const status = error.response.status;

      // 🔒 Token inválido o expirado
      if (status === 401) {
        console.warn("⚠️ Sesión expirada o token inválido");
        // acá podés:
        // - limpiar token
        // - redirigir al login
        // - mostrar toast global
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      // 🔐 Sin permisos (no autorizado)
      if (status === 403) {
        console.warn("⛔ No tenés permisos para acceder");
      }
    }

    // opcional: lanzar error para que lo capte tu código
    return Promise.reject(error);
  }
);

export default api;
