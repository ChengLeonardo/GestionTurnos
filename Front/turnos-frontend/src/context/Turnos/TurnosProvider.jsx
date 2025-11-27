import { createContext, useState, useEffect } from "react";
import * as TurnosService from "../../api/turnosService";
import * as EspecialidadesService from "../../api/especialidadesService";
import * as PacientesService from "../../api/pacientesService";
import * as ProfesionalesService from "../../api/profesionalesService";
import * as SedesService from "../../api/sedesService";
import { TurnosContext } from "./TurnosContext";

export function TurnosProvider({ children }) {
  const [pacientes, setPacientes] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    await Promise.all([
      fetchTurnos(),
      fetchPacientes(),
      fetchProfesionales(),
      fetchEspecialidades(),
      fetchSedes(),
    ]);
  }

  // ───────────────────────────────
  // 🔹 FETCHERS
  // ───────────────────────────────
  async function fetchTurnos() {
    try {
      const data = await TurnosService.getTurnos();
      setTurnos(data);
    } catch (err) {
      console.error("Error cargando turnos:", err);
    }
  }

  async function fetchPacientes() {
    try {
      const data = await PacientesService.getPacientes();
      setPacientes(data);
    } catch (err) {
      console.error("Error cargando pacientes:", err);
    }
  }

  async function fetchProfesionales() {
    try {
      setLoading(true);
      const data = await ProfesionalesService.getProfesionales();
      setProfesionales(data);
    } catch (err) {
      console.error("Error cargando profesionales:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSedes() {
    try {
      const data = await SedesService.getSedes();
      setSedes(data);
    } catch (err) {
      console.error("Error cargando sedes:", err);
    }
  }

  async function fetchEspecialidades() {
    try {
      const data = await EspecialidadesService.getEspecialidades();
      setEspecialidades(data);
    } catch (err) {
      console.error("Error cargando especialidades:", err);
    }
  }

  // ───────────────────────────────
  // 🔹 CREAR
  // ───────────────────────────────
  async function crearTurno(turno) {
    const nuevo = await TurnosService.crearTurno(turno);
    setTurnos((prev) => [...prev, nuevo]);
  }

  async function crearEspecialidad(especialidad) {
    const nuevo = await EspecialidadesService.crearEspecialidad(especialidad);
    setEspecialidades((prev) => [...prev, nuevo]);
  }

  async function crearPaciente(paciente) {
    const nuevo = await PacientesService.crearPaciente(paciente);
    setPacientes((prev) => [...prev, nuevo]);
  }

  async function crearProfesional(profesional) {
    const nuevo = await ProfesionalesService.crearProfesional(profesional);
    setProfesionales((prev) => [...prev, nuevo]);
  }

  async function crearSede(sede) {
    const nuevo = await SedesService.crearSede(sede);
    setSedes((prev) => [...prev, nuevo]);
  }

  // ───────────────────────────────
  // 🔹 ELIMINAR
  // ───────────────────────────────
  async function eliminarTurno(id) {
    await TurnosService.eliminarTurno(id);
    console.log(turnos);
    setTurnos((prev) => prev.filter((t) => t.idTurno !== id));
  }

  async function eliminarPaciente(id) {
    await PacientesService.eliminarPaciente(id);
    setPacientes((prev) => prev.filter((p) => p.idPaciente !== id));
  }

  async function eliminarProfesional(id) {
    await ProfesionalesService.eliminarProfesional(id);
    setProfesionales((prev) => prev.filter((p) => p.idProfesional !== id));
  }

  async function eliminarSede(id) {
    await SedesService.eliminarSede(id);
    setSedes((prev) => prev.filter((s) => s.idSede !== id));
  }

  async function eliminarEspecialidad(id) {
    await EspecialidadesService.eliminarEspecialidad(id);
    setEspecialidades((prev) => prev.filter((e) => e.idEspecialidad !== id));
  }

  async function editarPaciente(id, paciente) {
    const actualizado = await PacientesService.editarPaciente(id, paciente);
    setPacientes((prev) =>
      prev.map((p) => (p.idPaciente === id ? actualizado : p))
    );
  }

  async function editarSede(id, sede) {
    const actualizada = await SedesService.editarSede(id, sede);
    setSedes((prev) =>
      prev.map((s) => (s.idSede === id ? actualizada : s))
    );
  }

  async function editarProfesional(id, profesional) {
    const actualizada = await ProfesionalesService.editarProfesional(id, profesional);
    setProfesionales((prev) =>
      prev.map((p) => (p.idProfesional === id ? actualizada : p))
    );
  }

  async function editarEspecialidad(id, especialidad) {
    const actualizada = await EspecialidadesService.editarEspecialidad(id, especialidad);
    setEspecialidades((prev) =>
      prev.map((e) => (e.idEspecialidad === id ? actualizada : e))
    );
  }

  async function editarTurno(id, turno) {
    const actualizado = await TurnosService.editarTurno(id, turno);
    setTurnos((prev) =>
      prev.map((t) => (t.idTurno === id || t.id === id ? actualizado : t))
    );
  }
  // ───────────────────────────────
  // 🔹 EXPORTAR FUNCIONES Y ESTADO
  // ───────────────────────────────
  return (
    <TurnosContext.Provider
      value={{
        loading,
        pacientes,
        profesionales,
        turnos,
        sedes,
        especialidades,
        fetchTurnos,
        fetchPacientes,
        fetchProfesionales,
        fetchSedes,
        fetchEspecialidades,
        crearTurno,
        crearPaciente,
        crearProfesional,
        crearSede,
        crearEspecialidad,
        eliminarTurno,
        eliminarPaciente,
        eliminarProfesional,
        eliminarSede,
        eliminarEspecialidad,
        editarPaciente,
        editarSede,
        editarProfesional,
        editarEspecialidad,
        editarTurno,
      }}
    >
      {children}
    </TurnosContext.Provider>
  );
}
