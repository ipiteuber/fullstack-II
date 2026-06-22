(function () {
  "use strict";

  const A = window.LinkStartAuth;
  const D = window.LinkStartData;

  document.addEventListener("DOMContentLoaded", function () {
    const nav = document.querySelector(".main-nav ul");
    if (!nav) return;

    const base = document.body.getAttribute("data-base") || "";
    const sesion = A.sesion();
    const carrito = D.leer(D.K_CART, []);
    const totalItems = carrito.reduce((s, i) => s + i.cant, 0);

    let html = "";
    html += item(base + "index.html", "Inicio");
    html += item(base + "categorias/estrategia.html", "Estrategia");
    html += item(base + "categorias/cooperativos.html", "Cooperativos");
    html += item(base + "categorias/cartas.html", "Cartas");
    html += item(base + "categorias/party.html", "Party");
    html += item(base + "carrito.html", "Carrito" + (totalItems ? " (" + totalItems + ")" : ""));

    if (A.esAdmin()) {
      html += item(base + "admin/productos.html", "Productos");
      html += item(base + "admin/inventario.html", "Inventario");
    }

    if (sesion) {
      html += item(base + "mis-compras.html", "Mis compras");
      html += item(base + "perfil.html", "Perfil");
      html += '<li><a href="#" id="nav-logout" class="nav-user">Salir (' + esc(sesion.usuario) + ")</a></li>";
    } else {
      html += item(base + "login.html", "Ingresar");
      html += item(base + "registro.html", "Registro");
    }

    nav.innerHTML = html;

    // Marca el enlace de la pagina actual
    const actual = location.pathname.split("/").pop() || "index.html";
    nav.querySelectorAll("a").forEach(function (a) {
      const href = a.getAttribute("href") || "";
      if (href.split("/").pop() === actual) a.classList.add("active");
    });

    const logout = document.getElementById("nav-logout");
    if (logout) {
      logout.addEventListener("click", function (e) {
        e.preventDefault();
        A.logout();
        location.href = base + "index.html";
      });
    }
  });

  function item(href, texto) {
    return '<li><a href="' + href + '">' + texto + "</a></li>";
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
})();
