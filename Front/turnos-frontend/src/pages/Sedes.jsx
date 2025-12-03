import { useContext, useState } from "react";
import { TurnosContext } from "../context/Turnos/TurnosContext";
import { useAuth } from "../context/Auth/useAuth";

export default function Sedes() {
  const { usuario } = useAuth();
  const { sedes, crearSede, editarSede, eliminarSede, loading } = useContext(TurnosContext);

  const [form, setForm] = useState({ nombre: "", direccion: "" });
  const [editandoId, setEditandoId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editandoId) {
        await editarSede(editandoId, form);
        setEditandoId(null);
      } else {
        await crearSede(form);
      }
      setForm({ nombre: "", direccion: "" });
    } catch (error) {
      console.error("Error guardando sede:", error);
    }
  }

  async function handleEliminar(id) {
    if (!confirm("¿Seguro que deseas eliminar esta sede?")) return;
    await eliminarSede(id);
  }

  function handleEditar(sede) {
    setForm({ nombre: sede.nombre, direccion: sede.direccion });
    setEditandoId(sede.idSede);
  }

  if (loading) return <p>Cargando sedes...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Gestión de Sedes</h1>

      {/* Formulario */}
      {/* Formulario solo para Admin */}
      {usuario?.rol === "admin" && (
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
          <div className="row row-cols-1 row-cols-sm-3 row-cols-md-5">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              type="text"
              name="direccion"
              placeholder="Dirección"
              value={form.direccion}
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
                  setForm({ nombre: "", direccion: "" });
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      )}

      {/* Tabla */}
      <div className="table-responsive text-center">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#1E90FF", color: "white" }}>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Dirección</th>
              {usuario?.rol === "admin" && <th style={thStyle}>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {sedes.map((s) => (
              <tr key={s.idSede} style={{ textAlign: "center", borderBottom: "1px solid #ccc" }}>
                <td>{s.nombre}</td>
                <td>{s.direccion}</td>
                <td>
                  {usuario?.rol === "admin" && (
                    <>
                      <button style={btnStyle} onClick={() => handleEditar(s)}>
                        Editar
                      </button>{" "}
                      <button
                        style={{ ...btnStyle, backgroundColor: "#FF4C4C" }}
                        onClick={() => handleEliminar(s.idSede)}
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
    </div>
  );
}

const thStyle = { padding: "10px" };
const inputStyle = { padding: "5px", borderRadius: "5px", border: "1px solid #ccc" };
const btnStyle = { padding: "5px 10px", margin: "5px", border: "none", borderRadius: "5px", cursor: "pointer", backgroundColor: "#1E90FF", color: "white" };
