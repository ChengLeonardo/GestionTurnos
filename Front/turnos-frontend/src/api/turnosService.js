// src/api/turnosService.js
import api from "./api";

const API_URL = "/turnos";

export async function getTurnos() {
  try {
    const res = await api.get(API_URL);
    return res.data;
  } catch (err) {
    throw new Error("Error al obtener turnos");
  }
}

export async function crearTurno(data) {
  try {
    const res = await api.post(API_URL, data);
    return res.data;
  } catch (err) {
    throw new Error("Error al crear turno");
  }
}

export async function eliminarTurno(id) {
  try {
    await api.delete(`${API_URL}/${id}`);
    return true;
  } catch (err) {
    throw new Error("Error al eliminar turno");
  }
}

export async function editarTurno(id, data) {
  try {
    const res = await api.put(`${API_URL}/${id}`, data);
    return res.data;
  } catch (err) {
    throw new Error("Error al editar turno");
  }
}
