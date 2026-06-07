(function () {
  "use strict";

  const Cart = window.LinkStartCart;

  document.addEventListener("DOMContentLoaded", function () {
    const botones = document.querySelectorAll(".add-cart");
    if (!botones.length) return;

    botones.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = btn.getAttribute("data-id");
        const res = Cart.agregar(id, 1);
        if (!res.ok) {
          feedback(btn, res.error, false);
          return;
        }
        feedback(btn, "Agregado ✓", true);
        actualizarContador();
      });
    });

    function feedback(btn, texto, ok) {
      const original = btn.getAttribute("data-label") || btn.textContent;
      if (!btn.getAttribute("data-label")) btn.setAttribute("data-label", original);
      btn.textContent = texto;
      btn.style.color = ok ? "var(--neon-primary)" : "var(--neon-secondary)";
      setTimeout(function () {
        btn.textContent = btn.getAttribute("data-label");
        btn.style.color = "";
      }, 1300);
    }

    function actualizarContador() {
      const total = Cart.totalItems();
      document.querySelectorAll(".main-nav a").forEach(function (a) {
        if ((a.getAttribute("href") || "").split("/").pop() === "carrito.html") {
          a.textContent = "Carrito" + (total ? " (" + total + ")" : "");
        }
      });
    }
  });
})();
