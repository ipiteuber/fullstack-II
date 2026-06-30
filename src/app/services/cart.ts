import { Injectable, inject, signal, computed } from '@angular/core';
import { DataService } from './data';
import { CartItem, Orden } from '../models/models';

/**
 * Servicio del carrito de compras. Mantiene las lineas del carrito como signal
 * (para que el contador del menu se actualice solo), calcula los totales y
 * genera la orden al confirmar la compra descontando el stock.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private data = inject(DataService);

  readonly items = signal<CartItem[]>(this.data.carrito());
  readonly totalItems = computed(() => this.items().reduce((s, i) => s + i.cant, 0));
  readonly totalCLP = computed(() => this.items().reduce((s, i) => s + i.precio * i.cant, 0));

  private persistir(lista: CartItem[]): void {
    this.items.set(lista);
    this.data.guardarCarrito(lista);
  }

  obtener(): CartItem[] {
    return this.items();
  }

  /** Agrega un producto al carrito validando que exista y que haya stock. */
  agregar(idProducto: string, cantidad = 1): { ok: boolean; total?: number; error?: string } {
    const prod = this.data.productos().find((p) => p.id === idProducto);
    if (!prod) {
      return { ok: false, error: 'Producto no encontrado.' };
    }
    const lista = [...this.items()];
    const linea = lista.find((l) => l.id === idProducto);
    const cantActual = linea ? linea.cant : 0;
    if (cantActual + cantidad > prod.stock) {
      return { ok: false, error: 'No hay stock suficiente. Disponibles: ' + prod.stock };
    }
    if (linea) {
      linea.cant += cantidad;
    } else {
      lista.push({ id: prod.id, nombre: prod.nombre, precio: prod.precio, img: prod.img, cant: cantidad });
    }
    this.persistir(lista);
    return { ok: true, total: this.totalItems() };
  }

  cambiarCantidad(idProducto: string, cantidad: number): void {
    const lista = this.items().map((l) =>
      l.id === idProducto ? { ...l, cant: Math.max(1, cantidad) } : l,
    );
    this.persistir(lista);
  }

  quitar(idProducto: string): void {
    this.persistir(this.items().filter((l) => l.id !== idProducto));
  }

  vaciar(): void {
    this.persistir([]);
  }

  /** Confirma la compra: valida stock, genera la orden, la guarda y vacia el carrito. */
  confirmarCompra(usuario: string): { ok: boolean; orden?: Orden; error?: string } {
    const lista = this.items();
    if (lista.length === 0) {
      return { ok: false, error: 'El carrito está vacío.' };
    }
    const productos = this.data.productos();
    for (const linea of lista) {
      const prod = productos.find((p) => p.id === linea.id);
      if (!prod || prod.stock < linea.cant) {
        return { ok: false, error: 'Sin stock para ' + linea.nombre + '.' };
      }
    }
    // Descontar stock
    for (const linea of lista) {
      const prod = productos.find((p) => p.id === linea.id)!;
      prod.stock -= linea.cant;
    }
    this.data.guardarProductos(productos);

    const ordenes = this.data.ordenes();
    const orden: Orden = {
      id: 'ORD-' + String(ordenes.length + 1).padStart(4, '0'),
      usuario,
      fecha: new Date().toISOString().slice(0, 10),
      items: lista.map((l) => ({ ...l })),
      total: this.totalCLP(),
    };
    ordenes.push(orden);
    this.data.guardarOrdenes(ordenes);
    this.vaciar();
    return { ok: true, orden };
  }

  ordenesDe(usuario: string): Orden[] {
    return this.data.ordenes().filter((o) => o.usuario.toLowerCase() === usuario.toLowerCase());
  }
}
