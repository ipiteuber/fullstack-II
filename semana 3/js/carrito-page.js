(function () {
  "use strict";

  const Cart = window.LinkStartCart;
  const U = window.LinkStartUtil;

  document.addEventListener("DOMContentLoaded", function () {
    const vacio = document.getElementById("carrito-vacio");
    const contenido = document.getElementById("carrito-contenido");
    const body = document.getElementById("carrito-body");
    if (!body) return;

    function render() {
      const items = Cart.obtener();
      if (!items.length) {
        vacio.hidden = false;
        contenido.hidden = true;
        return;
      }
      vacio.hidden = true;
      contenido.hidden = false;

      body.textContent = "";
      items.forEach(function (it) {
        const tr = document.createElement("tr");

        const tdImg = document.createElement("td");
        const img = document.createElement("img");
        img.src = it.img;
        img.alt = it.nombre;
        tdImg.appendChild(img);

        const tdNombre = document.createElement("td");
        tdNombre.textContent = it.nombre;

        const tdPrecio = document.createElement("td");
        tdPrecio.className = "precio";
        tdPrecio.textContent = U.precio(it.precio);

        const tdCant = document.createElement("td");
        const input = document.createElement("input");
        input.type = "number";
        input.min = "1";
        input.value = it.cant;
        input.className = "qty-input";
        input.addEventListener("change", function () {
          const n = parseInt(input.value, 10) || 1;
          Cart.cambiarCantidad(it.id, n);
          render();
          actualizarNav();
        });
        tdCant.appendChild(input);

        const tdSub = document.createElement("td");
        tdSub.className = "precio";
        tdSub.textContent = U.precio(it.precio * it.cant);

        const tdAcc = document.createElement("td");
        const btn = document.createElement("button");
        btn.className = "btn-mini";
        btn.textContent = "Quitar";
        btn.addEventListener("click", function () {
          Cart.quitar(it.id);
          render();
          actualizarNav();
        });
        tdAcc.appendChild(btn);

        tr.append(tdImg, tdNombre, tdPrecio, tdCant, tdSub, tdAcc);
        body.appendChild(tr);
      });

      document.getElementById("carrito-total").textContent = U.precio(Cart.totalCLP());
    }

    document.getElementById("btn-vaciar").addEventListener("click", function () {
      Cart.vaciar();
      render();
      actualizarNav();
    });

    function actualizarNav() {
      // Actualiza el contador del carrito en el menu sin recargar
      const total = Cart.totalItems();
      const enlaces = document.querySelectorAll(".main-nav a");
      enlaces.forEach(function (a) {
        if ((a.getAttribute("href") || "").split("/").pop() === "carrito.html") {
          a.textContent = "Carrito" + (total ? " (" + total + ")" : "");
        }
      });
    }

    render();
  });
})();
