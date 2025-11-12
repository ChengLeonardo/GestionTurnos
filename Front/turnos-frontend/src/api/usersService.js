import api from "./api";

export async function getUsers() {
    const res = await api.get("/api/users");
    return res.data;
}

export async function getUser(id) {
    const res = await api.get(`/api/users/${id}`);
    return res.data;
}

export async function crearUser(user) {
    const res = await api.post("/api/users", user);
    return res.data;
}

export async function editarUser(id, user) {
    const res = await api.put(`/api/users/${id}`, user);
    return res.data;
}

export async function eliminarUser(id) {
    await api.delete(`/api/users/${id}`);
}
