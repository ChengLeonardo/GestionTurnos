import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()
    const login = () => {
        console.log("Sesion iniciada")
        navigate("/dashboard")
    }
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Intento de login:", email, password);
  };

  return (
    <div style={{ maxWidth: "300px", margin: "50px auto" }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button onClick={login} type="submit">Ingresar</button>
      </form>
    </div>
  );
}
