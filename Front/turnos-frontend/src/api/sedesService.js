// src/api/turnosService.js
const API_URL = "http://localhost:5177/sedes";

export async function getSedes() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener sedes");
  return res.json();
}

export async function crearSede(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear sede");
  return res.json();
}

export async function editarSede(id, sede) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sede)
  });
  if (!res.ok) throw new Error("Error al editar sede");
  return await res.json();
}

export async function eliminarSede(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar sede");
  return true;
}
