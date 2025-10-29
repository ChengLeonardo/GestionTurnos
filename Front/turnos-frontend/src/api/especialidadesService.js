// src/api/especialidadsService.js
const API_URL = "http://localhost:5177/especialidades";

export async function getEspecialidades() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener especialidades");
  return res.json();
}


export async function crearEspecialidad(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear especialidad");
  return res.json();
}

export async function editarEspecialidad(id, especialidad) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(especialidad)
  });
  if (!res.ok) throw new Error("Error al editar especialidad");
  return await res.json();
}

export async function eliminarEspecialidad(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar especialidad");
  return true;
}
