import React, { useState, useContext } from "react";
import { useAuth } from "../context/Auth/useAuth";
import { TurnosContext } from "../context/Turnos/TurnosContext";

export default function AsistenteVirtual() {
  const { usuario } = useAuth();
  const { profesionales, crearTurno } = useContext(TurnosContext);

  const [messages, setMessages] = useState([
    { from: "bot", text: `¡Hola ${usuario?.nombre || "visitante"}! 👋 Soy tu asistente virtual para sacar turnos.` },
    { from: "bot", text: "Por favor, selecciona una opción:\n\n1️⃣ Ver profesionales disponibles\n2️⃣ Sacar un turno nuevo\n3️⃣ Ayuda\n\nEscribe el número de la opción que deseas." }
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
    procesarMensaje(input.trim());
    setInput("");
  };

  const procesarMensaje = (texto) => {
    // --- MENÚ PRINCIPAL ---
    if (!estado) {
      if (texto === "1") {
        setMessages((m) => [...m, { from: "bot", text: "📋 Profesionales disponibles:" }]);
        profesionales.forEach((p) => {
          setMessages((m) => [...m, { from: "bot", text: `👨‍⚕️ ${p.nombre} - ${p.especialidad || "General"}` }]);
        });
        setMessages((m) => [...m, { from: "bot", text: "\n¿Deseas sacar un turno? Escribe 2️⃣" }]);
      } else if (texto === "2") {
        setMessages((m) => [...m, { from: "bot", text: "Perfecto! 👍 Vamos a sacar un turno.\n\nEscribe el nombre del profesional con quien deseas el turno:" }]);
        setEstado("eligeProfesional");
      } else if (texto === "3") {
        setMessages((m) => [...m, {
          from: "bot",
          text: "ℹ️ Puedo ayudarte a:\n\n1️⃣ Ver los profesionales disponibles\n2️⃣ Sacar un turno nuevo\n\nEscribe el número de la opción que necesites."
        }]);
      } else {
        setMessages((m) => [...m, {
          from: "bot",
          text: "❌ Opción incorrecta. Por favor selecciona:\n\n1️⃣ Ver profesionales\n2️⃣ Sacar turno\n3️⃣ Ayuda"
        }]);
      }
    }

    // --- ELEGIR PROFESIONAL ---
    else if (estado === "eligeProfesional") {
      const profesional = profesionales.find((p) =>
        p.nombre.toLowerCase().includes(texto.toLowerCase())
      );
      if (profesional) {
        setTempData({ ...tempData, profesional: profesional.idProfesional || profesional.id });
        setMessages((m) => [...m, {
          from: "bot",
          text: `Elegiste a ${profesional.nombre} ✅\n\n¿Qué fecha deseas? (formato: AAAA-MM-DD, ejemplo: 2025-12-15)`
        }]);
        setEstado("eligeFecha");
      } else {
        setMessages((m) => [...m, {
          from: "bot",
          text: "❌ No encontré ese profesional. Por favor intenta nuevamente con el nombre completo o parte del nombre."
        }]);
      }
    }

    // --- FECHA ---
    else if (estado === "eligeFecha") {
      // Validar formato de fecha
      const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!fechaRegex.test(texto)) {
        setMessages((m) => [...m, {
          from: "bot",
          text: "❌ Formato de fecha incorrecto. Usa el formato AAAA-MM-DD (ejemplo: 2025-12-15)"
        }]);
        return;
      }

      setTempData({ ...tempData, fecha: texto });
      setMessages((m) => [...m, {
        from: "bot",
        text: `Fecha: ${texto} ✅\n\n¿A qué hora? (formato: HH:MM, ejemplo: 09:00)`
      }]);
      setEstado("eligeHora");
    }

    // --- HORA ---
    else if (estado === "eligeHora") {
      // Validar formato de hora
      const horaRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (!horaRegex.test(texto)) {
        setMessages((m) => [...m, {
          from: "bot",
          text: "❌ Formato de hora incorrecto. Usa el formato HH:MM (ejemplo: 09:00)"
        }]);
        return;
      }

      const fechaHoraInicio = `${tempData.fecha}T${texto}:00`;
      const [hora, minutos] = texto.split(":");
      const horaFin = `${String(Number(hora) + 1).padStart(2, "0")}:${minutos}`;
      const fechaHoraFin = `${tempData.fecha}T${horaFin}:00`;

      const nuevoTurno = {
        idPaciente: usuario.id,
        idProfesional: tempData.profesional,
        fechaHoraInicio,
        fechaHoraFin,
      };

      crearTurno(nuevoTurno)
        .then(() => {
          setMessages((m) => [...m, {
            from: "bot",
            text: `✅ ¡Turno agendado exitosamente!\n\nFecha: ${tempData.fecha}\nHora: ${texto}\n\n¿Necesitas algo más?\n\n1️⃣ Ver profesionales\n2️⃣ Sacar otro turno\n3️⃣ Ayuda`
          }]);
        })
        .catch((err) => {
          setMessages((m) => [...m, {
            from: "bot",
            text: `❌ Error al agendar turno: ${err.message || "Intenta nuevamente"}`
          }]);
        });

      setEstado(null);
      setTempData({});
    }
  };

  // Solo mostrar para usuarios (pacientes)
  if (usuario?.rol !== "usuario") {
    return null;
  }

  return (
    <div style={styles.container}>
      {isOpen && (
        <div style={styles.chatBox}>
          <div style={styles.header}>
            Asistente Virtual 🤖
            <button
              onClick={toggleChat}
              style={styles.closeButton}
            >
              ✕
            </button>
          </div>
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
              placeholder="Escribe un mensaje..."
            />
            <button style={styles.sendButton} onClick={handleSend}>
              Enviar
            </button>
          </div>
        </div>
      )}
      <button style={styles.toggleButton} onClick={toggleChat}>
        💬
      </button>
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
    width: "350px",
    height: "500px",
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeButton: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "20px",
    cursor: "pointer",
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
    fontSize: "14px",
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
