import api from "./api";

export async function getAuditLogs() {
    const res = await api.get("/api/audit");
    return res.data;
}
