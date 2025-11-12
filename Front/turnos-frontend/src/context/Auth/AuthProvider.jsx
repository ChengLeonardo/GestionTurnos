import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { login } from "../../api/authService.js";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {

  const mapTokenToUsuario = (token) => {
    const decoded = jwtDecode(token);
    return {
      nombre: decoded.name,
      id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
      rol: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]?.toLowerCase()
    };
  };

  const [usuario, setUsuario] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      return mapTokenToUsuario(token);  // ✅ ahora sí normalizado
    } catch {
      return null;
    }
  });

  const logout = () => {
    localStorage.removeItem("token");
    setUsuario(null);
  };

  const signIn = async (email, password) => {
    try {
      const res = await login({ Email: email, Password: password });
      const { token } = res;

      localStorage.setItem("token", token);   // 👈 importante!

      const usuarioNormalizado = mapTokenToUsuario(token);
      setUsuario(usuarioNormalizado);
      return true;
    } catch (err) {
      console.error("Error en login:", err);
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const usuarioNormalizado = mapTokenToUsuario(token);
      setUsuario(usuarioNormalizado);
    } catch {
      logout();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
