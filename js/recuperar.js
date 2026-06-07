(function () {
  "use strict";

  const A = window.LinkStartAuth;
  const V = window.LinkStartValid;

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("recuperar-form");
    if (!form) return;

    const correo = document.getElementById("correo");
    const password = document.getElementById("password");
    const password2 = document.getElementById("password2");
    const exito = document.getElementById("form-success");
    const btnLimpiar = document.getElementById("btn-limpiar");
    const pwBar = document.getElementById("pw-bar");
    const pwHint = document.getElementById("pw-hint");

    password.addEventListener("input", function () {
      const puntos = V.fuerza(password.value);
      const niveles = [
        { w: "0%",   c: "transparent",           t: "Seguridad de la contraseña" },
        { w: "25%",  c: "var(--neon-secondary)", t: "Muy debil" },
        { w: "50%",  c: "#ff8c00",               t: "Debil" },
        { w: "75%",  c: "var(--neon-accent)",    t: "Aceptable" },
        { w: "100%", c: "var(--neon-primary)",   t: "Fuerte" },
      ];
      const n = niveles[Math.min(puntos, 4)];
      pwBar.style.width = n.w;
      pwBar.style.background = n.c;
      pwHint.textContent = password.value.length ? n.t : niveles[0].t;
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let ok = true;

      if (V.vacio(correo.value) || !V.correo(correo.value)) { marcar("correo", "Ingresa un correo valido."); ok = false; }
      else limpiar("correo");

      const errPass = V.password(password.value);
      if (errPass) { marcar("password", errPass); ok = false; }
      else limpiar("password");

      if (password2.value !== password.value || V.vacio(password2.value)) { marcar("password2", "Las contrasenas no coinciden."); ok = false; }
      else limpiar("password2");

      if (!ok) return;

      const res = A.cambiarPassword(correo.value.trim(), password.value);
      if (!res.ok) {
        marcar("correo", res.error);
        return;
      }

      mensaje("Contraseña actualizada. Redirigiendo al inicio de sesion...", true);
      form.reset();
      pwBar.style.width = "0%";
      pwHint.textContent = "Seguridad de la contraseña";
      setTimeout(function () { location.href = "login.html"; }, 1600);
    });

    btnLimpiar.addEventListener("click", function () {
      ["correo", "password", "password2"].forEach(limpiar);
      exito.classList.remove("show");
      pwBar.style.width = "0%";
      pwHint.textContent = "Seguridad de la contraseña";
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
