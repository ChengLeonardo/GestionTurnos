import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
  const stored = localStorage.getItem("usuario");
  return stored ? JSON.parse(stored) : null;
});


  // Datos mock (simulan lo que vendría del backend)
  const usuariosMock = [
    { id: 1, email: "admin@demo.com", password: "1234", rol: "admin" },
    { id: 2, email: "asistente@demo.com", password: "1234", rol: "asistente" },
    { id: 3, email: "usuario@demo.com", password: "1234", rol: "usuario" }
  ];

  const login = (email, password) => {
    const user = usuariosMock.find(
      u => u.email === email && u.password === password
    );
    if (user) {
      setUsuario(user);
      localStorage.setItem("usuario", JSON.stringify(user)); // guarda sesión
      return true;
    }
    return false;
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
  };

  useEffect(() => {
    const stored = localStorage.getItem("usuario");
    if (stored) setUsuario(JSON.parse(stored));
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
