import { useContext, useState, useEffect } from "react";
import * as RolesService from "../api/rolesService";
import { useAuth } from "../context/Auth/useAuth";

export default function Roles() {
    const { usuario } = useAuth();
    const [roles, setRoles] = useState([]);
    const [form, setForm] = useState({ nombre: "" });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            setLoading(true);
            const data = await RolesService.getRoles();
            setRoles(data);
        } catch (err) {
            console.error("Error fetching roles:", err);
            setError("Error al cargar roles");
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

        try {
            if (editingId) {
                await RolesService.editarRole(editingId, form);
            } else {
                await RolesService.crearRole(form);
            }

            fetchRoles();
            setForm({ nombre: "" });
            setEditingId(null);
        } catch (err) {
            console.error("Error saving role:", err);
            setError(err.response?.data || "Error al guardar rol");
        }
    };

    const handleEditar = (r) => {
        setForm({ nombre: r.nombre });
        setEditingId(r.idRol);
    };

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Seguro que desea eliminar este rol?")) return;
        try {
            await RolesService.eliminarRole(id);
            fetchRoles();
        } catch (err) {
            console.error("Error deleting rol:", err);
            setError("Error al eliminar rol");
        }
    };

    if (usuario?.rol !== "admin") return <div>Acceso denegado</div>;

    return (
        <div style={{ padding: "20px" }}>
            <h1>Gestión de Roles</h1>

            {loading && <p>Cargando...</p>}
            {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

            {/* Formulario */}
            <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
                <div className="row row-cols-1 row-cols-sm-3 row-cols-md-5">
                    <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre del Rol"
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
                </div>
            </form>

            {/* Tabla */}
            <div className="table-responsive text-center">
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#1E90FF", color: "white" }}>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>Nombre</th>
                            <th style={thStyle}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map(r => (
                            <tr key={r.idRol} style={{ textAlign: "center", borderBottom: "1px solid #ccc" }}>
                                <td>{r.idRol}</td>
                                <td>{r.nombre}</td>
                                <td>
                                    <button style={btnStyle} onClick={() => handleEditar(r)}>
                                        Editar
                                    </button>{" "}
                                    <button
                                        style={{ ...btnStyle, backgroundColor: "#FF4C4C" }}
                                        onClick={() => handleEliminar(r.idRol)}
                                    >
                                        Eliminar
                                    </button>
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
const inputStyle = {
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
