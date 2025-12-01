import api from "./api";

const API_URL = "/api/agendaMedicas";

export async function getAgendaMedicas() {
    const response = await api.get(API_URL);
    return response.data;
}
export async function getAgendaMedicaById(id) {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
}
export async function crearAgendaMedica(agendaMedica) {
    const response = await api.post(API_URL, agendaMedica);
    return response.data;
}
export async function editarAgendaMedica(id, agendaMedica) {
    const response = await api.put(`${API_URL}/${id}`, agendaMedica);
    return response.data;
}
export async function eliminarAgendaMedica(id) {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
}
