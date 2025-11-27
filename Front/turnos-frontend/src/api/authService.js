const API_URL = "http://10.120.1.9:5177/api/Auth";

export async function login(credenciales) {
    const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credenciales),
  });
  if (!res.ok) throw new Error("Error al login");
  const data = await res.json();
  localStorage.setItem("token", data.token);
  return data;
}