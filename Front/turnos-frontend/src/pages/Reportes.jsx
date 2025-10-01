import { useState, useContext } from "react";
import { TurnosContext } from "../context/TurnosContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Reportes() {
  const { turnos, pacientes, profesionales } = useContext(TurnosContext);
  const [filtro, setFiltro] = useState("fecha");

  const generarReporte = () => {
    switch(filtro) {
      case "paciente":
        return pacientes.map(p => ({
          name: p.nombre,
          cantidad: turnos.filter(t => t.pacienteId === p.id).length
        }));
      case "profesional":
        return profesionales.map(p => ({
          name: p.nombre,
          cantidad: turnos.filter(t => t.profesionalId === p.id).length
        }));
      case "fecha":
      default:
        { const fechas = [...new Set(turnos.map(t => t.fecha))];
        return fechas.map(f => ({
          name: f,
          cantidad: turnos.filter(t => t.fecha === f).length
        })); }
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
