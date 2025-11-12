import { useState, useContext, useEffect } from "react";
import { TurnosContext } from "../context/Turnos/TurnosContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Reportes() {
  const { turnos, pacientes, profesionales, sedes, especialidades } = useContext(TurnosContext);
  const [filtro, setFiltro] = useState("fecha");

  const generarReporte = () => {
    switch (filtro) {
      case "paciente":
        return pacientes.map(p => ({
          name: p.nombre,
          cantidad: turnos.filter(t => t.IdPaciente === p.id || t.idPaciente === p.id).length
        }));
      case "profesional":
        return profesionales.map(p => ({
          name: p.nombre,
          cantidad: turnos.filter(t => t.IdProfesional === p.id || t.idProfesional === p.id).length
        }));
      case "sede":
        return sedes.map(s => ({
          name: s.nombre,
          cantidad: turnos.filter(t => {
            const prof = profesionales.find(p => p.id === t.IdProfesional || p.id === t.idProfesional);
            return prof && (prof.idSede === s.idSede || prof.IdSede === s.idSede);
          }).length
        }));
      case "especialidad":
        return especialidades.map(e => ({
          name: e.nombre,
          cantidad: turnos.filter(t => {
            const prof = profesionales.find(p => p.id === t.IdProfesional || p.id === t.idProfesional);
            return prof && (prof.idEspecialidad === e.idEspecialidad || prof.IdEspecialidad === e.idEspecialidad);
          }).length
        }));
      case "fecha":
      default:
        {
          const fechas = [...new Set(turnos.map(t => t.fechaHoraInicio ? t.fechaHoraInicio.split("T")[0] : ""))];
          return fechas.filter(f => f).map(f => ({
            name: f,
            cantidad: turnos.filter(t => t.fechaHoraInicio && t.fechaHoraInicio.startsWith(f)).length
          }));
        }
    }
  };

  const data = generarReporte();

  return (
    <div style={{ padding: 20 }}>
      <h1>Reportes de Turnos</h1>

      <label>Filtrar por: </label>
      <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
        <option value="fecha">Fecha</option>
        <option value="paciente">Paciente</option>
        <option value="profesional">Profesional</option>
        <option value="sede">Sede</option>
        <option value="especialidad">Especialidad</option>
      </select>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="cantidad" fill="#1E90FF" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
