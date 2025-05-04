const API_URL = "http://localhost:5500";

export async function apiFetch(endpoint, method = "GET", body = null, token = null) {
  const headers = { "Content-Type": "application/json" };

  // Si se proporciona un token, lo incluimos en los encabezados
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  // Si la respuesta no es exitosa, lanzamos un error con el mensaje
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error en la solicitud");
  }

  return await response.json();
}
