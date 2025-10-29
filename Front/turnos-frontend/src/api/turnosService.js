// src/api/turnosService.js
const API_URL = "http://localhost:5177/turnos";

export async function getTurnos() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener turnos");
  return res.json();
}

export async function crearTurno(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear turno");
  return res.json();
}

export async function eliminarTurno(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar turno");
  return true;
}
