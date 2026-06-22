(function () {
  "use strict";

  const A = window.LinkStartAuth;
  const D = window.LinkStartData;
  const V = window.LinkStartValid;
  const U = window.LinkStartUtil;

  document.addEventListener("DOMContentLoaded", function () {
    const contenido = document.getElementById("admin-contenido");
    const guard = document.getElementById("admin-guard");

    if (!A.esAdmin()) { guard.hidden = false; return; }
    contenido.hidden = false;

    const form = document.getElementById("producto-form");
    const body = document.getElementById("prod-body");
    const exito = document.getElementById("form-success");
    const editId = document.getElementById("edit-id");
    const titulo = document.getElementById("form-titulo");
    const btnGuardar = document.getElementById("btn-guardar");

    const f = {
      nombre: document.getElementById("nombre"),
      categoria: document.getElementById("categoria"),
      precio: document.getElementById("precio"),
      precioOld: document.getElementById("precioOld"),
      stock: document.getElementById("stock"),
      img: document.getElementById("img"),
      desc: document.getElementById("desc"),
    };

    function productos() { return D.leer(D.K_PRODUCTS, []); }

    function render() {
      const lista = productos();
      body.textContent = "";
      lista.forEach(function (p) {
        const tr = document.createElement("tr");
        const c1 = celda(p.nombre);
        const c2 = celda(p.categoria);
        const c3 = celda(U.precio(p.precio)); c3.className = "precio";
        const c4 = celda(String(p.stock));
        const c5 = document.createElement("td");

        const bEdit = document.createElement("button");
        bEdit.className = "btn-mini btn-mini--ok";
        bEdit.textContent = "Editar";
        bEdit.addEventListener("click", function () { cargar(p); });

        const bDel = document.createElement("button");
        bDel.className = "btn-mini";
        bDel.style.marginLeft = "0.5rem";
        bDel.textContent = "Eliminar";
        bDel.addEventListener("click", function () { eliminar(p.id); });

        c5.append(bEdit, bDel);
        tr.append(c1, c2, c3, c4, c5);
        body.appendChild(tr);
      });
    }

    function celda(txt) {
      const td = document.createElement("td");
      td.textContent = txt;
      return td;
    }

    function cargar(p) {
      editId.value = p.id;
      f.nombre.value = p.nombre;
      f.categoria.value = p.categoria;
      f.precio.value = p.precio;
      f.precioOld.value = p.precioOld || "";
      f.stock.value = p.stock;
      f.img.value = p.img;
      f.desc.value = p.desc;
      titulo.textContent = "// Editando: " + p.nombre;
      btnGuardar.textContent = "Guardar cambios";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function limpiarForm() {
      form.reset();
      editId.value = "";
      titulo.textContent = "// Nuevo producto";
      btnGuardar.textContent = "Agregar producto";
      ["nombre", "categoria", "precio", "stock", "desc"].forEach(limpiar);
    }

    document.getElementById("btn-cancelar").addEventListener("click", function () {
      limpiarForm();
      exito.classList.remove("show");
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let ok = true;

      if (V.vacio(f.nombre.value)) { marcar("nombre", "Ingresa el nombre."); ok = false; } else limpiar("nombre");
      if (V.vacio(f.categoria.value)) { marcar("categoria", "Selecciona una categoria."); ok = false; } else limpiar("categoria");
      if (f.precio.value === "" || Number(f.precio.value) < 0) { marcar("precio", "Precio invalido."); ok = false; } else limpiar("precio");
      if (f.stock.value === "" || Number(f.stock.value) < 0) { marcar("stock", "Stock invalido."); ok = false; } else limpiar("stock");
      if (V.vacio(f.desc.value)) { marcar("desc", "Ingresa una descripcion."); ok = false; } else limpiar("desc");

      if (!ok) return;

      const lista = productos();
      const datos = {
        nombre: f.nombre.value.trim(),
        categoria: f.categoria.value,
        precio: Number(f.precio.value),
        precioOld: f.precioOld.value ? Number(f.precioOld.value) : null,
        stock: Number(f.stock.value),
        img: f.img.value.trim() || "img/juegos/coup.jpg",
        desc: f.desc.value.trim(),
      };

      if (editId.value) {
        const i = lista.findIndex(p => p.id === editId.value);
        if (i !== -1) lista[i] = Object.assign(lista[i], datos);
        mensaje("Producto actualizado.", true);
      } else {
        datos.id = generarId(datos.nombre, lista);
        lista.push(datos);
        mensaje("Producto agregado al catalogo.", true);
      }
      D.guardar(D.K_PRODUCTS, lista);
      limpiarForm();
      render();
    });

    function eliminar(id) {
      const lista = productos().filter(p => p.id !== id);
      D.guardar(D.K_PRODUCTS, lista);
      mensaje("Producto eliminado.", true);
      render();
    }

    function generarId(nombre, lista) {
      let base = nombre.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      let id = base, n = 2;
      while (lista.some(p => p.id === id)) { id = base + "-" + n; n++; }
      return id;
    }

    function marcar(id, txt) {
      const el = f[id];
      el.classList.add("is-invalid"); el.classList.remove("is-valid");
      const caja = document.getElementById("err-" + id);
      if (caja) { caja.textContent = txt; caja.classList.add("show"); }
    }
    function limpiar(id) {
      const el = f[id];
      el.classList.remove("is-invalid");
      const caja = document.getElementById("err-" + id);
      if (caja) { caja.textContent = ""; caja.classList.remove("show"); }
    }
    function mensaje(txt, ok) {
      exito.textContent = txt;
      exito.classList.toggle("form-success--error", !ok);
      exito.classList.add("show");
    }

    render();
  });
})();
