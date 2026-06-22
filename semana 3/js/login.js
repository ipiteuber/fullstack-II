(function () {
  "use strict";

  const A = window.LinkStartAuth;
  const V = window.LinkStartValid;

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("login-form");
    if (!form) return;

    const usuario = document.getElementById("usuario");
    const password = document.getElementById("password");
    const exito = document.getElementById("form-success");
    const btnLimpiar = document.getElementById("btn-limpiar");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let ok = true;

      if (V.vacio(usuario.value)) { marcar("usuario", "Ingresa tu usuario o correo."); ok = false; }
      else limpiar("usuario");

      if (V.vacio(password.value)) { marcar("password", "Ingresa tu contraseña."); ok = false; }
      else limpiar("password");

      if (!ok) return;

      const res = A.login(usuario.value.trim(), password.value);
      if (!res.ok) {
        mensaje(res.error, false);
        return;
      }

      mensaje("Bienvenido, " + res.usuario.nombre + ". Redirigiendo...", true);
      setTimeout(function () {
        location.href = res.usuario.rol === "admin" ? "admin/productos.html" : "index.html";
      }, 1200);
    });

    btnLimpiar.addEventListener("click", function () {
      limpiar("usuario");
      limpiar("password");
      exito.classList.remove("show");
    });

    function marcar(id, txt) {
      const el = document.getElementById(id);
      el.classList.add("is-invalid");
      el.classList.remove("is-valid");
      const caja = document.getElementById("err-" + id);
      caja.textContent = txt;
      caja.classList.add("show");
    }

    function limpiar(id) {
      const el = document.getElementById(id);
      el.classList.remove("is-invalid");
      const caja = document.getElementById("err-" + id);
      caja.textContent = "";
      caja.classList.remove("show");
    }

    function mensaje(txt, ok) {
      exito.textContent = txt;
      exito.classList.toggle("form-success--error", !ok);
      exito.classList.add("show");
    }
  });
})();
