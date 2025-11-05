// src/api/profesionalesService.js
import api from "./api";

const API_URL = "/profesionales";

export async function getProfesionales() {
  try {
    const res = await api.get(API_URL);
    return res.data;
  } catch (err) {
    throw new Error("Error al obtener profesionales");
  }
}

export async function crearProfesional(data) {
  try {
    const res = await api.post(API_URL, data);
    return res.data;
  } catch (err) {
    throw new Error("Error al crear profesional");
  }
}

export async function editarProfesional(id, profesional) {
  try {
    // ⚠️ Asegurate de que la ruta correcta sea /profesionales/{id}
    // (sacamos "/Profesional/" porque probablemente tu API usa plural)
    const res = await api.put(`${API_URL}/${id}`, profesional);
    return res.data;
  } catch (err) {
    throw new Error("Error al editar profesional");
  }
}

export async function eliminarProfesional(id) {
  try {
    await api.delete(`${API_URL}/${id}`);
    return true;
  } catch (err) {
    throw new Error("Error al eliminar profesional");
  }
}
