// src/api/pacientesService.js
const API_URL = "http://localhost:5177/pacientes";

export async function getPacientes() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener pacientes");
  return res.json();
}

export async function crearPaciente(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear paciente");
  return res.json();
}

export async function editarPaciente(id, paciente) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paciente),
  });
  if (!res.ok) throw new Error("Error al editar paciente");
  return res.json();
}

export async function eliminarPaciente(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar paciente");
  return true;
}
