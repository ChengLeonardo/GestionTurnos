import { useState } from "react";
import { useAuth } from "../context/Auth/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await signIn(email, password);
    if (success) navigate("/dashboard");
    else setError("Credenciales incorrectas");
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>Iniciar Sesión</h2>

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.button}>
          Entrar
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    width: "320px",
    boxSizing: "border-box",
  },
  title: {
    fontSize: "20px",
    marginBottom: "16px",
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    border: "1px solid #d1d5db",
    padding: "8px",
    width: "100%",
    marginBottom: "12px",
    borderRadius: "6px",
    boxSizing: "border-box",
  },
  error: {
    color: "#dc2626",
    fontSize: "14px",
    marginBottom: "8px",
  },
  button: {
    backgroundColor: "#3b82f6",
    color: "white",
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: "500",
  },
};
