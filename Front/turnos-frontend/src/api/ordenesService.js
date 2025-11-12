import api from "./api";

export async function getOrdenes() {
    const res = await api.get("/api/ordenes");
    return res.data;
}

export async function getOrden(id) {
    const res = await api.get(`/api/ordenes/${id}`);
    return res.data;
}

export async function crearOrden(orden) {
    const res = await api.post("/api/ordenes", orden);
    return res.data;
}

export async function editarOrden(id, orden) {
    const res = await api.put(`/api/ordenes/${id}`, orden);
    return res.data;
}

export async function eliminarOrden(id) {
    await api.delete(`/api/ordenes/${id}`);
}
