import { Injectable } from '@angular/core';
import { Producto, Usuario, Orden, CartItem } from '../models/models';

const CATALOGO_INICIAL: Producto[] = [
  { id: 'catan',            nombre: 'Catan',            categoria: 'Estrategia',   precio: 34990, precioOld: null,  stock: 12, img: 'img/juegos/catan.jpg',            desc: 'El clásico de comercio y construcción. Recolecta recursos y domina la isla.' },
  { id: 'carcassonne',      nombre: 'Carcassonne',      categoria: 'Estrategia',   precio: 29990, precioOld: 39990, stock: 8,  img: 'img/juegos/carcassonne.jpg',      desc: 'Coloca losetas y forma ciudades, caminos y monasterios medievales.' },
  { id: 'risk',             nombre: 'Risk',             categoria: 'Estrategia',   precio: 42990, precioOld: null,  stock: 5,  img: 'img/juegos/risk.jpg',             desc: 'Conquista el mundo en este icónico juego de estrategia militar global.' },
  { id: 'pandemic',         nombre: 'Pandemic',         categoria: 'Cooperativos', precio: 39990, precioOld: 49990, stock: 10, img: 'img/juegos/pandemic.jpg',         desc: 'Trabajen juntos para salvar al mundo de cuatro enfermedades mortales.' },
  { id: 'forbidden-island', nombre: 'Forbidden Island', categoria: 'Cooperativos', precio: 24990, precioOld: null,  stock: 15, img: 'img/juegos/forbidden-island.jpg', desc: 'Una isla se hunde y deben recuperar los tesoros antes de escapar.' },
  { id: 'mysterium',        nombre: 'Mysterium',        categoria: 'Cooperativos', precio: 44990, precioOld: null,  stock: 6,  img: 'img/juegos/mysterium.jpg',        desc: 'Un fantasma envía visiones a médiums para resolver un asesinato.' },
  { id: 'munchkin',         nombre: 'Munchkin',         categoria: 'Cartas',       precio: 19990, precioOld: null,  stock: 20, img: 'img/juegos/munchkin.jpg',         desc: 'Mata monstruos, roba el tesoro, traiciona a tus amigos. Humor y caos.' },
  { id: 'exploding-kittens',nombre: 'Exploding Kittens',categoria: 'Cartas',       precio: 22990, precioOld: 28990, stock: 18, img: 'img/juegos/exploding-kittens.jpg',desc: 'Evita los gatos explosivos en este juego rápido e impredecible.' },
  { id: 'coup',             nombre: 'Coup',             categoria: 'Cartas',       precio: 14990, precioOld: null,  stock: 14, img: 'img/juegos/coup.jpg',             desc: 'Engaño, mentiras y traición en una corte real. Solo el más astuto sobrevive.' },
  { id: 'codenames',        nombre: 'Codenames',        categoria: 'Party Games',  precio: 26990, precioOld: null,  stock: 9,  img: 'img/juegos/codenames.jpg',        desc: 'Dos equipos compiten para identificar agentes secretos con una palabra.' },
  { id: 'dixit',            nombre: 'Dixit',            categoria: 'Party Games',  precio: 34990, precioOld: 44990, stock: 7,  img: 'img/juegos/dixit.jpg',            desc: 'Ilustraciones surrealistas y pistas creativas. Adivina la carta del narrador.' },
  { id: 'just-one',         nombre: 'Just One',         categoria: 'Party Games',  precio: 21990, precioOld: null,  stock: 11, img: 'img/juegos/just-one.jpg',         desc: 'Cooperativo de palabras: da pistas, pero cuidado con los duplicados.' },
];

const USUARIO_ADMIN: Usuario = {
  nombre: 'Administrador Link Start',
  usuario: 'admin',
  correo: 'admin@linkstart.cl',
  password: 'Admin#2026',
  fechaNac: '1990-01-01',
  direccion: 'Oficina central',
  rol: 'admin',
};

/**
 * Capa de acceso a datos. Centraliza la lectura y escritura en localStorage
 * (usuarios, productos, ordenes y carrito) y deja precargado el catalogo y la
 * cuenta de administrador la primera vez que se abre la aplicacion.
 */
@Injectable({ providedIn: 'root' })
export class DataService {
  readonly K_USERS = 'ls_users';
  readonly K_SESSION = 'ls_session';
  readonly K_PRODUCTS = 'ls_products';
  readonly K_CART = 'ls_cart';
  readonly K_ORDERS = 'ls_orders';

  constructor() {
    this.sembrar();
  }

  leer<T>(clave: string, porDefecto: T): T {
    try {
      const raw = localStorage.getItem(clave);
      return raw ? (JSON.parse(raw) as T) : porDefecto;
    } catch {
      return porDefecto;
    }
  }

  guardar(clave: string, valor: unknown): void {
    localStorage.setItem(clave, JSON.stringify(valor));
  }

  // La sesion activa vive en sessionStorage y se borra al cerrar la pestaña
  leerSesion(): Usuario | null {
    try {
      const raw = sessionStorage.getItem(this.K_SESSION);
      return raw ? (JSON.parse(raw) as Usuario) : null;
    } catch {
      return null;
    }
  }

  guardarSesion(valor: Usuario): void {
    sessionStorage.setItem(this.K_SESSION, JSON.stringify(valor));
  }

  borrarSesion(): void {
    sessionStorage.removeItem(this.K_SESSION);
  }

  productos(): Producto[] {
    return this.leer<Producto[]>(this.K_PRODUCTS, []);
  }

  guardarProductos(lista: Producto[]): void {
    this.guardar(this.K_PRODUCTS, lista);
  }

  usuarios(): Usuario[] {
    return this.leer<Usuario[]>(this.K_USERS, []);
  }

  guardarUsuarios(lista: Usuario[]): void {
    this.guardar(this.K_USERS, lista);
  }

  ordenes(): Orden[] {
    return this.leer<Orden[]>(this.K_ORDERS, []);
  }

  guardarOrdenes(lista: Orden[]): void {
    this.guardar(this.K_ORDERS, lista);
  }

  carrito(): CartItem[] {
    return this.leer<CartItem[]>(this.K_CART, []);
  }

  guardarCarrito(lista: CartItem[]): void {
    this.guardar(this.K_CART, lista);
  }

  /** Precarga el catalogo, la cuenta admin y la lista de ordenes si no existen. */
  private sembrar(): void {
    if (!localStorage.getItem(this.K_PRODUCTS)) {
      this.guardarProductos(CATALOGO_INICIAL);
    }
    const users = this.usuarios();
    if (!users.some((u) => u.usuario === USUARIO_ADMIN.usuario)) {
      users.push(USUARIO_ADMIN);
      this.guardarUsuarios(users);
    }
    if (!localStorage.getItem(this.K_ORDERS)) {
      this.guardarOrdenes([]);
    }
  }
}
