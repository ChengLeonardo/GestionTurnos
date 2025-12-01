import { useContext, useState } from "react";
import { TurnosContext } from "../context/Turnos/TurnosContext";

export default function Profesionales() {
  const { profesionales, crearProfesional, eliminarProfesional, editarProfesional } =
    useContext(TurnosContext);

  const [form, setForm] = useState({
    nombre: ""
  });
  const [editingId, setEditingId] = useState(null);

  // Manejar cambio de input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Crear o actualizar profesional
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await editarProfesional(editingId, form);
        setEditingId(null);
      } else {
        const nuevoProfesional = {
          nombre: form.nombre,
        };

        await crearProfesional(nuevoProfesional); // ✅ Usa la función del contexto
      }

      setForm({ nombre: "" });
    } catch (err) {
      console.error("Error al crear profesional:", err);
    }
  };

  const handleEliminar = async (idProfesional) => {
    try {
      await eliminarProfesional(idProfesional); // ✅ Usa la función del contexto
    } catch (err) {
      console.error("Error al eliminar profesional:", err);
    }
  };

  const handleEditar = (p) => {
    setForm({
      nombre: p.nombre,
    });
    setEditingId(p.idProfesional);
  };

  // --- el resto del componente queda IGUAL ---
  return (
    <div style={{ padding: "20px" }}>
      <h1>Gestión de Profesionales</h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del profesional"
          value={form.nombre}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <button type="submit" style={btnStyle}>
          {editingId ? "Actualizar" : "Crear"}
        </button>
        {editingId && (
          <button
            type="button"
            style={{ ...btnStyle, backgroundColor: "#FF4C4C" }}
            onClick={() => {
              setEditingId(null);
              setForm({ nombre: "" });
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#1E90FF", color: "white" }}>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {profesionales.map((p) => (
            <tr
              key={p.idProfesional}
              style={{ textAlign: "center", borderBottom: "1px solid #ccc" }}
            >
              <td>{p.nombre}</td>
              <td>
                <button style={btnStyle} onClick={() => handleEditar(p)}>
                  Editar
                </button>{" "}
                <button
                  style={{ ...btnStyle, backgroundColor: "#FF4C4C" }}
                  onClick={() => handleEliminar(p.idProfesional)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- estilos iguales ---
const thStyle = { padding: "10px" };
const inputStyle = {
  margin: "5px",
  padding: "5px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};
const btnStyle = {
  padding: "5px 10px",
  margin: "5px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  backgroundColor: "#1E90FF",
  color: "white",
};
