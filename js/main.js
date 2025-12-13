const form = document.querySelector(".form-client");
const submitBtn = document.querySelector(".form-client__button--primary");
const message = document.getElementById("formMessage");

form.addEventListener("submit", (e) => {
   e.preventDefault();

   submitBtn.classList.remove("is-success", "is-error");
   message.textContent = "";
   message.className = "form-client__message";

   submitBtn.classList.add("is-loading");

   setTimeout(() => {
      submitBtn.classList.remove("is-loading");

      const success = Math.random() > 0.3;

      if (success) {
         submitBtn.classList.add("is-success");
         message.textContent = "Cliente registrado correctamente ✔";
         message.classList.add("form-client__message--success");
         form.reset();
      } else {
         submitBtn.classList.add("is-error");
         message.textContent = "Error al registrar cliente ❌";
         message.classList.add("form-client__message--error");
      }

      setTimeout(() => {
         submitBtn.classList.remove("is-success", "is-error");
      }, 2000);

   }, 1500);
});
