import { useContext, useState, useEffect } from "react";
import { TurnosContext } from "../context/TurnosContext";

export default function Pacientes() {
  const {
    pacientes,
    fetchPacientes,
    crearPaciente,
    eliminarPaciente,
    editarPaciente,
    loading,
  } = useContext(TurnosContext);

  const [form, setForm] = useState({ nombre: "", dni: "", telefono: "", email: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPacientes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      // Editar paciente existente
      await editarPaciente(editingId, form);
      setEditingId(null);
    } else {
      // Crear nuevo paciente
      await crearPaciente(form);
    }

    setForm({ nombre: "", dni: "", telefono: "", email: "" });
  };

  const handleEliminar = async (idPaciente) => {
    if (window.confirm("¿Seguro que quieres eliminar este paciente?")) {
      await eliminarPaciente(idPaciente);
    }
  };

  const handleEditar = (p) => {
    setForm({
      nombre: p.nombre,
      dni: p.dni,
      telefono: p.telefono,
      email: p.email,
    });
    setEditingId(p.idPaciente);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Gestión de Pacientes</h1>

      {loading && <p>Cargando pacientes...</p>}

      {/* Formulario */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
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
          name="dni"
          placeholder="DNI"
          value={form.dni}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={form.email}
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
              setForm({ nombre: "", dni: "", telefono: "", email: "" });
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      {/* Tabla */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#1E90FF", color: "white" }}>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>DNI</th>
            <th style={thStyle}>Teléfono</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map((p) => (
            <tr key={p.idPaciente} style={{ textAlign: "center", borderBottom: "1px solid #ccc" }}>
              <td>{p.nombre}</td>
              <td>{p.dni}</td>
              <td>{p.telefono}</td>
              <td>{p.email}</td>
              <td>
                <button style={btnStyle} onClick={() => handleEditar(p)}>
                  Editar
                </button>{" "}
                <button
                  style={{ ...btnStyle, backgroundColor: "#FF4C4C" }}
                  onClick={() => handleEliminar(p.idPaciente)}
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
