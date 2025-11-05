// src/api/turnosService.js
import api from "./api";

const API_URL = "/sedes";

export async function getSedes() {
  try {
    const res = await api.get(API_URL);
    return res.data;
  } catch (err) {
    throw new Error("Error al obtener sedes");
  }
}

export async function crearSede(data) {
  try {
    const res = await api.post(API_URL, data);
    return res.data;
  } catch (err) {
    throw new Error("Error al crear sede");
  }
}

export async function editarSede(id, sede) {
  try {
    const res = await api.put(`${API_URL}/${id}`, sede);
    return res.data;
  } catch (err) {
    throw new Error("Error al editar sede");
  }
}

export async function eliminarSede(id) {
  try {
    await api.delete(`${API_URL}/${id}`);
    return true;
  } catch (err) {
    throw new Error("Error al eliminar sede");
  }
}
