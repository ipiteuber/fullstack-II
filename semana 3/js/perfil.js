(function () {
  "use strict";

  const A = window.LinkStartAuth;
  const V = window.LinkStartValid;

  document.addEventListener("DOMContentLoaded", function () {
    const sesion = A.sesion();
    const contenido = document.getElementById("perfil-contenido");
    const guard = document.getElementById("perfil-guard");

    if (!sesion) {
      guard.hidden = false;
      return;
    }
    contenido.hidden = false;

    const usuarioActual = A.buscarPorUsuario(sesion.usuario);
    const badge = document.getElementById("rol-badge");
    if (badge) {
      const esAdmin = usuarioActual.rol === "admin";
      badge.className = "role-badge" + (esAdmin ? " role-badge--admin" : "");
      badge.textContent = esAdmin ? "Admin" : "Cliente";
    }

    const campos = {
      nombre: document.getElementById("nombre"),
      usuario: document.getElementById("usuario"),
      correo: document.getElementById("correo"),
      fechaNac: document.getElementById("fechaNac"),
      direccion: document.getElementById("direccion"),
      password: document.getElementById("password"),
      password2: document.getElementById("password2"),
    };

    campos.nombre.value = usuarioActual.nombre || "";
    campos.usuario.value = usuarioActual.usuario || "";
    campos.correo.value = usuarioActual.correo || "";
    campos.fechaNac.value = usuarioActual.fechaNac || "";
    campos.direccion.value = usuarioActual.direccion || "";
    campos.fechaNac.setAttribute("max", window.LinkStartUtil.hoyISO());

    const form = document.getElementById("perfil-form");
    const exito = document.getElementById("form-success");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let ok = true;

      if (V.vacio(campos.nombre.value) || campos.nombre.value.trim().length < 3) { marcar("nombre", "Ingresa tu nombre completo."); ok = false; }
      else limpiar("nombre");

      if (!V.correo(campos.correo.value)) { marcar("correo", "Ingresa un correo valido."); ok = false; }
      else limpiar("correo");

      const edadOk = V.edadMinima(campos.fechaNac.value, 13);
      if (edadOk === null) { marcar("fechaNac", "Fecha invalida."); ok = false; }
      else if (!edadOk) { marcar("fechaNac", "Debes tener al menos 13 anos."); ok = false; }
      else limpiar("fechaNac");

      // Correo unico (salvo el propio)
      if (V.correo(campos.correo.value)) {
        const otro = A.buscarPorCorreo(campos.correo.value);
        if (otro && otro.usuario.toLowerCase() !== usuarioActual.usuario.toLowerCase()) {
          marcar("correo", "Ese correo ya esta en uso por otra cuenta."); ok = false;
        }
      }

      // Contraseña solo si se ingresa
      const cambiarPass = !V.vacio(campos.password.value) || !V.vacio(campos.password2.value);
      if (cambiarPass) {
        const errPass = V.password(campos.password.value);
        if (errPass) { marcar("password", errPass); ok = false; }
        else limpiar("password");
        if (campos.password2.value !== campos.password.value) { marcar("password2", "Las contrasenas no coinciden."); ok = false; }
        else limpiar("password2");
      } else {
        limpiar("password"); limpiar("password2");
      }

      if (!ok) return;

      const cambios = {
        nombre: campos.nombre.value.trim(),
        correo: campos.correo.value.trim(),
        fechaNac: campos.fechaNac.value,
        direccion: campos.direccion.value.trim(),
      };
      if (cambiarPass) cambios.password = campos.password.value;

      const res = A.actualizarPerfil(usuarioActual.usuario, cambios);
      if (!res.ok) { mensaje(res.error, false); return; }

      campos.password.value = "";
      campos.password2.value = "";
      mensaje("Perfil actualizado correctamente.", true);
    });

    document.getElementById("btn-cerrar").addEventListener("click", function () {
      A.logout();
      location.href = "index.html";
    });

    function marcar(id, txt) {
      const el = campos[id];
      el.classList.add("is-invalid");
      el.classList.remove("is-valid");
      const caja = document.getElementById("err-" + id);
      if (caja) { caja.textContent = txt; caja.classList.add("show"); }
    }
    function limpiar(id) {
      const el = campos[id];
      el.classList.remove("is-invalid");
      const caja = document.getElementById("err-" + id);
      if (caja) { caja.textContent = ""; caja.classList.remove("show"); }
    }
    function mensaje(txt, ok) {
      exito.textContent = txt;
      exito.classList.toggle("form-success--error", !ok);
      exito.classList.add("show");
      exito.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
})();
