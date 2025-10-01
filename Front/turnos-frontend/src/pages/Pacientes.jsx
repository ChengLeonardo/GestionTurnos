import { useContext, useState } from "react";
import { TurnosContext } from "../context/TurnosContext";

export default function Pacientes() {
  const { pacientes, setPacientes} = useContext(TurnosContext);

  const [form, setForm] = useState({ nombre: "", dni: "", telefono: "" });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // Editar paciente
      setPacientes(pacientes.map(p => p.id === editingId ? { id: editingId, ...form } : p));
      setEditingId(null);
    } else {
      // Crear paciente nuevo
      const newPaciente = { id: Date.now(), ...form };
      setPacientes([...pacientes, newPaciente]);
    }
    setForm({ nombre: "", dni: "", telefono: "" });
  };

  const handleEliminar = (id) => {
    setPacientes(pacientes.filter(p => p.id !== id));
  };

  const handleEditar = (p) => {
    setForm({ nombre: p.nombre, dni: p.dni, telefono: p.telefono });
    setEditingId(p.id);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Gestión de Pacientes</h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required style={inputStyle}/>
        <input type="text" name="dni" placeholder="DNI" value={form.dni} onChange={handleChange} required style={inputStyle}/>
        <input type="text" name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} required style={inputStyle}/>
        <button type="submit" style={btnStyle}>{editingId ? "Actualizar" : "Crear"}</button>
        {editingId && <button type="button" style={{...btnStyle, backgroundColor:"#FF4C4C"}} onClick={() => {setEditingId(null); setForm({ nombre:"", dni:"", telefono:"" })}}>Cancelar</button>}
      </form>

      {/* Tabla */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#1E90FF", color: "white" }}>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>DNI</th>
            <th style={thStyle}>Teléfono</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map(p => (
            <tr key={p.id} style={{ textAlign: "center", borderBottom: "1px solid #ccc" }}>
              <td>{p.nombre}</td>
              <td>{p.dni}</td>
              <td>{p.telefono}</td>
              <td>
                <button style={btnStyle} onClick={() => handleEditar(p)}>Editar</button>{" "}
                <button style={{...btnStyle, backgroundColor:"#FF4C4C"}} onClick={() => handleEliminar(p.id)}>Eliminar</button>
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
