import { useContext, useState } from "react";
import { TurnosContext } from "../context/Turnos/TurnosContext";
import { useAuth } from "../context/Auth/useAuth";

export default function AgendaMedicas() {
    const { usuario } = useAuth();
    const { agendaMedicas, profesionales, especialidades, sedes, crearAgendaMedica, editarAgendaMedica, eliminarAgendaMedica, loading } =
        useContext(TurnosContext);

    const [form, setForm] = useState({ idProfesional: "", idEspecialidad: "", idSede: "", diaSemana: "", inicioTurno: "", finTurno: "", duracionTurno: "", cantidadTurnos: "" });
    const [editandoId, setEditandoId] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedForm = { ...form, [name]: value };

        if (name === "inicioTurno" || name === "duracionTurno" || name === "cantidadTurnos") {
            const inicio = updatedForm.inicioTurno;
            const duracion = updatedForm.duracionTurno;
            const cantidad = updatedForm.cantidadTurnos;

            if (inicio && duracion && cantidad) {
                const [horas, minutos] = inicio.split(":").map(Number);
                const totalMinutos = horas * 60 + minutos + (parseInt(duracion) * parseInt(cantidad));
                const nuevaHora = Math.floor(totalMinutos / 60) % 24;
                const nuevosMinutos = totalMinutos % 60;
                updatedForm.finTurno = `${nuevaHora.toString().padStart(2, "0")}:${nuevosMinutos.toString().padStart(2, "0")}:00`;
            }
        }
        if (name === "diaSemana") {
            updatedForm.diaSemana = Number(value);
        }
        if (name === "inicioTurno") {
            setForm({
                ...form,
                [name]: value + ":00" // agrega segundos
            });
            return;
        }
        setForm(updatedForm);
    };

    async function handleSubmit(e) {
        e.preventDefault();
        console.log(JSON.stringify(form));
        try {
            if (editandoId) {
                await editarAgendaMedica(editandoId, form);
                setEditandoId(null);
            } else {
                await crearAgendaMedica(form);
            }
            setForm({ idProfesional: "", idEspecialidad: "", idSede: "", diaSemana: "", inicioTurno: "", finTurno: "", duracionTurno: "", cantidadTurnos: "" });
        } catch (error) {
            console.error("Error guardando agendaMedica:", error);
        }
    }

    async function handleEliminar(id) {
        if (!confirm("¿Seguro que deseas eliminar esta agendaMedica?")) return;
        await eliminarAgendaMedica(id);
    }

    function handleEditar(agendaMedica) {
        setForm({ idProfesional: agendaMedica.idProfesional, idEspecialidad: agendaMedica.idEspecialidad, idSede: agendaMedica.idSede, diaSemana: agendaMedica.diaSemana, inicioTurno: agendaMedica.inicioTurno, finTurno: agendaMedica.finTurno, duracionTurno: agendaMedica.duracionTurno, cantidadTurnos: agendaMedica.cantidadTurnos });
        setEditandoId(agendaMedica.idAgendaMedica);
    }

    if (loading) return <p>Cargando agendaMedicas...</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h1>Gestión de AgendaMedicas</h1>

            {/* Formulario solo para Admin */}
            {usuario?.rol === "admin" && (
                <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
                    <div className="row row-cols-1 row-cols-sm-3 row-cols-md-5">
                        <select
                            name="idProfesional"
                            value={form.idProfesional}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        >
                            <option value="">Seleccionar Profesional</option>
                            {profesionales.map((p) => (
                                <option key={p.id ?? p.idProfesional} value={p.id ?? p.idProfesional}>
                                    {p.nombre}
                                </option>
                            ))}
                        </select>
                        <select
                            name="idEspecialidad"
                            value={form.idEspecialidad}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        >
                            <option value="">Seleccionar Especialidad</option>
                            {especialidades.map((e) => (
                                <option key={e.id ?? e.idEspecialidad} value={e.id ?? e.idEspecialidad}>
                                    {e.nombre}
                                </option>
                            ))}
                        </select>
                        <select
                            name="idSede"
                            value={form.idSede}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        >
                            <option value="">Seleccionar Sede</option>
                            {sedes.map((s) => (
                                <option key={s.id ?? s.idSede} value={s.id ?? s.idSede}>
                                    {s.nombre}
                                </option>
                            ))}
                        </select>
                        <select
                            name="diaSemana"
                            value={form.diaSemana}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        >
                            <option value="">Seleccionar Dia de la semana</option>
                            <option value="1">Lunes</option>
                            <option value="2">Martes</option>
                            <option value="3">Miercoles</option>
                            <option value="4">Jueves</option>
                            <option value="5">Viernes</option>
                            <option value="6">Sabado</option>
                            <option value="7">Domingo</option>
                        </select>
                        <label>Hora de inicio</label>
                        <input
                            type="time"
                            name="inicioTurno"
                            placeholder="Hora de inicio"
                            value={form.inicioTurno}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                        <label>Hora de fin</label>
                        <input
                            disabled
                            type="time"
                            name="finTurno"
                            placeholder="Hora de fin"
                            value={form.finTurno}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                        <input
                            type="number"
                            name="duracionTurno"
                            placeholder="Duracion del turno"
                            value={form.duracionTurno}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                        <input
                            type="number"
                            name="cantidadTurnos"
                            placeholder="Cantidad de turnos"
                            value={form.cantidadTurnos}
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
                                    setForm({ idProfesional: "", idEspecialidad: "", idSede: "", diaSemana: "", inicioTurno: "", finTurno: "", duracionTurno: "", cantidadTurnos: "" });
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
                            <th style={thStyle}>Profesional</th>
                            <th style={thStyle}>Especialidad</th>
                            <th style={thStyle}>Sede</th>
                            <th style={thStyle}>Dia de la semana</th>
                            <th style={thStyle}>Hora de inicio</th>
                            <th style={thStyle}>Hora de fin</th>
                            <th style={thStyle}>Duracion del turno</th>
                            <th style={thStyle}>Cantidad de turnos</th>
                            {usuario?.rol === "admin" && <th style={thStyle}>Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {agendaMedicas.map((e) => (
                            <tr key={e.idAgendaMedica} style={{ textAlign: "center", borderBottom: "1px solid #ccc" }}>
                                <td>{e.profesional.nombre}</td>
                                <td>{e.especialidad.nombre}</td>
                                <td>{e.sede.nombre}</td>
                                <td>{e.diaSemana === 1 ? "Lunes" : e.diaSemana === 2 ? "Martes" : e.diaSemana === 3 ? "Miercoles" : e.diaSemana === 4 ? "Jueves" : e.diaSemana === 5 ? "Viernes" : e.diaSemana === 6 ? "Sabado" : "Domingo"}</td>
                                <td>{e.inicioTurno}</td>
                                <td>{e.finTurno}</td>
                                <td>{e.duracionTurno}</td>
                                <td>{e.cantidadTurnos}</td>
                                <td>
                                    {usuario?.rol === "admin" && (
                                        <>
                                            <button style={btnStyle} onClick={() => handleEditar(e)}>
                                                Editar
                                            </button>{" "}
                                            <button
                                                style={{ ...btnStyle, backgroundColor: "#FF4C4C" }}
                                                onClick={() => handleEliminar(e.idAgendaMedica)}
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
