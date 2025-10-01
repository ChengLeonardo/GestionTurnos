import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí borras token o estado de login si lo tuvieras
    console.log("Cerrar sesión");
    navigate("/login"); // Redirige al login
  };

  return (
    <nav style={navStyle}>
      <div style={{ display: "flex", gap: "15px" }}>
        <Link style={linkStyle} to="/dashboard">Dashboard</Link>
        <Link style={linkStyle} to="/turnos">Turnos</Link>
        <Link style={linkStyle} to="/pacientes">Pacientes</Link>
        <Link style={linkStyle} to="/profesionales">Profesionales</Link>
        <Link style={linkStyle} to="/reportes">Reportes</Link>
      </div>
      <button style={btnStyle} onClick={handleLogout}>Logout</button>
    </nav>
  );
}

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
