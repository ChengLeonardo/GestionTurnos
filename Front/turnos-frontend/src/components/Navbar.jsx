import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth/useAuth";

const navStyle = {
  padding: "10px 20px",
  backgroundColor: "#007BFF", // Azul
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
    <nav className="navbar navbar-expand-lg " style={navStyle}>
      <div className="container-fluid">

        <Link className="navbar-brand" style={linkStyle} to="/dashboard">
          Dashboard
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse text-center" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" role="button" aria-expanded="false" style={linkStyle}>Turnos</a>
                <ul className="dropdown-menu bg-dark">
                  <li><Link className="dropdown-item" style={linkStyle} to="/turnos">Turnos</Link></li>
                  <li><Link className="dropdown-item" style={linkStyle} to="/ordenes">Órdenes</Link></li>
                </ul>
              </li>

            {(usuario?.rol === "asistente" || usuario?.rol === "admin") && (
              <li className="nav-item">
                <Link className="nav-link" style={linkStyle} to="/pacientes">Pacientes</Link>
              </li>
            )}

            <li className="nav-item">
              <Link className="nav-link" style={linkStyle} to="/especialidades">Especialidades</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" style={linkStyle} to="/sedes">Sedes</Link>
            </li>

            {usuario?.rol === "admin" && (
              <>
                <li className="nav-item"><Link className="nav-link" style={linkStyle} to="/profesionales">Profesionales</Link></li>
                <li className="nav-item"><Link className="nav-link" style={linkStyle} to="/agendaMedicas">Agenda Médica</Link></li>
                <li className="nav-item dropdown"><a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" role="button" aria-expanded="false" href="#" style={linkStyle}>Usuarios</a>
                <ul className="dropdown-menu bg-dark">
                  <li><Link className="dropdown-item" style={linkStyle} to="/usuarios">Usuarios</Link></li>
                  <li><Link className="dropdown-item" style={linkStyle} to="/roles">Roles</Link></li>
                </ul>
                </li>
                <li className="nav-item"><Link className="nav-link" style={linkStyle} to="/auditoria">Auditoría</Link></li>
              </>
            )}

            {(usuario?.rol === "asistente" || usuario?.rol === "admin") && (
              <li className="nav-item">
                <Link className="nav-link" style={linkStyle} to="/reportes">Reportes</Link>
              </li>
            )}

            {/* LOGIN / LOGOUT */}
            <li className="nav-item">
              {usuario ? (
                <button style={btnStyle} onClick={handleLogout}>Logout</button>
              ) : (
                <Link className="nav-link" style={linkStyle} to="/login">Login</Link>
              )}
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}
