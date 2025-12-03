import { useState, useEffect } from "react";
import * as OrdenesService from "../api/ordenesService";
import * as ProfesionalesService from "../api/profesionalesService";
import * as PacientesService from "../api/pacientesService";
import { useAuth } from "../context/Auth/useAuth";

export default function Ordenes() {
    const { usuario } = useAuth();
    const [ordenes, setOrdenes] = useState([]);
    const [profesionales, setProfesionales] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Form states
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        idPaciente: "",
        practica: "",
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [ordenesData, profData, pacData] = await Promise.all([
                OrdenesService.getOrdenes(),
                ProfesionalesService.getProfesionales(),
                PacientesService.getPacientes()
            ]);
            setOrdenes(ordenesData);
            setProfesionales(profData);
            setPacientes(pacData);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Error al cargar datos");
        } finally {
            setLoading(false);
        }
    };

    const ordenesFiltradas = ordenes.filter(o => {
        if (usuario?.rol === "admin" || usuario?.rol === "asistente") return true;
        return o.idPaciente === usuario?.id;
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const payload = {
                idPaciente: usuario?.rol === "usuario" ? usuario.id : Number(form.idPaciente),
                practica: form.practica
            };

            await OrdenesService.crearOrden(payload);
            await fetchData();
            setShowForm(false);
            setForm({ idPaciente: "", practica: "" });
            alert("Orden subida correctamente. Pendiente de autorización.");
        } catch (err) {
            console.error("Error creating orden:", err);
            setError("Error al crear la orden");
        }
    };

    const handleAutorizar = async (orden) => {
        if (!window.confirm(`¿Autorizar orden para ${orden.pacienteNombre}?`)) return;

        try {
            // Al autorizar, podríamos derivar automáticamente o pedir un profesional.
            // Por ahora, autorizamos y opcionalmente asignamos un profesional si se requiere en el futuro.
            // El requerimiento dice "el sistema la autoriza y el sistema deriva a otro prestador".
            // Vamos a simular una derivación automática al primer profesional disponible de la misma especialidad si es posible,
            // o simplemente dejarlo autorizado.

            // Para simplificar y cumplir con el backend actual:
            await OrdenesService.editarOrden(orden.id, {
                autorizada: true,
                derivadaAProfesionalId: null // O lógica de derivación
            });

            await fetchData();
        } catch (err) {
            console.error("Error authorizing orden:", err);
            setError("Error al autorizar la orden");
        }
    };



    const handleEliminar = async (id) => {
        if (!window.confirm("¿Seguro que desea eliminar esta orden?")) return;
        try {
            await OrdenesService.eliminarOrden(id);
            fetchData();
        } catch (err) {
            console.error("Error deleting orden:", err);
            setError("Error al eliminar orden");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Gestión de Órdenes Médicas</h1>
                <button style={btnSuccessStyle} onClick={() => setShowForm(!showForm)}>
                    {showForm ? "Cancelar" : "+ Nueva Orden"}
                </button>
            </div>

            {loading && <p>Cargando...</p>}
            {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

            {/* Formulario de Creación */}
            {showForm && (
                <form onSubmit={handleSubmit} style={formStyle}>
                    <div className="row row-cols-1 row-cols-sm-3 row-cols-md-5">
                        <h3>Subir Nueva Orden</h3>

                        {(usuario?.rol === "admin" || usuario?.rol === "asistente") && (
                            <select
                                name="idPaciente"
                                value={form.idPaciente}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            >
                                <option value="">Seleccionar Paciente</option>
                                {pacientes.map(p => (
                                    <option key={p.id ?? p.idPaciente} value={p.id ?? p.idPaciente}>
                                        {p.nombre} (DNI: {p.dni})
                                    </option>
                                ))}
                            </select>
                        )}

                        <input
                            type="text"
                            name="practica"
                            placeholder="Práctica (ej. Kinesiología, Rayos X)"
                            value={form.practica}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />

                        <div style={{ marginTop: "10px" }}>
                            <button type="submit" style={btnStyle}>Guardar Orden</button>
                        </div>
                    </div>
                </form>
            )}

            {/* Tabla */}
            <div className="table-responsive text-center">
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#1E90FF", color: "white" }}>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>Paciente</th>
                            <th style={thStyle}>Práctica</th>
                            <th style={thStyle}>Fecha Subida</th>
                            <th style={thStyle}>Estado</th>
                            <th style={thStyle}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ordenesFiltradas.length === 0 && !loading && (
                            <tr><td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>No hay órdenes registradas.</td></tr>
                        )}
                        {ordenesFiltradas.map(o => (
                            <tr key={o.id} style={{ textAlign: "center", borderBottom: "1px solid #ccc" }}>
                                <td style={tdStyle}>{o.id}</td>
                                <td style={tdStyle}>{o.pacienteNombre}</td>
                                <td style={tdStyle}>{o.practica}</td>
                                <td style={tdStyle}>{new Date(o.fechaSubida).toLocaleDateString()}</td>
                                <td style={tdStyle}>
                                    {o.usada ? (
                                        <span style={badgeSecondary}>Usada</span>
                                    ) : o.autorizada ? (
                                        <span style={badgeSuccess}>Autorizada</span>
                                    ) : (
                                        <span style={badgeWarning}>Pendiente</span>
                                    )}
                                </td>
                                <td style={tdStyle}>
                                    {(usuario?.rol === "admin" || usuario?.rol === "asistente") && !o.autorizada && !o.usada && (
                                        <button style={btnSuccessStyle} onClick={() => handleAutorizar(o)} title="Autorizar">
                                            ✓
                                        </button>
                                    )}
                                    <button
                                        style={btnDangerStyle}
                                        onClick={() => handleEliminar(o.id)}
                                        title="Eliminar"
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

// Styles
const thStyle = { padding: "10px" };
const tdStyle = { padding: "8px" };
const inputStyle = {
    display: "block",
    width: "100%",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
};
const formStyle = {
    backgroundColor: "#f9f9f9",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #ddd"
};
const btnStyle = {
    padding: "8px 15px",
    margin: "5px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#1E90FF",
    color: "white",
};
const btnSuccessStyle = { ...btnStyle, backgroundColor: "#28a745" };
const btnDangerStyle = { ...btnStyle, backgroundColor: "#dc3545" };
const btnInfoStyle = { ...btnStyle, backgroundColor: "#17a2b8" };

const badgeSuccess = {
    backgroundColor: "#28a745",
    color: "white",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "12px"
};
const badgeWarning = {
    backgroundColor: "#ffc107",
    color: "#333",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "12px"
};
const badgeSecondary = {
    backgroundColor: "#6c757d",
    color: "white",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "12px"
};
