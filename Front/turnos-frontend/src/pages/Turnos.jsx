import { useContext, useState } from "react";
import { TurnosContext } from "../context/TurnosContext";
import { useAuth } from "../context/AuthContext";

export default function Turnos() {
  const { turnos, setTurnos, pacientes, profesionales } = useContext(TurnosContext);
  const { usuario } = useAuth();

  const [form, setForm] = useState({
    pacienteId: "",
    profesionalId: "",
    fechaHoraInicio: "",
    fechaHoraFin: ""
  });
  const [editingId, setEditingId] = useState(null);

  const turnosfiltrado = (usuario.rol === "admin" || usuario.rol === "asistente")
    ? turnos
    : turnos.filter(t => t.pacienteId === usuario.id);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setTurnos(turnosfiltrado.map(t => t.id === editingId ? { id: editingId, ...form } : t));
      setEditingId(null);
    } else {
      const newTurno = {
        id: Date.now(),
        pacienteId: parseInt(form.pacienteId),
        profesionalId: parseInt(form.profesionalId),
        fechaHoraInicio: form.fechaHoraInicio,
        fechaHoraFin: form.fechaHoraFin
      };
      setTurnos([...turnosfiltrado, newTurno]);
    }
    setForm({ pacienteId: "", profesionalId: "", fechaHoraInicio: "", fechaHoraFin: "" });
  };

  const handleCancelar = (id) => {
    setTurnos(turnosfiltrado.filter(t => t.id !== id));
  };

  const handleEditar = (t) => {
    setForm({
      pacienteId: t.pacienteId,
      profesionalId: t.profesionalId,
      fechaHoraInicio: t.fechaHoraInicio,
      fechaHoraFin: t.fechaHoraFin
    });
    setEditingId(t.id);
  };


  return (
    <div style={{ padding: "20px" }}>
      <h1>Gestión de Turnos</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        {(usuario?.rol === "admin" || usuario?.rol === "asistente") ? (
          <select name="pacienteId" value={form.pacienteId} onChange={handleChange} required style={inputStyle}>
            <option value="">Seleccionar Paciente</option>
            {pacientes.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        ) : (
          <input value={form.pacienteId} hidden />
        )}

        <select name="profesionalId" value={form.profesionalId} onChange={handleChange} required style={inputStyle}>
          <option value="">Seleccionar Profesional</option>
          {profesionales.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>
        <label>
          Fecha Inicio:
          <input type="datetime-local" name="fechaHoraInicio" value={form.fechaHoraInicio} onChange={handleChange} required style={inputStyle} />
        </label>
        <label>
          Fecha Fin:
          <input type="datetime-local" name="fechaHoraFin" value={form.fechaHoraFin} onChange={handleChange} required style={inputStyle} />
        </label>

        <button type="submit" style={btnStyle}>
          {editingId ? "Actualizar Turno" : (usuario?.rol === "usuario") ? "Sacar Turno" : "Crear Turno"}
        </button>

        {editingId && (
          <button
            type="button"
            style={{ ...btnStyle, backgroundColor: "#FF4C4C" }}
            onClick={() => { setEditingId(null); setForm({ pacienteId: "", profesionalId: "", fechaHoraInicio: "", fechaHoraFin: "" }); }}
          >
            Cancelar Edición
          </button>
        )}
      </form>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#1E90FF", color: "white" }}>
            <th style={thStyle}>Paciente</th>
            <th style={thStyle}>Profesional</th>
            <th style={thStyle}>Fecha Hora Inicio</th>
            <th style={thStyle}>Fecha Hora Fin</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {turnosfiltrado.map(t => (
            <tr key={t.id} style={{ textAlign: "center", borderBottom: "1px solid #ccc" }}>
              <td>{t.pacienteNombre}</td>
              <td>{t.profesionalNombre}</td>
              <td>{t.fechaHoraInicio}</td>
              <td>{t.fechaHoraFin}</td>
              <td>
                {(usuario?.rol === "asistente" || usuario?.rol === "admin") && (
                  <button style={btnStyle} onClick={() => handleEditar(t)}>Editar</button>
                )}
                <button
                  style={{ ...btnStyle, backgroundColor: "#FF4C4C" }}
                  onClick={() => handleCancelar(t.id)}
                >
                  Cancelar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = { padding: "10px" };
const inputStyle = { margin: "5px", padding: "5px", borderRadius: "5px", border: "1px solid #ccc" };
const btnStyle = { padding: "5px 10px", margin: "5px", border: "none", borderRadius: "5px", cursor: "pointer", backgroundColor: "#1E90FF", color: "white" };
