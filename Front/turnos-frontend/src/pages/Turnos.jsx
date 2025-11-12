import { useContext, useState, useMemo } from "react";
import { TurnosContext } from "../context/Turnos/TurnosContext";
import { useAuth } from "../context/Auth/useAuth";

export default function Turnos() {
  const {
    turnos,
    pacientes,
    profesionales,
    crearTurno,
    eliminarTurno,
    editarTurno, // si todavía no existe en el context, podés comentar las partes que lo usan
  } = useContext(TurnosContext);

  const { usuario } = useAuth();

  const [form, setForm] = useState({
    idPaciente: "",
    idProfesional: "",
    fechaHoraInicio: "",
    fechaHoraFin: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(""); // 🔹 para mostrar errores de validación

  // 🔹 Turnos filtrados según rol
  const turnosFiltrados = useMemo(() => {
    if (!usuario) return [];
    if (usuario.rol === "admin" || usuario.rol === "asistente") {
      return turnos;
    }
    return turnos.filter((t) => Number(t.idPaciente ?? t.IdPaciente) === Number(usuario.id));
  }, [turnos, usuario]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // limpiar error al cambiar algo
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔹 Validaciones de fecha
    const inicio = new Date(form.fechaHoraInicio);
    const fin = new Date(form.fechaHoraFin);
    const ahora = new Date();

    // Normalizar "hoy" a minutos (para evitar problemas de segundos/ms)
    const hoy = new Date(
      ahora.getFullYear(),
      ahora.getMonth(),
      ahora.getDate(),
      ahora.getHours(),
      ahora.getMinutes(),
      0,
      0
    );

    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
      setError("Las fechas no son válidas.");
      return;
    }

    if (inicio < hoy || fin < hoy) {
      setError("Las fechas de inicio y fin no pueden ser anteriores a hoy.");
      return;
    }

    if (fin < inicio) {
      setError("La fecha/hora de fin no puede ser anterior a la de inicio.");
      return;
    }

    // Si es usuario normal, forzamos su propio IdPaciente
    const idPacienteFinal =
      usuario?.rol === "usuario" ? Number(usuario.id) : Number(form.idPaciente);

    const payload = {
      idPaciente: idPacienteFinal,
      idProfesional: Number(form.idProfesional),
      fechaHoraInicio: form.fechaHoraInicio,
      fechaHoraFin: form.fechaHoraFin,
    };

    try {
      if (editingId) {
        // 🔹 EDITAR (si tenés endpoint + función en el context)
        if (editarTurno) {
          await editarTurno(editingId, payload);
        } else {
          console.warn("editarTurno no está definido en el contexto aún");
        }
        setEditingId(null);
      } else {
        // 🔹 CREAR
        console.log("Creando turno:", payload);
        await crearTurno(payload);
      }

      setForm({
        idPaciente: "",
        idProfesional: "",
        fechaHoraInicio: "",
        fechaHoraFin: "",
      });
      setError("");
    } catch (err) {
      console.error("Error guardando turno:", err);
      setError("Ocurrió un error al guardar el turno.");
    }
  };

  const handleCancelar = async (idTurno) => {
    if (!window.confirm("¿Seguro que deseas cancelar este turno?")) return;
    await eliminarTurno(idTurno);
  };

  const handleConfirmar = async (turno) => {
    const idTurno = turno.id ?? turno.idTurno ?? turno.IdTurno;
    try {
      await editarTurno(idTurno, { ...turno, estado: 1 }); // 1 = Confirmado
    } catch (err) {
      console.error("Error al confirmar turno:", err);
    }
  };

  const handleCompletar = async (turno) => {
    const idTurno = turno.id ?? turno.idTurno ?? turno.IdTurno;
    try {
      await editarTurno(idTurno, { ...turno, estado: 3 }); // 3 = Completado
    } catch (err) {
      console.error("Error al completar turno:", err);
    }
  };

  const handleEditar = (t) => {
    setForm({
      idPaciente: t.idPaciente ?? t.IdPaciente,
      idProfesional: t.idProfesional ?? t.IdProfesional,
      fechaHoraInicio: t.fechaHoraInicio,
      fechaHoraFin: t.fechaHoraFin,
    });
    setEditingId(t.id ?? t.idTurno ?? t.IdTurno);
    setError("");
  };

  const handleSubirOrden = async () => {
    const idPaciente = usuario?.rol === "usuario" ? usuario.id : form.idPaciente;
    if (!idPaciente) {
      alert("Seleccione un paciente primero");
      return;
    }

    // Mock upload - in real app would be a file upload
    // Here we just create an Orden record
    try {
      const res = await fetch("http://localhost:5177/api/ordenes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idPaciente: Number(idPaciente),
          practica: "Kinesiologia" // Default for now, or get from selected professional's specialty
        })
      });

      if (res.ok) {
        alert("Orden subida correctamente. Espere a que sea autorizada.");
      } else {
        alert("Error al subir orden.");
      }
    } catch (err) {
      console.error(err);
      alert("Error de red.");
    }
  };

  const getPacienteNombre = (idPaciente) => {
    const p = pacientes.find(
      (x) => x.id === idPaciente || x.idPaciente === idPaciente
    );
    return p?.nombre || "-";
  };

  const getProfesionalNombre = (idProfesional) => {
    const p = profesionales.find(
      (x) => x.id === idProfesional || x.idProfesional === idProfesional
    );
    return p?.nombre || "-";
  };

  const getEstadoTexto = (estado) => {
    // por si en el back es un número (enum)
    if (estado === 0 || estado === "Solicitado") return "Solicitado";
    if (estado === 1 || estado === "Confirmado") return "Confirmado";
    if (estado === 2 || estado === "Cancelado") return "Cancelado";
    if (estado === 3 || estado === "Completado") return "Completado";
    return estado ?? "-";
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Gestión de Turnos</h1>

      {error && (
        <div
          style={{
            marginBottom: "10px",
            padding: "8px",
            borderRadius: "5px",
            backgroundColor: "#ffdddd",
            color: "#a10000",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        {(usuario?.rol === "admin" || usuario?.rol === "asistente") ? (
          <select
            name="idPaciente"
            value={form.idPaciente}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">Seleccionar Paciente</option>
            {pacientes.map((p) => (
              <option key={p.id ?? p.idPaciente} value={p.id ?? p.idPaciente}>
                {p.nombre}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="hidden"
            name="idPaciente"
            value={usuario?.id ?? ""}
            readOnly
          />
        )}

        <select
          name="idProfesional"
          value={form.idProfesional}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="">Seleccionar Profesional</option>
          {profesionales.map((p) => (
            <option
              key={p.id ?? p.idProfesional}
              value={p.id ?? p.idProfesional}
            >
              {p.nombre} - {p.especialidad}
            </option>
          ))}
        </select>

        {/* Validation Message for Kinesiologia */}
        {form.idProfesional && profesionales.find(p => (p.id == form.idProfesional || p.idProfesional == form.idProfesional))?.especialidad?.toLowerCase().includes("kinesiologia") && (
          <div style={{ margin: "10px 0", padding: "10px", backgroundColor: "#e6f7ff", border: "1px solid #91d5ff", borderRadius: "4px" }}>
            <strong>Nota:</strong> Para esta especialidad se requiere una orden médica autorizada.
            <br />
            <button type="button" style={{ ...btnStyle, backgroundColor: "#28a745", marginTop: "5px" }} onClick={() => handleSubirOrden()}>
              Subir Orden Médica
            </button>
          </div>
        )}

        <label>
          Fecha Inicio:
          <input
            type="datetime-local"
            name="fechaHoraInicio"
            value={form.fechaHoraInicio}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </label>

        <label>
          Fecha Fin:
          <input
            type="datetime-local"
            name="fechaHoraFin"
            value={form.fechaHoraFin}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </label>

        <button type="submit" style={btnStyle}>
          {editingId
            ? "Actualizar Turno"
            : usuario?.rol === "usuario"
              ? "Sacar Turno"
              : "Crear Turno"}
        </button>

        {editingId && (
          <button
            type="button"
            style={{ ...btnStyle, backgroundColor: "#FF4C4C" }}
            onClick={() => {
              setEditingId(null);
              setForm({
                idPaciente: "",
                idProfesional: "",
                fechaHoraInicio: "",
                fechaHoraFin: "",
              });
              setError("");
            }}
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
            <th style={thStyle}>Estado</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>

          {turnosFiltrados.map((t) => {
            const idTurno = t.id ?? t.idTurno ?? t.IdTurno;
            const idPaciente = t.idPaciente ?? t.IdPaciente;
            const idProfesional = t.idProfesional ?? t.IdProfesional;

            return (
              <tr
                key={idTurno}
                style={{
                  textAlign: "center",
                  borderBottom: "1px solid #ccc",
                }}
              >
                <td>
                  {t.pacienteNombre || getPacienteNombre(Number(idPaciente))}
                </td>
                <td>
                  {t.profesionalNombre ||
                    getProfesionalNombre(Number(idProfesional))}
                </td>
                <td>{t.fechaHoraInicio}</td>
                <td>{t.fechaHoraFin}</td>
                <td>{getEstadoTexto(t.estado)}</td>
                <td>
                  {/* Botones para Asistente y Admin */}
                  {(usuario?.rol === "asistente" || usuario?.rol === "admin") && (
                    <>
                      <button style={btnStyle} onClick={() => handleEditar(t)}>
                        Editar
                      </button>
                      {" "}
                      {t.estado === 0 && ( // Solicitado
                        <button
                          style={{ ...btnStyle, backgroundColor: "#28a745" }}
                          onClick={() => handleConfirmar(t)}
                        >
                          Confirmar
                        </button>
                      )}
                      {" "}
                      {t.estado === 1 && ( // Confirmado
                        <button
                          style={{ ...btnStyle, backgroundColor: "#17a2b8" }}
                          onClick={() => handleCompletar(t)}
                        >
                          Completar
                        </button>
                      )}
                      {" "}
                    </>
                  )}
                  {/* Botón Cancelar para todos */}
                  {t.estado !== 2 && t.estado !== 3 && ( // No cancelado ni completado
                    <button
                      style={{ ...btnStyle, backgroundColor: "#FF4C4C" }}
                      onClick={() => handleCancelar(idTurno)}
                    >
                      Cancelar
                    </button>
                  )}
                </td>
              </tr>
            );
          })}

          {turnosFiltrados.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "10px" }}>
                No hay turnos para mostrar.
              </td>
            </tr>
          )}
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
  border: "1px solid " + "#ccc",
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
