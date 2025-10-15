import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Turnos from "./pages/Turnos";
import Pacientes from "./pages/Pacientes";
import Profesionales from "./pages/Profesionales";
import Reportes from "./pages/Reportes";
import { AuthContext, useAuth } from "./context/AuthContext";
import AsistenteVirtual from "./components/AsistenteVirtual";


// 🔒 Componente de ruta privada
function PrivateRoute({ children }) {
  const { usuario } = useAuth();
  return usuario ? children : <Navigate to="/login" replace />;
}


function PublicRoute({ children }) {
  const { usuario } = useAuth();
  // Si hay usuario logueado, redirige a dashboard
  return usuario ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  const location = useLocation();
  return (
    <>
      {location.pathname !== "/login" && <Navbar />}

      <Routes>
        {/* Ruta pública */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />


        {/* Ruta protegida con PrivateRoute */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/turnos"
          element={
            <PrivateRoute>
              <Turnos />
            </PrivateRoute>
          }
        />
        <Route
          path="/pacientes"
          element={
            <PrivateRoute>
              <Pacientes />
            </PrivateRoute>
          }
        />
        <Route
          path="/profesionales"
          element={
            <PrivateRoute>
              <Profesionales />
            </PrivateRoute>
          }
        />
        <Route
          path="/reportes"
          element={
            <PrivateRoute>
              <Reportes />
            </PrivateRoute>
          }
        />

        {/* Redirección por defecto */}
        <Route path="*" element={
          <PrivateRoute>
            <Navigate to="/dashboard" replace />
          </PrivateRoute>
        } />
      </Routes>
      {location.pathname !== "/login" && <AsistenteVirtual />}

    </>
  );
}
