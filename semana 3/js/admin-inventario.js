(function () {
  "use strict";

  const A = window.LinkStartAuth;
  const D = window.LinkStartData;
  const U = window.LinkStartUtil;

  document.addEventListener("DOMContentLoaded", function () {
    const contenido = document.getElementById("inv-contenido");
    const guard = document.getElementById("inv-guard");

    if (!A.esAdmin()) { guard.hidden = false; return; }
    contenido.hidden = false;

    const body = document.getElementById("inv-body");
    const exito = document.getElementById("form-success");

    function productos() { return D.leer(D.K_PRODUCTS, []); }

    function render() {
      const lista = productos();
      body.textContent = "";
      lista.forEach(function (p) {
        const tr = document.createElement("tr");

        const tdImg = document.createElement("td");
        const img = document.createElement("img");
        img.src = "../" + p.img;
        img.alt = p.nombre;
        tdImg.appendChild(img);

        const tdNom = document.createElement("td");
        tdNom.textContent = p.nombre;

        const tdStock = document.createElement("td");
        tdStock.textContent = p.stock;
        tdStock.className = p.stock <= 5 ? "stock-low" : "stock-ok";

        const tdInput = document.createElement("td");
        const input = document.createElement("input");
        input.type = "number";
        input.min = "0";
        input.value = p.stock;
        input.className = "qty-input";
        tdInput.appendChild(input);

        const tdAcc = document.createElement("td");
        const btn = document.createElement("button");
        btn.className = "btn-mini btn-mini--ok";
        btn.textContent = "Actualizar";
        btn.addEventListener("click", function () {
          const n = parseInt(input.value, 10);
          if (isNaN(n) || n < 0) { mensaje("Stock invalido para " + p.nombre + ".", false); return; }
          const lista2 = productos();
          const i = lista2.findIndex(x => x.id === p.id);
          if (i !== -1) { lista2[i].stock = n; D.guardar(D.K_PRODUCTS, lista2); }
          mensaje("Stock de " + p.nombre + " actualizado a " + n + ".", true);
          render();
        });
        tdAcc.appendChild(btn);

        tr.append(tdImg, tdNom, tdStock, tdInput, tdAcc);
        body.appendChild(tr);
      });
    }

    function mensaje(txt, ok) {
      exito.textContent = txt;
      exito.classList.toggle("form-success--error", !ok);
      exito.classList.add("show");
    }

    render();
  });
})();
