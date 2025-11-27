import { useContext, useState } from "react";
import { TurnosContext } from "../context/Turnos/TurnosContext";
import { useAuth } from "../context/Auth/useAuth";

export default function Especialidades() {
  const { usuario } = useAuth();
  const { especialidades, crearEspecialidad, editarEspecialidad, eliminarEspecialidad, loading } =
    useContext(TurnosContext);

  const [form, setForm] = useState({ nombre: "" });
  const [editandoId, setEditandoId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editandoId) {
        await editarEspecialidad(editandoId, form);
        setEditandoId(null);
      } else {
        await crearEspecialidad(form);
      }
      setForm({ nombre: "" });
    } catch (error) {
      console.error("Error guardando especialidad:", error);
    }
  }

  async function handleEliminar(id) {
    if (!confirm("¿Seguro que deseas eliminar esta especialidad?")) return;
    await eliminarEspecialidad(id);
  }

  function handleEditar(especialidad) {
    setForm({ nombre: especialidad.nombre });
    setEditandoId(especialidad.idEspecialidad);
  }

  if (loading) return <p>Cargando especialidades...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Gestión de Especialidades</h1>

      {/* Formulario solo para Admin */}
      {usuario?.rol === "admin" && (
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre de la especialidad"
            value={form.nombre}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <button type="submit" style={btnStyle}>
            {editandoId ? "Actualizar" : "Crear"}
          </button>
          {editandoId && (
            <button
              type="button"
              style={{ ...btnStyle, backgroundColor: "#FF4C4C" }}
              onClick={() => {
                setEditandoId(null);
                setForm({ nombre: "" });
              }}
            >
              Cancelar
            </button>
          )}
        </form>
      )}

      {/* Tabla */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#1E90FF", color: "white" }}>
            <th style={thStyle}>Nombre</th>
            {usuario?.rol === "admin" && <th style={thStyle}>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {especialidades.map((e) => (
            <tr key={e.idEspecialidad} style={{ textAlign: "center", borderBottom: "1px solid #ccc" }}>
              <td>{e.nombre}</td>
              <td>
                {usuario?.rol === "admin" && (
                  <>
                    <button style={btnStyle} onClick={() => handleEditar(e)}>
                      Editar
                    </button>{" "}
                    <button
                      style={{ ...btnStyle, backgroundColor: "#FF4C4C" }}
                      onClick={() => handleEliminar(e.idEspecialidad)}
                    >
                      Eliminar
                    </button>
                  </>
                )}
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
