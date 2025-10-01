import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <p>Bienvenido al sistema de gestión de turnos</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginTop: "30px"
        }}
      >
        <div style={cardStyle}>
          <h2>Turnos</h2>
          <p>Gestiona y consulta los turnos</p>
          <Link to="/turnos">Ir a Turnos</Link>
        </div>

        <div style={cardStyle}>
          <h2>Pacientes</h2>
          <p>Información de pacientes registrados</p>
          <Link to="/pacientes">Ir a Pacientes</Link>
        </div>

        <div style={cardStyle}>
          <h2>Profesionales</h2>
          <p>Gestión de médicos y especialistas</p>
          <Link to="/profesionales">Ir a Profesionales</Link>
        </div>

        <div style={cardStyle}>
          <h2>Reportes</h2>
          <p>Consulta estadísticas y reportes</p>
          <Link to="/reportes">Ir a Reportes</Link>
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
  boxShadow: "2px 2px 8px rgba(0,0,0,0.1)"
};
