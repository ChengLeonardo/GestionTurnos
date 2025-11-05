import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { login } from "../api/authService.js";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  });

  const sigin = async (email, password) => {
    try {
      const res = await login({ Email: email, Password: password });
      const { token } = res.data;
      setUsuario(jwtDecode(token));
      return true;
    } catch (err) {
      console.error("Error en login:", err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUsuario(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        setUsuario(jwtDecode(token));
      } catch {
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, sigin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
