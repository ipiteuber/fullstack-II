// Modelos de datos de la aplicacion

export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  precioOld: number | null;
  stock: number;
  img: string;
  desc: string;
}

export interface Usuario {
  usuario: string;
  password: string;
  nombre: string;
  correo: string;
  fechaNac: string;
  direccion: string;
  rol: 'cliente' | 'admin';
}

export interface CartItem {
  id: string;
  nombre: string;
  precio: number;
  img: string;
  cant: number;
}

export interface Orden {
  id: string;
  usuario: string;
  fecha: string;
  items: CartItem[];
  total: number;
}

export type Resultado<T> = { ok: true; valor: T } | { ok: false; error: string };
