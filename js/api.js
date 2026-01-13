const API_URL = "http://localhost:8000/api/api.php";

export async function obtener_clientes() {
  const res = await fetch(`${API_URL}?action=listar`);
  return await res.json();
}

export async function guardar_cliente(data) {
  const res = await fetch(`${API_URL}?action=crear`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function eliminar_cliente(id) {
  const res = await fetch(`${API_URL}?action=eliminar&id=${id}`, {
    method: "DELETE",
  });
  return await res.json();
}

export async function actualizar_cliente(id, data) {
  const res = await fetch(`${API_URL}?action=actualizar&id=${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  S;
  return await res.json();
}
