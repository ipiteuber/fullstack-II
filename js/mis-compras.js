(function () {
  "use strict";

  const A = window.LinkStartAuth;
  const Cart = window.LinkStartCart;
  const U = window.LinkStartUtil;

  document.addEventListener("DOMContentLoaded", function () {
    const sesion = A.sesion();
    const contenido = document.getElementById("compras-contenido");
    const vacio = document.getElementById("compras-vacio");
    const guard = document.getElementById("compras-guard");

    if (!sesion) { guard.hidden = false; return; }

    const ordenes = Cart.ordenesDe(sesion.usuario);
    if (!ordenes.length) { vacio.hidden = false; return; }

    contenido.hidden = false;
    const lista = document.getElementById("compras-lista");

    ordenes.slice().reverse().forEach(function (orden) {
      const panel = document.createElement("div");
      panel.className = "ls-panel";

      const titulo = document.createElement("p");
      titulo.className = "form-intro";
      titulo.style.margin = "0 0 1rem";
      titulo.textContent = "// " + orden.id + "  ·  " + orden.fecha;
      panel.appendChild(titulo);

      const table = document.createElement("table");
      table.className = "ls-table";
      const thead = document.createElement("thead");
      const trh = document.createElement("tr");
      ["Producto", "Cantidad", "Subtotal"].forEach(function (t) {
        const th = document.createElement("th");
        th.textContent = t;
        trh.appendChild(th);
      });
      thead.appendChild(trh);
      table.appendChild(thead);

      const tbody = document.createElement("tbody");
      orden.items.forEach(function (it) {
        const tr = document.createElement("tr");
        const a = document.createElement("td"); a.textContent = it.nombre;
        const b = document.createElement("td"); b.textContent = it.cant;
        const c = document.createElement("td"); c.className = "precio"; c.textContent = U.precio(it.precio * it.cant);
        tr.append(a, b, c);
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      panel.appendChild(table);

      const resumen = document.createElement("div");
      resumen.className = "cart-summary";
      const lbl = document.createElement("span");
      lbl.className = "form-intro";
      lbl.style.margin = "0";
      lbl.textContent = "Total de la orden";
      const tot = document.createElement("span");
      tot.className = "total";
      tot.textContent = U.precio(orden.total);
      resumen.append(lbl, tot);
      panel.appendChild(resumen);

      lista.appendChild(panel);
    });
  });
})();
