import { useContext, useState, useMemo } from "react";
import { TurnosContext } from "../context/Turnos/TurnosContext";
import { useAuth } from "../context/Auth/useAuth";

export default function Turnos() {
  const {
    turnos,
    profesionales,
    pacientes,
    agendaMedicas,
    crearTurno,
    eliminarTurno,
    editarTurno, // si todavía no existe en el context, podés comentar las partes que lo usan
  } = useContext(TurnosContext);
  const [filtro, setFiltro] = useState({
    sede: "",
    especialidad: "",
    profesional: "",
    diaSemana: "",
    fecha: "",
    agenda: ""
  });

  const agendasFiltradas = useMemo(() => {
    return agendaMedicas
      .filter(a => !filtro.sede || a.idSede == filtro.sede)
      .filter(a => !filtro.especialidad || a.idEspecialidad == filtro.especialidad)
      .filter(a => !filtro.profesional || a.idProfesional == filtro.profesional)
      .filter(a => !filtro.diaSemana || a.diaSemana == filtro.diaSemana)
      .filter(a => {
        if (!filtro.fecha) return true;
        const d = new Date(filtro.fecha);
        const dia = d.getDay() + 1;
        console.log(dia);
        return a.diaSemana == dia;
      })
  }, [agendaMedicas, filtro]);

  const { usuario } = useAuth();

  const [form, setForm] = useState({
    idPaciente: "",
    idProfesional: "",
    fecha: "",
    idAgendaMedica: "",
    nroTurno: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(""); // 🔹 para mostrar errores de validación

  // 🔹 Turnos filtrados según rol
  const turnosFiltrados = useMemo(() => {
    if (!usuario) return [];
    if (usuario.rol === "admin" || usuario.rol === "asistente") {
      return turnos;
    }
    return turnos.filter((t) => Number(t.idPaciente ?? t.IdPaciente) === Number(usuario.idPaciente));
  }, [turnos, usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setForm(prev => ({ ...prev, [name]: value }));
    setFiltro(prev => ({ ...prev, [name]: value }));
    setError("");
    if (name === "fecha") {
      const fechaSeleccionada = new Date(value);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (fechaSeleccionada < hoy && fechaSeleccionada.toDateString() !== hoy.toDateString()) {
        setError("No se pueden sacar turnos para fechas pasadas.");
        return;
      }
      setFiltro({ fecha: value })
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const idPacienteFinal =
      usuario?.rol === "usuario" ? Number(usuario.idPaciente) : Number(form.idPaciente);
    const idAgendaMedicaFinal = agendasFiltradas[0].idAgendaMedica
    const fechaSeleccionada = new Date(form.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fechaSeleccionada < hoy && fechaSeleccionada.toDateString() !== hoy.toDateString()) {
      setError("No se pueden sacar turnos para fechas pasadas.");
      return;
    }
    const turnoExistente = turnos.find(t =>
      t.fecha === form.fecha &&
      Number(t.idAgendaMedica) === Number(idAgendaMedicaFinal) &&
      Number(t.nroTurno) === Number(form.nroTurno) &&
      t.estado !== "Cancelado"
    );

    if (turnoExistente) {
      const idPacienteExistente = turnoExistente.idPaciente ?? turnoExistente.IdPaciente;
      const estadoExistente = turnoExistente.estado;

      if (Number(idPacienteExistente) === Number(idPacienteFinal)) {
        if(estadoExistente === "Solicitado") {
          setError("Tu solicitud ya está en proceso.");
          return;
        } else if (estadoExistente === "Confirmado" || estadoExistente === "Completado") {
          setError("Tu solicitud ya está confirmada.");
          return;
        }
      } else {
        if (estadoExistente === "Solicitado") {
          const confirmar = window.confirm("Ya hay un turno solicitado por otro paciente, ¿desea solicitarlo igual?");
          if (!confirmar) return;
        } else if (estadoExistente === "Confirmado" || estadoExistente === "Completado") {
          setError("Ya hay un turno confirmado por otro paciente, no puede hacer la solicitud.");
          return;
        }
      }
    }

    const payload = {
      idPaciente: idPacienteFinal,
      idProfesional: Number(form.idProfesional),
      idAgendaMedica: Number(idAgendaMedicaFinal),
      fecha: form.fecha,
      nroTurno: form.nroTurno,
    };

    try {
      if (editingId) {
        if (editarTurno) {
          await editarTurno(editingId, payload);
        } else {
          console.warn("editarTurno no está definido en el contexto aún");
        }
        setEditingId(null);
      } else {
        // 🔹 CREAR
        console.log("Creando turno:", JSON.stringify(payload));
        await crearTurno(payload);
      }

      setForm({
        idPaciente: "",
        idProfesional: "",
        idAgendaMedica: "",
        fecha: "",
        nroTurno: "",
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
    const idPaciente = usuario?.rol === "usuario" ? usuario.idPaciente : form.idPaciente;
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

        <label>
          Fecha:
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </label>

        {form.fecha && agendasFiltradas.length === 0 && (
          <div style={{
            marginTop: "5px",
            marginBottom: "10px",
            padding: "8px",
            borderRadius: "5px",
            backgroundColor: "#fff3cd",
            color: "#856404",
            border: "1px solid #ffeeba"
          }}>
            ⚠️ No hay turnos disponibles para esta fecha.
          </div>
        )}

        <select
          value={filtro.sede}
          onChange={(e) => {
            setFiltro({
              ...filtro,
              sede: e.target.value,
            });
          }}
        >
          <option value="">Seleccionar Sede</option>
          {[...new Map(agendasFiltradas.map(a => [a.idSede, a.sede])).values()].map(s => (
            <option key={s.idSede} value={s.idSede}>
              {s.nombre}
            </option>
          ))}
        </select>
        <select
          value={filtro.especialidad}
          onChange={(e) => {
            setFiltro({
              ...filtro,
              especialidad: e.target.value,
            });
          }}
        >
          <option value="">Seleccionar Especialidad</option>
          {[...new Map(agendasFiltradas.map(a => [a.idEspecialidad, a.especialidad])).values()].map(s => (
            <option key={s.idEspecialidad} value={s.idEspecialidad}>{s.nombre}</option>
          ))}
        </select>
        <select
          name="idProfesional"
          value={form.idProfesional}
          onChange={handleChange}
        >
          <option value="">Seleccionar Profesional</option>
          {[...new Map(agendasFiltradas.map(a => [a.idProfesional, a.profesional])).values()].map(s => (
            <option key={s.idProfesional} value={s.idProfesional}>{s.nombre}</option>
          ))}
        </select>
        <select
          value={filtro.diaSemana}
          onChange={(e) => {
            setFiltro({
              ...filtro,
              diaSemana: e.target.value,
            });
          }}
        >
          <option value="">Día de Semana</option>
          {[...new Map(agendasFiltradas.map(a => [a.diaSemana, a.diaSemana])).values()].map(d => (
            <option key={d} value={d}>{d === 1 ? "Lunes" : d === 2 ? "Martes" : d === 3 ? "Miercoles" : d === 4 ? "Jueves" : d === 5 ? "Viernes" : d === 6 ? "Sabado" : d === 7 ? "Domingo" : ""}</option>
          ))}
        </select>



        <label>
          Turno:
          <select name="nroTurno" value={form.nroTurno} onChange={handleChange}>
            <option value="">Seleccionar Turno</option>

            {agendasFiltradas.flatMap((a) => {
              const inicio = a.inicioTurno; // string "HH:mm:ss"
              const [h, m, s] = inicio.split(":").map(Number);
              const baseMinutes = h * 60 + m; // minutos desde las 00:00

              const duracion = a.duracionTurno; // minutos
              const cantidad = a.cantidadTurnos;

              // Crear N turnos
              return Array.from({ length: cantidad }).map((_, i) => {
                const startMinutes = baseMinutes + i * duracion;
                const endMinutes = startMinutes + duracion;

                const start =
                  String(Math.floor(startMinutes / 60)).padStart(2, "0") +
                  ":" +
                  String(startMinutes % 60).padStart(2, "0");

                const end =
                  String(Math.floor(endMinutes / 60)).padStart(2, "0") +
                  ":" +
                  String(endMinutes % 60).padStart(2, "0");

                return (
                  <option
                    key={`${a.idAgendaMedica}-${i}`}
                    value={i}
                  >
                    {start} - {end}
                  </option>
                );
              });
            })}
          </select>
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
                fecha: "",
              });
              setError("");
            }}
          >
            Cancelar Edición
          </button>
        )}

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

      </form>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#1E90FF", color: "white" }}>
            <th style={thStyle}>Paciente</th>
            <th style={thStyle}>Profesional</th>
            <th style={thStyle}>Sede</th>
            <th style={thStyle}>Especialidad</th>
            <th style={thStyle}>Fecha</th>
            <th style={thStyle}>Hora Inicio</th>
            <th style={thStyle}>Hora Fin</th>
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
                  {t.pacienteNombre}
                </td>
                <td>
                  {t.profesionalNombre}
                </td>
                <td>{t.sede}</td>
                <td>{t.especialidad}</td>
                <td>{t.fecha}</td>
                <td>{t.horaInicio}</td>
                <td>{t.horaFin}</td>
                <td>{getEstadoTexto(t.estado)}</td>
                <td>
                  {/* Botones para Asistente y Admin */}
                  {(usuario?.rol === "asistente" || usuario?.rol === "admin") && (
                    <>
                      {t.estado !== "Cancelado" && t.estado !== "Completado" && (
                        <button style={btnStyle} onClick={() => handleEditar(t)}>
                          Editar
                        </button>
                      )}
                      {" "}
                      {t.estado === "Solicitado" && ( // Solicitado
                        <button
                          style={{ ...btnStyle, backgroundColor: "#28a745" }}
                          onClick={() => handleConfirmar(t)}
                        >
                          Confirmar
                        </button>
                      )}
                      {" "}
                      {t.estado === "Confirmado" && ( // Confirmado
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
                  {t.estado !== "Cancelado" && t.estado !== "Completado" && ( // No cancelado ni completado
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
