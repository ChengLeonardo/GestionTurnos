// src/api/profesionalsService.js
const API_URL = "http://localhost:5177/profesionales";

export async function getProfesionales() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener profesionales");
  return res.json();
}

export async function crearProfesional(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear profesional");
  return res.json();
}

export async function editarProfesional(id, profesional) {
  const res = await fetch(`${API_URL}/Profesional/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profesional)
  });
  if (!res.ok) throw new Error("Error al editar profesional");
  return await res.json();
}


export async function eliminarProfesional(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar profesional");
  return true;
}
