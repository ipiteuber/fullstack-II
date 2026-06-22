(function () {
  "use strict";

  const CATALOGO_INICIAL = [
    { id: "catan",            nombre: "Catan",            categoria: "Estrategia",   precio: 34990, precioOld: null,  stock: 12, img: "img/juegos/catan.jpg",            desc: "El clásico de comercio y construcción. Recolecta recursos y domina la isla." },
    { id: "carcassonne",      nombre: "Carcassonne",      categoria: "Estrategia",   precio: 29990, precioOld: 39990, stock: 8,  img: "img/juegos/carcassonne.jpg",      desc: "Coloca losetas y forma ciudades, caminos y monasterios medievales." },
    { id: "risk",             nombre: "Risk",             categoria: "Estrategia",   precio: 42990, precioOld: null,  stock: 5,  img: "img/juegos/risk.jpg",             desc: "Conquista el mundo en este icónico juego de estrategia militar global." },
    { id: "pandemic",         nombre: "Pandemic",         categoria: "Cooperativos", precio: 39990, precioOld: 49990, stock: 10, img: "img/juegos/pandemic.jpg",         desc: "Trabajen juntos para salvar al mundo de cuatro enfermedades mortales." },
    { id: "forbidden-island", nombre: "Forbidden Island", categoria: "Cooperativos", precio: 24990, precioOld: null,  stock: 15, img: "img/juegos/forbidden-island.jpg", desc: "Una isla se hunde y deben recuperar los tesoros antes de escapar." },
    { id: "mysterium",        nombre: "Mysterium",        categoria: "Cooperativos", precio: 44990, precioOld: null,  stock: 6,  img: "img/juegos/mysterium.jpg",        desc: "Un fantasma envía visiones a médiums para resolver un asesinato." },
    { id: "munchkin",         nombre: "Munchkin",         categoria: "Cartas",       precio: 19990, precioOld: null,  stock: 20, img: "img/juegos/munchkin.jpg",         desc: "Mata monstruos, roba el tesoro, traiciona a tus amigos. Humor y caos." },
    { id: "exploding-kittens",nombre: "Exploding Kittens",categoria: "Cartas",       precio: 22990, precioOld: 28990, stock: 18, img: "img/juegos/exploding-kittens.jpg",desc: "Evita los gatos explosivos en este juego rápido e impredecible." },
    { id: "coup",             nombre: "Coup",             categoria: "Cartas",       precio: 14990, precioOld: null,  stock: 14, img: "img/juegos/coup.jpg",             desc: "Engaño, mentiras y traición en una corte real. Solo el más astuto sobrevive." },
    { id: "codenames",        nombre: "Codenames",        categoria: "Party Games",  precio: 26990, precioOld: null,  stock: 9,  img: "img/juegos/codenames.jpg",        desc: "Dos equipos compiten para identificar agentes secretos con una palabra." },
    { id: "dixit",            nombre: "Dixit",            categoria: "Party Games",  precio: 34990, precioOld: 44990, stock: 7,  img: "img/juegos/dixit.jpg",            desc: "Ilustraciones surrealistas y pistas creativas. Adivina la carta del narrador." },
    { id: "just-one",         nombre: "Just One",         categoria: "Party Games",  precio: 21990, precioOld: null,  stock: 11, img: "img/juegos/just-one.jpg",         desc: "Cooperativo de palabras: da pistas, pero cuidado con los duplicados." },
  ];

  const USUARIO_ADMIN = {
    nombre: "Administrador Link Start",
    usuario: "admin",
    correo: "admin@linkstart.cl",
    password: "Admin#2026",
    fechaNac: "1990-01-01",
    direccion: "Oficina central",
    rol: "admin",
  };

  const LS = window.LinkStartData = {
    K_USERS: "ls_users",
    K_SESSION: "ls_session",
    K_PRODUCTS: "ls_products",
    K_CART: "ls_cart",
    K_ORDERS: "ls_orders",

    leer(clave, porDefecto) {
      try {
        const raw = localStorage.getItem(clave);
        return raw ? JSON.parse(raw) : porDefecto;
      } catch (e) {
        return porDefecto;
      }
    },

    guardar(clave, valor) {
      localStorage.setItem(clave, JSON.stringify(valor));
    },

    // La sesion activa vive en sessionStorage: Se borra al cerrar la pestaña
    leerSesion() {
      try {
        const raw = sessionStorage.getItem(this.K_SESSION);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    },

    guardarSesion(valor) {
      sessionStorage.setItem(this.K_SESSION, JSON.stringify(valor));
    },

    borrarSesion() {
      sessionStorage.removeItem(this.K_SESSION);
    },

    sembrar() {
      if (!localStorage.getItem(this.K_PRODUCTS)) {
        this.guardar(this.K_PRODUCTS, CATALOGO_INICIAL);
      }
      const users = this.leer(this.K_USERS, []);
      if (!users.some(u => u.usuario === USUARIO_ADMIN.usuario)) {
        users.push(USUARIO_ADMIN);
        this.guardar(this.K_USERS, users);
      }
      if (!localStorage.getItem(this.K_ORDERS)) {
        this.guardar(this.K_ORDERS, []);
      }
    },
  };

  LS.sembrar();
})();
