(function () {
  "use strict";

  const D = window.LinkStartData;

  const Auth = window.LinkStartAuth = {
    usuarios() {
      return D.leer(D.K_USERS, []);
    },

    sesion() {
      return D.leerSesion();
    },

    estaLogueado() {
      return this.sesion() !== null;
    },

    esAdmin() {
      const s = this.sesion();
      return s && s.rol === "admin";
    },

    buscarPorUsuario(usuario) {
      return this.usuarios().find(u => u.usuario.toLowerCase() === usuario.toLowerCase());
    },

    buscarPorCorreo(correo) {
      return this.usuarios().find(u => u.correo.toLowerCase() === correo.toLowerCase());
    },

    registrar(datos) {
      const users = this.usuarios();
      if (users.some(u => u.usuario.toLowerCase() === datos.usuario.toLowerCase())) {
        return { ok: false, error: "Ese nombre de usuario ya está registrado." };
      }
      if (users.some(u => u.correo.toLowerCase() === datos.correo.toLowerCase())) {
        return { ok: false, error: "Ese correo ya está registrado." };
      }
      const nuevo = Object.assign({ rol: "cliente" }, datos);
      users.push(nuevo);
      D.guardar(D.K_USERS, users);
      return { ok: true, usuario: nuevo };
    },

    login(usuario, password) {
      const u = this.buscarPorUsuario(usuario) || this.buscarPorCorreo(usuario);
      if (!u || u.password !== password) {
        return { ok: false, error: "Usuario o contraseña incorrectos." };
      }
      D.guardarSesion({ usuario: u.usuario, nombre: u.nombre, rol: u.rol, correo: u.correo });
      return { ok: true, usuario: u };
    },

    logout() {
      D.borrarSesion();
    },

    actualizarPerfil(usuario, cambios) {
      const users = this.usuarios();
      const i = users.findIndex(u => u.usuario.toLowerCase() === usuario.toLowerCase());
      if (i === -1) return { ok: false, error: "Usuario no encontrado." };
      users[i] = Object.assign(users[i], cambios);
      D.guardar(D.K_USERS, users);
      const s = this.sesion();
      if (s && s.usuario.toLowerCase() === usuario.toLowerCase()) {
        D.guardarSesion({ usuario: users[i].usuario, nombre: users[i].nombre, rol: users[i].rol, correo: users[i].correo });
      }
      return { ok: true, usuario: users[i] };
    },

    cambiarPassword(correo, nuevaPass) {
      const u = this.buscarPorCorreo(correo);
      if (!u) return { ok: false, error: "No existe una cuenta con ese correo." };
      return this.actualizarPerfil(u.usuario, { password: nuevaPass });
    },
  };

  const V = window.LinkStartValid = {
    vacio(v) {
      return v === null || v === undefined || String(v).trim() === "";
    },
    correo(v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
    },
    password(v) {
      if (this.vacio(v)) return "La contraseña es obligatoria.";
      if (v.length < 6 || v.length > 18) return "Debe tener entre 6 y 18 caracteres.";
      if (!/[0-9]/.test(v)) return "Debe incluir al menos un número.";
      if (!/[A-Z]/.test(v)) return "Debe incluir al menos una letra mayúscula.";
      if (!/[a-z]/.test(v)) return "Debe incluir al menos una letra minúscula.";
      if (!/[^A-Za-z0-9]/.test(v)) return "Debe incluir al menos un carácter especial.";
      return "";
    },
    edadMinima(fechaStr, minimo) {
      const nac = new Date(fechaStr);
      if (isNaN(nac.getTime())) return null;
      const hoy = new Date();
      let edad = hoy.getFullYear() - nac.getFullYear();
      const m = hoy.getMonth() - nac.getMonth();
      if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
      return edad >= minimo;
    },
    fuerza(v) {
      let p = 0;
      if (v.length >= 6) p++;
      if (v.length >= 10) p++;
      if (/[0-9]/.test(v)) p++;
      if (/[A-Z]/.test(v)) p++;
      if (/[^A-Za-z0-9]/.test(v)) p++;
      return p;
    },
  };

  window.LinkStartUtil = {
    precio(n) {
      return "$" + Number(n).toLocaleString("es-CL");
    },
    hoyISO() {
      const d = new Date();
      return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    },
  };
})();
