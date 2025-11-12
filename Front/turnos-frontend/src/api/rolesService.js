import api from "./api";

export async function getRoles() {
    const res = await api.get("/api/roles");
    return res.data;
}

export async function getRole(id) {
    const res = await api.get(`/api/roles/${id}`);
    return res.data;
}

export async function crearRole(role) {
    const res = await api.post("/api/roles", role);
    return res.data;
}

export async function editarRole(id, role) {
    const res = await api.put(`/api/roles/${id}`, role);
    return res.data;
}

export async function eliminarRole(id) {
    await api.delete(`/api/roles/${id}`);
}
