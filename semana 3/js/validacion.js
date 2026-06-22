(function () {
  "use strict";

  const A = window.LinkStartAuth;
  const V = window.LinkStartValid;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    const form = document.getElementById("registro-form");
    if (!form) return;

    const campos = {
      nombre:    document.getElementById("nombre"),
      usuario:   document.getElementById("usuario"),
      correo:    document.getElementById("correo"),
      password:  document.getElementById("password"),
      password2: document.getElementById("password2"),
      fechaNac:  document.getElementById("fechaNac"),
      direccion: document.getElementById("direccion"),
    };

    const exito = document.getElementById("form-success");
    const btnLimpiar = document.getElementById("btn-limpiar");
    const pwBar = document.getElementById("pw-bar");
    const pwHint = document.getElementById("pw-hint");

    if (campos.fechaNac) {
      campos.fechaNac.setAttribute("max", window.LinkStartUtil.hoyISO());
    }

    const reglas = {
      nombre(v) {
        if (V.vacio(v)) return "El nombre completo es obligatorio.";
        if (v.trim().length < 3) return "Ingresa al menos 3 caracteres.";
        return "";
      },
      usuario(v) {
        if (V.vacio(v)) return "El nombre de usuario es obligatorio.";
        if (v.trim().length < 4) return "El usuario debe tener al menos 4 caracteres.";
        return "";
      },
      correo(v) {
        if (V.vacio(v)) return "El correo electronico es obligatorio.";
        if (!V.correo(v)) return "Ingresa un correo con formato valido.";
        return "";
      },
      password(v) {
        return V.password(v);
      },
      password2(v) {
        if (V.vacio(v)) return "Repite la contrasena.";
        if (v !== campos.password.value) return "Las contrasenas no coinciden.";
        return "";
      },
      fechaNac(v) {
        if (V.vacio(v)) return "La fecha de nacimiento es obligatoria.";
        const ok = V.edadMinima(v, 13);
        if (ok === null) return "Fecha invalida.";
        if (!ok) return "Debes tener al menos 13 anos para registrarte.";
        return "";
      },
      direccion() {
        return "";
      },
    };

    Object.keys(reglas).forEach(function (nombreCampo) {
      const input = campos[nombreCampo];
      if (!input) return;

      input.addEventListener("blur", function () {
        validarCampo(nombreCampo);
      });

      input.addEventListener("input", function () {
        ocultarExito();
        if (input.classList.contains("is-invalid") || input.classList.contains("is-valid")) {
          validarCampo(nombreCampo);
        }
        if (nombreCampo === "password" && campos.password2.value) {
          validarCampo("password2");
        }
      });
    });

    if (campos.password) {
      campos.password.addEventListener("input", actualizarMedidor);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      let primerInvalido = null;
      let todoOk = true;

      Object.keys(reglas).forEach(function (nombreCampo) {
        const ok = validarCampo(nombreCampo);
        if (!ok && !primerInvalido) primerInvalido = campos[nombreCampo];
        if (!ok) todoOk = false;
      });

      if (!todoOk) {
        ocultarExito();
        if (primerInvalido) primerInvalido.focus();
        return;
      }

      const res = A.registrar({
        nombre: campos.nombre.value.trim(),
        usuario: campos.usuario.value.trim(),
        correo: campos.correo.value.trim(),
        password: campos.password.value,
        fechaNac: campos.fechaNac.value,
        direccion: campos.direccion.value.trim(),
      });

      if (!res.ok) {
        ocultarExito();
        // Muestra el error en el campo correspondiente
        if (res.error.includes("usuario")) marcarError("usuario", res.error);
        else if (res.error.includes("correo")) marcarError("correo", res.error);
        else mostrarMensaje(res.error, false);
        return;
      }

      mostrarMensaje("Cuenta creada con exito. Redirigiendo al inicio de sesion...", true);
      form.reset();
      limpiarEstados();
      actualizarMedidor();
      setTimeout(function () {
        location.href = "login.html";
      }, 1600);
    });

    btnLimpiar.addEventListener("click", function () {
      form.reset();
      limpiarEstados();
      ocultarExito();
      actualizarMedidor();
    });

    function validarCampo(nombreCampo) {
      const input = campos[nombreCampo];
      const error = reglas[nombreCampo](input.value);
      if (error) {
        marcarError(nombreCampo, error);
        return false;
      }
      if (V.vacio(input.value) && nombreCampo === "direccion") {
        input.classList.remove("is-invalid", "is-valid");
      } else {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
      }
      input.setAttribute("aria-invalid", "false");
      const caja = document.getElementById("err-" + nombreCampo);
      if (caja) { caja.textContent = ""; caja.classList.remove("show"); }
      return true;
    }

    function marcarError(nombreCampo, error) {
      const input = campos[nombreCampo];
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
      input.setAttribute("aria-invalid", "true");
      const caja = document.getElementById("err-" + nombreCampo);
      if (caja) { caja.textContent = error; caja.classList.add("show"); }
    }

    function actualizarMedidor() {
      const v = campos.password.value;
      const puntos = V.fuerza(v);
      const niveles = [
        { w: "0%",   c: "transparent",           t: "Seguridad de la contraseña" },
        { w: "25%",  c: "var(--neon-secondary)", t: "Muy debil" },
        { w: "50%",  c: "#ff8c00",               t: "Debil" },
        { w: "75%",  c: "var(--neon-accent)",    t: "Aceptable" },
        { w: "100%", c: "var(--neon-primary)",   t: "Fuerte" },
      ];
      const nivel = niveles[Math.min(puntos, 4)];
      pwBar.style.width = nivel.w;
      pwBar.style.background = nivel.c;
      pwHint.textContent = v.length ? nivel.t : niveles[0].t;
    }

    function limpiarEstados() {
      Object.keys(campos).forEach(function (k) {
        const input = campos[k];
        if (!input) return;
        input.classList.remove("is-invalid", "is-valid");
        input.removeAttribute("aria-invalid");
        const caja = document.getElementById("err-" + k);
        if (caja) { caja.textContent = ""; caja.classList.remove("show"); }
      });
    }

    function mostrarMensaje(texto, ok) {
      exito.textContent = texto;
      exito.classList.toggle("form-success--error", !ok);
      exito.classList.add("show");
      exito.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function ocultarExito() {
      exito.classList.remove("show");
    }
  }
})();
