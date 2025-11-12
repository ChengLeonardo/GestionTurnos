import { useContext, useState, useEffect } from "react";
import * as UsersService from "../api/usersService";
import * as RolesService from "../api/rolesService";
import { useAuth } from "../context/Auth/useAuth";

export default function Usuarios() {
  const { usuario } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({ nombre: "", email: "", password: "", rolId: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, rolesData] = await Promise.all([
        UsersService.getUsers(),
        RolesService.getRoles()
      ]);
      setUsuarios(usersData);
      setRoles(rolesData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      nombre: form.nombre,
      email: form.email,
      rolId: Number(form.rolId)
    };

    if (!editingId) {
      payload.password = form.password;
    }

    try {
      if (editingId) {
        await UsersService.editarUser(editingId, payload);
      } else {
        await UsersService.crearUser(payload);
      }

      fetchData();
      setForm({ nombre: "", email: "", password: "", rolId: "" });
      setEditingId(null);
    } catch (err) {
      console.error("Error saving user:", err);
      setError(err.response?.data || "Error al guardar usuario");
    }
  };

  const handleEditar = (u) => {
    setForm({
      nombre: u.nombre,
      email: u.email,
      password: "",
      rolId: u.rolId
    });
    setEditingId(u.id);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que desea eliminar este usuario?")) return;
    try {
      await UsersService.eliminarUser(id);
      fetchData();
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Error al eliminar usuario");
    }
  };

  if (usuario?.rol !== "admin") return <div>Acceso denegado</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Gestión de Usuarios</h1>

      {loading && <p>Cargando...</p>}
      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

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
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        {!editingId && (
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        )}
        <select
          name="rolId"
          value={form.rolId}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="">Seleccionar Rol</option>
          {roles.map(r => (
            <option key={r.idRol} value={r.idRol}>{r.nombre}</option>
          ))}
        </select>
        <button type="submit" style={btnStyle}>
          {editingId ? "Actualizar" : "Crear"}
        </button>
        {editingId && (
          <button
            type="button"
            style={{ ...btnStyle, backgroundColor: "#FF4C4C" }}
            onClick={() => {
              setEditingId(null);
              setForm({ nombre: "", email: "", password: "", rolId: "" });
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
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Rol</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.id} style={{ textAlign: "center", borderBottom: "1px solid #ccc" }}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.email}</td>
              <td>{u.rol}</td>
              <td>
                <button style={btnStyle} onClick={() => handleEditar(u)}>
                  Editar
                </button>{" "}
                <button
                  style={{ ...btnStyle, backgroundColor: "#FF4C4C" }}
                  onClick={() => handleEliminar(u.id)}
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
