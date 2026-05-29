(function () {
  "use strict";

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

    // No permitir fechas de nacimiento futuras
    if (campos.fechaNac) {
      campos.fechaNac.setAttribute("max", hoyISO());
    }

    const reglas = {
      nombre(v) {
        if (esVacio(v)) return "El nombre completo es obligatorio.";
        if (v.trim().length < 3) return "Ingresa al menos 3 caracteres.";
        return "";
      },
      usuario(v) {
        if (esVacio(v)) return "El nombre de usuario es obligatorio.";
        if (v.trim().length < 4) return "El usuario debe tener al menos 4 caracteres.";
        return "";
      },
      correo(v) {
        if (esVacio(v)) return "El correo electronico es obligatorio.";
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(v.trim())) return "Ingresa un correo con formato valido.";
        return "";
      },
      password(v) {
        if (esVacio(v)) return "La contrasena es obligatoria.";
        if (v.length < 6 || v.length > 18) return "Debe tener entre 6 y 18 caracteres.";
        if (!/[0-9]/.test(v)) return "Debe incluir al menos un numero.";
        if (!/[A-Z]/.test(v)) return "Debe incluir al menos una letra mayuscula.";
        return "";
      },
      password2(v) {
        if (esVacio(v)) return "Repite la contrasena.";
        if (v !== campos.password.value) return "Las contrasenas no coinciden.";
        return "";
      },
      fechaNac(v) {
        if (esVacio(v)) return "La fecha de nacimiento es obligatoria.";
        const edad = calcularEdad(v);
        if (edad === null) return "Fecha invalida.";
        if (edad < 13) return "Debes tener al menos 13 anos para registrarte.";
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
        if (!ok && !primerInvalido) {
          primerInvalido = campos[nombreCampo];
        }
        if (!ok) todoOk = false;
      });

      if (todoOk) {
        mostrarExito();
        form.reset();
        limpiarEstados();
        actualizarMedidor();
      } else {
        ocultarExito();
        if (primerInvalido) primerInvalido.focus();
      }
    });

    btnLimpiar.addEventListener("click", function () {
      form.reset();
      limpiarEstados();
      ocultarExito();
      actualizarMedidor();
    });

    function validarCampo(nombreCampo) {
      const input = campos[nombreCampo];
      const valor = input.value;
      const error = reglas[nombreCampo](valor);
      const cajaError = document.getElementById("err-" + nombreCampo);

      if (error) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        input.setAttribute("aria-invalid", "true");
        if (cajaError) {
          cajaError.textContent = error;
          cajaError.classList.add("show");
        }
        return false;
      }

      if (esVacio(valor) && nombreCampo === "direccion") {
        input.classList.remove("is-invalid", "is-valid");
      } else {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
      }
      input.setAttribute("aria-invalid", "false");
      if (cajaError) {
        cajaError.textContent = "";
        cajaError.classList.remove("show");
      }
      return true;
    }

    function actualizarMedidor() {
      const v = campos.password.value;
      let puntos = 0;
      if (v.length >= 6) puntos++;
      if (v.length >= 10) puntos++;
      if (/[0-9]/.test(v)) puntos++;
      if (/[A-Z]/.test(v)) puntos++;
      if (/[^A-Za-z0-9]/.test(v)) puntos++;

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
        if (caja) {
          caja.textContent = "";
          caja.classList.remove("show");
        }
      });
    }

    function mostrarExito() {
      exito.textContent =
        "Registro completado. Bienvenido a Link Start, ya eres parte del club de jugadores.";
      exito.classList.add("show");
      exito.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function ocultarExito() {
      exito.classList.remove("show");
    }
  }

  function esVacio(v) {
    return v === null || v === undefined || v.trim() === "";
  }

  function hoyISO() {
    const d = new Date();
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + mes + "-" + dia;
  }

  function calcularEdad(fechaStr) {
    const nac = new Date(fechaStr);
    if (isNaN(nac.getTime())) return null;
    const hoy = new Date();
    let edad = hoy.getFullYear() - nac.getFullYear();
    const m = hoy.getMonth() - nac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) {
      edad--;
    }
    return edad;
  }
})();
