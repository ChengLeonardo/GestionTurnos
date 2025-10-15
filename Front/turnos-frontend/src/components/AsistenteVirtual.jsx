import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { TurnosContext } from "../context/TurnosContext";

export default function AsistenteVirtual() {
  const { usuario } = useContext(AuthContext);
  const { pacientes, profesionales, turnos, setTurnos } = useContext(TurnosContext);

  const [messages, setMessages] = useState([
    { from: "bot", text: `Hola ${usuario?.email || "visitante"} 👋 ¿En qué puedo ayudarte hoy?` },
  ]);
  const [input, setInput] = useState("");
  const [estado, setEstado] = useState(null);
  const [tempData, setTempData] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = () => {
    if (!input.trim()) return;
    const nuevoMensaje = { from: "user", text: input };
    setMessages((prev) => [...prev, nuevoMensaje]);
    procesarMensaje(input.trim().toLowerCase());
    setInput("");
  };

  const procesarMensaje = (texto) => {
    // --- MENÚ PRINCIPAL ---
    if (!estado) {
      if (texto.includes("turno")) {
        setMessages((m) => [...m, { from: "bot", text: "¿Querés ver tus turnos o sacar uno nuevo?" }]);
        setEstado("menuTurnos");
      } else if (texto.includes("profesional")) {
        setMessages((m) => [...m, { from: "bot", text: "Estos son los profesionales disponibles:" }]);
        profesionales.forEach((p) => {
          setMessages((m) => [...m, { from: "bot", text: `👩‍⚕️ ${p.nombre}` }]);
        });
      } else {
        setMessages((m) => [
          ...m,
          { from: "bot", text: "Puedo ayudarte con tus turnos o información de profesionales." },
        ]);
      }
    }

    // --- MENÚ TURNOS ---
    else if (estado === "menuTurnos") {
      if (texto.includes("ver")) {
        if (usuario.rol === "usuario") {
          const misTurnos = turnos.filter((t) => t.paciente === usuario.id);
          if (misTurnos.length === 0) {
            setMessages((m) => [...m, { from: "bot", text: "No tenés turnos próximos." }]);
          } else {
            misTurnos.forEach((t) => {
              setMessages((m) => [
                ...m,
                { from: "bot", text: `📅 ${t.fecha} a las ${t.hora} con ${t.profesional}` },
              ]);
            });
          }
        } else {
          setMessages((m) => [
            ...m,
            { from: "bot", text: "¿De qué paciente querés ver los turnos? (nombre o ID)" },
          ]);
          setEstado("verTurnosOtro");
        }
      } else if (texto.includes("nuevo")) {
        if (usuario.rol === "usuario") {
          setMessages((m) => [
            ...m,
            { from: "bot", text: "Perfecto 👍 ¿Con qué profesional querés sacar turno?" },
          ]);
          setEstado("eligeProfesional");
        } else {
          setMessages((m) => [
            ...m,
            { from: "bot", text: "¿Para qué paciente querés sacar el turno? (nombre o ID)" },
          ]);
          setEstado("eligePaciente");
        }
      }
    }

    // --- VER TURNOS DE OTRO PACIENTE ---
    else if (estado === "verTurnosOtro") {
      const paciente = pacientes.find(
        (p) => p.nombre.toLowerCase().includes(texto) || p.id.toString() === texto
      );
      if (paciente) {
        const turnosPaciente = turnos.filter((t) => t.paciente === paciente.id);
        if (turnosPaciente.length === 0) {
          setMessages((m) => [...m, { from: "bot", text: `${paciente.nombre} no tiene turnos.` }]);
        } else {
          turnosPaciente.forEach((t) => {
            setMessages((m) => [
              ...m,
              { from: "bot", text: `📅 ${t.fecha} a las ${t.hora} con ${t.profesional}` },
            ]);
          });
        }
        setEstado(null);
      } else {
        setMessages((m) => [...m, { from: "bot", text: "No encontré ese paciente." }]);
      }
    }

    // --- ELEGIR PACIENTE (ASISTENTE/ADMIN) ---
    else if (estado === "eligePaciente") {
      const paciente = pacientes.find(
        (p) => p.nombre.toLowerCase().includes(texto) || p.id.toString() === texto
      );
      if (paciente) {
        setTempData({ ...tempData, pacienteId: paciente.id });
        setMessages((m) => [
          ...m,
          { from: "bot", text: `Paciente: ${paciente.nombre}. ¿Con qué profesional?` },
        ]);
        setEstado("eligeProfesional");
      } else {
        setMessages((m) => [
          ...m,
          { from: "bot", text: "No encontré ese paciente. Probá con otro nombre o ID." },
        ]);
      }
    }

    // --- ELEGIR PROFESIONAL ---
    else if (estado === "eligeProfesional") {
      const profesional = profesionales.find((p) => p.nombre.toLowerCase().includes(texto));
      if (profesional) {
        setTempData({ ...tempData, profesional: profesional.id });
        setMessages((m) => [
          ...m,
          { from: "bot", text: `Elegiste ${profesional.nombre}. ¿Qué fecha querés? (AAAA-MM-DD)` },
        ]);
        setEstado("eligeFecha");
      } else {
        setMessages((m) => [...m, { from: "bot", text: "No encontré ese profesional." }]);
      }
    }

    // --- FECHA ---
    else if (estado === "eligeFecha") {
      setTempData({ ...tempData, fecha: texto });
      setMessages((m) => [...m, { from: "bot", text: "¿A qué hora? (ej: 09:00)" }]);
      setEstado("eligeHora");
    }

    // --- HORA ---
    else if (estado === "eligeHora") {
      const nuevoTurno = {
        id: turnos.length + 1,
        pacienteId: usuario.rol === "usuario" ? usuario.id : tempData.pacienteId,
        profesionalId: tempData.profesional,
        fecha: tempData.fecha,
        hora: texto,
        especialidad: "General",
        sede: "Central",
      };
      setTurnos([...turnos, nuevoTurno]);
      setMessages((m) => [
        ...m,
        {
          from: "bot",
          text: `✅ Turno agendado con ${tempData.profesional} el ${tempData.fecha} a las ${texto}`,
        },
      ]);
      setEstado(null);
      setTempData({});
    }
  };

  return (
    <div style={styles.container}>
      {isOpen && (
        <div style={styles.chatBox}>
          <div style={styles.header}>Asistente Virtual</div>
          <div style={styles.messages}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  ...styles.message,
                  alignSelf: m.from === "user" ? "flex-end" : "flex-start",
                  backgroundColor: m.from === "user" ? "#DCF8C6" : "#EEE",
                }}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div style={styles.inputBox}>
            <input
              style={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Escribí un mensaje..."
            />
            <button style={styles.sendButton} onClick={handleSend}>
              Enviar
            </button>
          </div>
        </div>
      )}
      <button style={styles.toggleButton} onClick={toggleChat}>💬</button>
    </div>
  );
}

const styles = {
  container: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 1000,
  },
  toggleButton: {
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    fontSize: "24px",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  },
  chatBox: {
    width: "320px",
    height: "420px",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    marginBottom: "10px",
  },
  header: {
    backgroundColor: "#007BFF",
    color: "white",
    textAlign: "center",
    padding: "10px",
    fontWeight: "bold",
  },
  messages: {
    flex: 1,
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    overflowY: "auto",
  },
  message: {
    padding: "8px 12px",
    borderRadius: "15px",
    maxWidth: "80%",
    whiteSpace: "pre-wrap",
  },
  inputBox: {
    display: "flex",
    padding: "8px",
    borderTop: "1px solid #ddd",
  },
  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    outline: "none",
  },
  sendButton: {
    marginLeft: "8px",
    padding: "8px 12px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
