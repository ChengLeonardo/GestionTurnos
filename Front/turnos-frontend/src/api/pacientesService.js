// src/api/pacientesService.js
import api from "./api";

const API_URL = "/pacientes";

export async function getPacientes() {
  try {
    const res = await api.get(API_URL);
    return res.data;
  } catch (err) {
    throw new Error("Error al obtener pacientes");
  }
}

export async function crearPaciente(data) {
  try {
    const res = await api.post(API_URL, data);
    return res.data;
  } catch (err) {
    throw new Error("Error al crear paciente");
  }
}

export async function editarPaciente(id, paciente) {
  try {
    const res = await api.put(`${API_URL}/${id}`, paciente);
    return res.data;
  } catch (err) {
    throw new Error("Error al editar paciente");
  }
}

export async function eliminarPaciente(id) {
  try {
    await api.delete(`${API_URL}/${id}`);
    return true;
  } catch (err) {
    throw new Error("Error al eliminar paciente");
  }
}
