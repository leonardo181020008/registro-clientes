import {
  obtener_clientes,
  eliminar_cliente,
  actualizar_cliente,
} from "./api.js";

/* =========================
   ELEMENTOS DEL DOM
========================= */
const tbody = document.querySelector(".clients__tbody");
const form = document.getElementById("form-client");

const btnGuardar = document.getElementById("btnGuardar");
const btnActualizar = document.getElementById("btnActualizar");

btnActualizar.disabled = true;

/* =========================
   LISTAR CLIENTES
========================= */
async function cargar_clientes() {
  try {
    const res = await obtener_clientes();

    if (!res.success) {
      console.error(res.message);
      return;
    }

    tbody.innerHTML = "";

    res.data.forEach((cliente) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
            <td>${cliente.id}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.apellido_paterno}</td>
            <td>${cliente.apellido_materno}</td>
            <td>${cliente.email}</td>
            <td>${cliente.telefono}</td>
            <td>${cliente.direccion}</td>
            <td>${cliente.producto}</td>
            <td>${cliente.fecha}</td>
            <td class="clients__actions">
               <div class="clients__actions-wrapper">
                  <button 
                     class="form-client__button btn-editar"
                     data-id="${cliente.id}">
                     Editar
                  </button>

                  <button 
                     class="form-client__button btn-eliminar"
                     data-id="${cliente.id}">
                     Eliminar
                  </button>
               </div>
            </td>
         `;

      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error al cargar clientes:", error);
  }
}

document.addEventListener("DOMContentLoaded", cargar_clientes);
document.addEventListener("cliente-guardado", cargar_clientes);
document.addEventListener("cliente-actualizado", cargar_clientes);
document.addEventListener("cliente-eliminado", cargar_clientes);

/* =========================
   EVENTOS EDITAR / ELIMINAR
========================= */
tbody.addEventListener("click", async (e) => {
  /* ---------- ELIMINAR ---------- */
  if (e.target.classList.contains("btn-eliminar")) {
    const id = e.target.dataset.id;

    if (!confirm("¿Seguro que deseas eliminar este cliente?")) return;

    const res = await eliminar_cliente(id);

    if (res.success) {
      cargar_clientes();
    } else {
      alert(res.message);
    }
  }

  /* ---------- EDITAR ---------- */
  if (e.target.classList.contains("btn-editar")) {
    const fila = e.target.closest("tr");
    const celdas = fila.querySelectorAll("td");

    document.getElementById("nombre").value = celdas[1].textContent;
    document.getElementById("apellido-paterno").value = celdas[2].textContent;
    document.getElementById("apellido-materno").value = celdas[3].textContent;
    document.getElementById("email").value = celdas[4].textContent;
    document.getElementById("telefono").value = celdas[5].textContent;
    document.getElementById("direccion").value = celdas[6].textContent;
    document.getElementById("producto").value = celdas[7].textContent;

    form.dataset.editId = e.target.dataset.id;

    btnGuardar.disabled = true;
    btnActualizar.disabled = false;

    // 🔥 Forzar validaciones al cargar datos
    document.querySelectorAll("input").forEach((input) => {
      input.dispatchEvent(new Event("input"));
    });
  }
});

/* =========================
   ACTUALIZAR CLIENTE
========================= */
btnActualizar.addEventListener("click", async () => {
  const id = form.dataset.editId;
  if (!id) {
    alert("No hay cliente seleccionado");
    return;
  }

  const data = {
    nombre: document.getElementById("nombre").value.trim(),
    apellido_paterno: document.getElementById("apellido-paterno").value.trim(),
    apellido_materno: document.getElementById("apellido-materno").value.trim(),
    email: document.getElementById("email").value.trim(),
    telefono: document.getElementById("telefono").value.trim(),
    direccion: document.getElementById("direccion").value.trim(),
    producto: document.getElementById("producto").value.trim(),
  };

  const res = await actualizar_cliente(id, data);

  if (res.success) {
    cargar_clientes();
    limpiarModoEdicion();
  } else {
    alert(res.message);
  }
});

/* =========================
   SALIR DEL MODO EDICIÓN
========================= */
function limpiarModoEdicion() {
  form.reset();
  delete form.dataset.editId;

  btnActualizar.disabled = true;
  btnGuardar.disabled = true;

  document.querySelectorAll(".valid, .invalid").forEach((el) => {
    el.classList.remove("valid", "invalid");
  });
}
