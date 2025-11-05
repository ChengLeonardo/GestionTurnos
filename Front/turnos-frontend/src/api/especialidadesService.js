// especialidadesService.js
import api from "./api";

const API_URL = "/especialidades";

export async function getEspecialidades() {
  try {
    const res = await api.get(API_URL);
    return res.data;
  } catch (err) {
    throw new Error("Error al obtener especialidades");
  }
}

export async function crearEspecialidad(data) {
  try {
    const res = await api.post(API_URL, data);
    return res.data;
  } catch (err) {
    throw new Error("Error al crear especialidad");
  }
}

export async function editarEspecialidad(id, especialidad) {
  try {
    const res = await api.put(`${API_URL}/${id}`, especialidad);
    return res.data;
  } catch (err) {
    throw new Error("Error al editar especialidad");
  }
}

export async function eliminarEspecialidad(id) {
  try {
    await api.delete(`${API_URL}/${id}`);
    return true;
  } catch (err) {
    throw new Error("Error al eliminar especialidad");
  }
}
