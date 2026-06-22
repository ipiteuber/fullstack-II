(function () {
  "use strict";

  const A = window.LinkStartAuth;
  const Cart = window.LinkStartCart;
  const V = window.LinkStartValid;
  const U = window.LinkStartUtil;

  document.addEventListener("DOMContentLoaded", function () {
    const sesion = A.sesion();
    const contenido = document.getElementById("pago-contenido");
    const guard = document.getElementById("pago-guard");
    const vacio = document.getElementById("pago-vacio");
    const exitoSec = document.getElementById("pago-exito");

    if (!sesion) { guard.hidden = false; return; }

    const items = Cart.obtener();
    if (!items.length) { vacio.hidden = false; return; }

    contenido.hidden = false;

    const body = document.getElementById("pago-body");
    items.forEach(function (it) {
      const tr = document.createElement("tr");
      const a = document.createElement("td"); a.textContent = it.nombre;
      const b = document.createElement("td"); b.textContent = it.cant;
      const c = document.createElement("td"); c.className = "precio"; c.textContent = U.precio(it.precio * it.cant);
      tr.append(a, b, c);
      body.appendChild(tr);
    });
    document.getElementById("pago-total").textContent = U.precio(Cart.totalCLP());

    const form = document.getElementById("pago-form");
    const tarjeta = document.getElementById("tarjeta");
    const vence = document.getElementById("vence");
    const cvv = document.getElementById("cvv");
    const exito = document.getElementById("form-success");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let ok = true;

      const numTarjeta = tarjeta.value.replace(/\s/g, "");
      if (!/^\d{16}$/.test(numTarjeta)) { marcar("tarjeta", "Ingresa los 16 digitos de la tarjeta."); ok = false; }
      else limpiar("tarjeta");

      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(vence.value)) { marcar("vence", "Formato MM/AA."); ok = false; }
      else limpiar("vence");

      if (!/^\d{3,4}$/.test(cvv.value)) { marcar("cvv", "CVV de 3 o 4 digitos."); ok = false; }
      else limpiar("cvv");

      if (!ok) return;

      const res = Cart.confirmarCompra(sesion.usuario);
      if (!res.ok) { mensaje(res.error, false); return; }

      contenido.hidden = true;
      exitoSec.hidden = false;
      document.getElementById("exito-msg").textContent = "¡Pago realizado con exito!";
      document.getElementById("exito-detalle").textContent =
        "Orden " + res.orden.id + " por " + U.precio(res.orden.total) + ". Gracias por tu compra en Link Start.";
      exitoSec.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    function marcar(id, txt) {
      const el = document.getElementById(id);
      el.classList.add("is-invalid"); el.classList.remove("is-valid");
      const caja = document.getElementById("err-" + id);
      caja.textContent = txt; caja.classList.add("show");
    }
    function limpiar(id) {
      const el = document.getElementById(id);
      el.classList.remove("is-invalid");
      const caja = document.getElementById("err-" + id);
      caja.textContent = ""; caja.classList.remove("show");
    }
    function mensaje(txt, ok) {
      exito.textContent = txt;
      exito.classList.toggle("form-success--error", !ok);
      exito.classList.add("show");
    }
  });
})();
