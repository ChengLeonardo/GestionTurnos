import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { usuario } = useAuth();

  if (!usuario) return <p>Por favor inicia sesión.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <p>Bienvenido, {usuario.rol} </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginTop: "30px"
        }}
      >
        {/* Rol usuario */}
        {usuario.rol === "usuario" && (
          <div style={cardStyle}>
            <h2>Turnos</h2>
            <p>Podés sacar tus turnos</p>
            <Link to="/turnos">Ir a Turnos</Link>
          </div>
        )}

        {/* Rol asistente */}
        {usuario.rol === "asistente" && (
          <>
            <div style={cardStyle}>
              <h2>Pacientes</h2>
              <p>Registrar nuevos pacientes</p>
              <Link to="/pacientes">Ir a Pacientes</Link>
            </div>
            <div style={cardStyle}>
              <h2>Turnos</h2>
              <p>Gestionar turnos</p>
              <Link to="/turnos">Ir a Turnos</Link>
            </div>
            <div style={cardStyle}>
              <h2>Reportes</h2>
              <p>Turnos por día o profesional</p>
              <Link to="/reportes">Ir a Reportes</Link>
            </div>
          </>
        )}

        {/* Rol admin */}
        {usuario.rol === "admin" && (
          <>
            <div style={cardStyle}>
              <h2>ABM del sistema</h2>
              <p>Gestionar usuarios, rols y profesionales</p>
              <Link to="/admin">Ir a Configuración</Link>
            </div>
            <div style={cardStyle}>
              <h2>Reportes</h2>
              <p>Ver reportes y auditorías</p>
              <Link to="/reportes">Ir a Reportes</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const cardStyle = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "15px",
  textAlign: "center",
  boxShadow: "2px 2px 8px rgba(0,0,0,0.1)"
};
