/* =========================
   IMPORTAR API
========================= */
import { guardar_cliente } from "./api.js";

/* =========================
   ELEMENTOS DEL DOM
========================= */
const form = document.getElementById("form-client");
const submitBtn = document.getElementById("btnGuardar");
const message = document.getElementById("formMessage");

submitBtn.disabled = true;

/* =========================
   FUNCIONES DE UI
========================= */
function marcar_error(input, error, mensaje) {
  input.classList.add("invalid");
  input.classList.remove("valid");
  error.textContent = mensaje;
}

function marcar_valido(input, error) {
  input.classList.remove("invalid");
  input.classList.add("valid");
  error.textContent = "";
}

/* =========================
   VALIDACIONES
========================= */
function validar_texto(id_input, id_error) {
  const input = document.getElementById(id_input);
  const error = document.getElementById(id_error);
  const valor = input.value.trim();
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;

  if (valor === "") {
    marcar_error(input, error, "Campo Obligatorio");
    return false;
  }

  if (!regex.test(valor)) {
    marcar_error(input, error, "Solo Letras");
    return false;
  }

  marcar_valido(input, error);
  return true;
}

function validar_email() {
  const input = document.getElementById("email");
  const error = document.getElementById("error-email");
  const valor = input.value.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (valor === "") {
    marcar_error(input, error, "Campo Obligatorio");
    return false;
  }

  if (!regex.test(valor)) {
    marcar_error(input, error, "Email Inválido");
    return false;
  }

  marcar_valido(input, error);
  return true;
}

function validar_telefono() {
  const input = document.getElementById("telefono");
  const error = document.getElementById("error-telefono");
  const valor = input.value.trim();
  const regexFlexible =
    /^(\+\d{1,3}[\s-]?)?(\(\d{1,4}\)[\s-]?)?(\d[\s-]?){6,19}\d$/;

  if (valor === "") {
    marcar_error(input, error, "Campo Obligatorio");
    return false;
  }

  if (!regexFlexible.test(valor)) {
    marcar_error(input, error, "Formato de teléfono inválido");
    return false;
  }

  marcar_valido(input, error);
  return true;
}

function validar_direccion() {
  const input = document.getElementById("direccion");
  const error = document.getElementById("error-direccion");
  const valor = input.value.trim();

  if (valor === "") {
    marcar_error(input, error, "Campo Obligatorio");
    return false;
  }

  marcar_valido(input, error);
  return true;
}

/* =========================
   VALIDAR FORMULARIO COMPLETO
========================= */
function validar_formulario_completo() {
  const validaciones = [
    validar_texto("nombre", "error-nombre"),
    validar_texto("apellido-paterno", "error-apellido-paterno"),
    validar_texto("apellido-materno", "error-apellido-materno"),
    validar_email(),
    validar_telefono(),
    validar_direccion(),
    validar_texto("producto", "error-producto"),
  ];

  submitBtn.disabled = validaciones.includes(false);
  return !validaciones.includes(false);
}

/* =========================
   EVENTOS INPUT
========================= */
[
  "nombre",
  "apellido-paterno",
  "apellido-materno",
  "email",
  "telefono",
  "direccion",
  "producto",
].forEach((id) => {
  document
    .getElementById(id)
    .addEventListener("input", validar_formulario_completo);
});

/* =========================
   SUBMIT FORMULARIO
========================= */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (submitBtn.disabled) return;

  if (!validar_formulario_completo()) {
    message.textContent = "Corrige los campos marcados en rojo";
    message.className = "form-client__message form-client__message--error";
    message.style.opacity = 1;
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

  submitBtn.classList.add("is-loading");

  try {
    const res = await guardar_cliente(data);

    submitBtn.classList.remove("is-loading");

    if (!res.success) {
      message.textContent = res.message;
      message.className = "form-client__message form-client__message--error";
      message.style.opacity = 1;
      return;
    }

    submitBtn.classList.add("is-success");
    message.textContent = "Cliente registrado correctamente ✅";
    message.className = "form-client__message form-client__message--success";
    message.style.opacity = 1;
    document.dispatchEvent(new Event("cliente-guardado"));

    form.reset();
    submitBtn.disabled = true;

    document.querySelectorAll(".valid, .invalid").forEach((el) => {
      el.classList.remove("valid", "invalid");
    });

    setTimeout(() => {
      submitBtn.classList.remove("is-success");
      message.style.opacity = 0;
    }, 2500);
  } catch (error) {
    submitBtn.classList.remove("is-loading");
    message.textContent = "Error al conectar con el servidor";
    message.className = "form-client__message form-client__message--error";
    message.style.opacity = 1;
  }
});
