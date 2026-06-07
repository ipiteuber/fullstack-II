(function () {
  "use strict";

  const D = window.LinkStartData;

  const Cart = window.LinkStartCart = {
    obtener() {
      return D.leer(D.K_CART, []);
    },

    agregar(idProducto, cantidad) {
      cantidad = cantidad || 1;
      const productos = D.leer(D.K_PRODUCTS, []);
      const prod = productos.find(p => p.id === idProducto);
      if (!prod) return { ok: false, error: "Producto no encontrado." };

      const carrito = this.obtener();
      const linea = carrito.find(i => i.id === idProducto);
      const enCarrito = linea ? linea.cant : 0;
      if (enCarrito + cantidad > prod.stock) {
        return { ok: false, error: "No hay stock suficiente. Disponibles: " + prod.stock };
      }

      if (linea) {
        linea.cant += cantidad;
      } else {
        carrito.push({ id: prod.id, nombre: prod.nombre, precio: prod.precio, img: prod.img, cant: cantidad });
      }
      D.guardar(D.K_CART, carrito);
      return { ok: true, total: this.totalItems() };
    },

    cambiarCantidad(idProducto, cantidad) {
      const carrito = this.obtener();
      const linea = carrito.find(i => i.id === idProducto);
      if (!linea) return;
      linea.cant = Math.max(1, cantidad);
      D.guardar(D.K_CART, carrito);
    },

    quitar(idProducto) {
      const carrito = this.obtener().filter(i => i.id !== idProducto);
      D.guardar(D.K_CART, carrito);
    },

    vaciar() {
      D.guardar(D.K_CART, []);
    },

    totalItems() {
      return this.obtener().reduce((s, i) => s + i.cant, 0);
    },

    totalCLP() {
      return this.obtener().reduce((s, i) => s + i.precio * i.cant, 0);
    },

    // Convierte el carrito en una orden, descuenta stock y vacia el carrito
    confirmarCompra(usuario) {
      const carrito = this.obtener();
      if (!carrito.length) return { ok: false, error: "El carrito está vacío." };

      const productos = D.leer(D.K_PRODUCTS, []);
      for (const linea of carrito) {
        const prod = productos.find(p => p.id === linea.id);
        if (!prod || prod.stock < linea.cant) {
          return { ok: false, error: "Sin stock para " + linea.nombre + "." };
        }
      }
      productos.forEach(p => {
        const linea = carrito.find(i => i.id === p.id);
        if (linea) p.stock -= linea.cant;
      });
      D.guardar(D.K_PRODUCTS, productos);

      const ordenes = D.leer(D.K_ORDERS, []);
      const orden = {
        id: "ORD-" + (ordenes.length + 1).toString().padStart(4, "0"),
        usuario: usuario,
        fecha: window.LinkStartUtil.hoyISO(),
        items: carrito,
        total: this.totalCLP(),
      };
      ordenes.push(orden);
      D.guardar(D.K_ORDERS, ordenes);
      this.vaciar();
      return { ok: true, orden: orden };
    },

    ordenesDe(usuario) {
      return D.leer(D.K_ORDERS, []).filter(o => o.usuario.toLowerCase() === usuario.toLowerCase());
    },
  };
})();
