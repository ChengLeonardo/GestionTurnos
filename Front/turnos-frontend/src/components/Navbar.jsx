import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth/useAuth";


const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 20px",
  backgroundColor: "#1E90FF",
  color: "white",
  boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "bold"
};

const btnStyle = {
  backgroundColor: "#FF4C4C",
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "5px",
  cursor: "pointer"
};

export default function Navbar() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={navStyle}>
      <div style={{ display: "flex", gap: "15px" }}>
        <Link style={linkStyle} to="/dashboard">Dashboard</Link>

        {/* Pacientes - Asistente y Admin */}
        {(usuario?.rol === "asistente" || usuario?.rol === "admin") && (
          <Link style={linkStyle} to="/pacientes">Pacientes</Link>
        )}

        {/* Turnos - Asistente y Admin */}
        {(usuario?.rol === "asistente" || usuario?.rol === "admin") && (
          <Link style={linkStyle} to="/turnos">Turnos</Link>
        )}

        {/* Ordenes - Visible para todos (pacientes suben, admin/asistente gestionan) */}
        <Link style={linkStyle} to="/ordenes">Órdenes</Link>

        {/* Reportes - Asistente y Admin */}
        {(usuario?.rol === "asistente" || usuario?.rol === "admin") && (
          <Link style={linkStyle} to="/reportes">Reportes</Link>
        )}
        {/* Especialidades - Visible para todos */}
        <Link style={linkStyle} to="/especialidades">Especialidades</Link>
        {/* Sedes - Visible para todos */}
        <Link style={linkStyle} to="/sedes">Sedes</Link>

        {usuario?.rol === "admin" && (
          <>
            <Link style={linkStyle} to="/profesionales">Profesionales</Link>
            <Link style={linkStyle} to="/usuarios">Usuarios</Link>
            <Link style={linkStyle} to="/roles">Roles</Link>
            <Link style={linkStyle} to="/auditoria">Auditoría</Link>
            <Link style={linkStyle} to="/agendaMedicas">Agenda Médica</Link>
          </>
        )}
      </div>
      {usuario ? (
        <button style={btnStyle} onClick={handleLogout}>Logout</button>
      ) : (
        <Link style={linkStyle} to="/login">Login</Link>
      )}
    </nav>
  );
}
