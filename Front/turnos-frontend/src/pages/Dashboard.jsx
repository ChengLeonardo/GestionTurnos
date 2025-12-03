import { Link } from "react-router-dom";
import { useAuth } from "../context/Auth/useAuth";

export default function Dashboard() {
  const { usuario } = useAuth();
  console.log("Usuario:", usuario);

  if (!usuario) return <p>Por favor inicia sesión.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <p>Bienvenido, {usuario.rol}</p>

      <div className="container-fluid d-flex "
        style={{
          gap: "20px",
          marginTop: "30px",
        }}
      >
<div className="row w-100 row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {/* Rol usuario */}
        {usuario.rol === "usuario" && (
          <div style={cardStyle}>
            <h2>Turnos</h2>
            <p>Podés sacar y ver tus turnos.</p>
            <Link to="/turnos">Ir a Turnos</Link>
          </div>
        )}

        {/* Rol asistente */}
        {usuario.rol === "asistente" && (
          <>
            <div style={cardStyle}>
              <h2>Pacientes</h2>
              <p>Registrar y gestionar pacientes.</p>
              <Link to="/pacientes">Ir a Pacientes</Link>
            </div>

            <div style={cardStyle}>
              <h2>Turnos</h2>
              <p>Crear, modificar y cancelar turnos.</p>
              <Link to="/turnos">Ir a Turnos</Link>
            </div>

            <div style={cardStyle}>
              <h2>Reportes</h2>
              <p>Ver reportes de turnos por día o profesional.</p>
              <Link to="/reportes">Ir a Reportes</Link>
            </div>
          </>
        )}

        {/* Rol admin */}
        {usuario.rol === "admin" && (
          <>
            <div style={cardStyle}>
              <h2>Turnos</h2>
              <p>Gestión completa de turnos.</p>
              <Link to="/turnos">Ir a Turnos</Link>
            </div>

            <div style={cardStyle}>
              <h2>Pacientes</h2>
              <p>ABM de pacientes.</p>
              <Link to="/pacientes">Ir a Pacientes</Link>
            </div>

            <div style={cardStyle}>
              <h2>Profesionales</h2>
              <p>ABM de profesionales.</p>
              <Link to="/profesionales">Ir a Profesionales</Link>
            </div>

            <div style={cardStyle}>
              <h2>Sedes</h2>
              <p>Gestionar sedes y direcciones.</p>
              <Link to="/sedes">Ir a Sedes</Link>
            </div>

            <div style={cardStyle}>
              <h2>Especialidades</h2>
              <p>Gestionar especialidades médicas.</p>
              <Link to="/especialidades">Ir a Especialidades</Link>
            </div>

            <div style={cardStyle}>
              <h2>Usuarios y Roles</h2>
              <p>Administrar usuarios, roles y permisos.</p>
              <Link to="/usuarios">Ir a Usuarios</Link>
              <br />
              <Link to="/roles">Ir a Roles</Link>
            </div>

            <div style={cardStyle}>
              <h2>Reportes y Auditoría</h2>
              <p>Ver reportes generales y auditoría del sistema.</p>
              <Link to="/reportes">Ir a Reportes</Link>
              <br />
              <Link to="/auditoria">Ir a Auditoría</Link>
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "15px",
  textAlign: "center",
  boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
};
