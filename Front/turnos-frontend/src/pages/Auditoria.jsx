import { useState, useEffect } from "react";
import * as AuditService from "../api/auditService";
import { useAuth } from "../context/Auth/useAuth";

export default function Auditoria() {
    const { usuario } = useAuth();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const data = await AuditService.getAuditLogs();
            setLogs(data);
        } catch (err) {
            console.error("Error fetching audit logs:", err);
            setError("Error al cargar logs de auditoría");
        } finally {
            setLoading(false);
        }
    };

    if (usuario?.rol !== "admin") {
        return <div style={{ padding: "20px" }}>Acceso denegado. Solo administradores pueden ver los logs de auditoría.</div>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>Auditoría del Sistema</h1>
            <p style={{ color: "#666", marginBottom: "20px" }}>
                Registro de todas las acciones de modificación (POST, PUT, DELETE) realizadas en el sistema.
            </p>

            {loading && <p>Cargando logs...</p>}
            {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

            <button onClick={fetchLogs} style={btnStyle}>
                Actualizar
            </button>

            {/* Tabla */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                <thead>
                    <tr style={{ backgroundColor: "#1E90FF", color: "white" }}>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Usuario</th>
                        <th style={thStyle}>Acción</th>
                        <th style={thStyle}>Endpoint</th>
                        <th style={thStyle}>Fecha/Hora</th>
                        <th style={thStyle}>Detalles</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.length === 0 && !loading && (
                        <tr>
                            <td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                                No hay logs de auditoría disponibles
                            </td>
                        </tr>
                    )}
                    {logs.map(log => (
                        <tr key={log.id} style={{ textAlign: "center", borderBottom: "1px solid #ccc" }}>
                            <td style={tdStyle}>{log.id}</td>
                            <td style={tdStyle}>{log.usuario}</td>
                            <td style={tdStyle}>
                                <span style={{
                                    padding: "3px 8px",
                                    borderRadius: "3px",
                                    backgroundColor: log.accion === "POST" ? "#28a745" : log.accion === "PUT" ? "#ffc107" : "#dc3545",
                                    color: "white",
                                    fontSize: "12px"
                                }}>
                                    {log.accion}
                                </span>
                            </td>
                            <td style={tdStyle}>{log.endpoint}</td>
                            <td style={tdStyle}>{new Date(log.fechaHora).toLocaleString('es-AR')}</td>
                            <td style={tdStyle}>{log.detalles || "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const thStyle = { padding: "10px" };
const tdStyle = { padding: "8px" };
const btnStyle = {
    padding: "8px 15px",
    margin: "5px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#1E90FF",
    color: "white",
};
