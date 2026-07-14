import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { DataService, CATALOGO_INICIAL } from './data';
import { API_URL, apiConfigurada } from './api.config';
import { Producto, CartItem } from '../models/models';

/**
 * Servicio que consume la API REST de Firebase para el catalogo de productos,
 * usando los cuatro metodos HTTP: GET (leer), POST (crear), PUT (actualizar)
 * y DELETE (eliminar). Mantiene una copia del catalogo en localStorage para
 * que el carrito y el control de stock sigan funcionando de forma sincrona.
 * Si la URL de Firebase todavia no esta configurada, trabaja en modo local.
 */
@Injectable({ providedIn: 'root' })
export class ProductosApiService {
  private http = inject(HttpClient);
  private data = inject(DataService);
  private apiUrl = inject(API_URL);

  readonly productos = signal<Producto[]>([]);
  readonly cargando = signal(false);
  readonly error = signal('');
  readonly remota = signal(false);

  private cargado = false;

  get modoLocal(): boolean {
    return !apiConfigurada(this.apiUrl);
  }

  private url(ruta: string): string {
    return `${this.apiUrl}/${ruta}.json`;
  }

  cargar(forzar = false): void {
    if (this.cargado && !forzar) return;
    this.cargado = true;

    if (this.modoLocal) {
      this.productos.set(this.data.productos());
      return;
    }

    this.cargando.set(true);
    this.error.set('');
    this.http.get<Record<string, Producto> | null>(this.url('productos')).subscribe({
      next: (respuesta) => {
        if (!respuesta) {
          this.sembrarRemoto();
          return;
        }
        const lista = Object.entries(respuesta).map(([fbKey, prod]) => ({ ...prod, fbKey }));
        this.productos.set(lista);
        this.data.guardarProductos(lista);
        this.remota.set(true);
        this.cargando.set(false);
      },
      error: () => this.fallbackLocal('No se pudo conectar con Firebase. Se muestra el catalogo local.'),
    });
  }


  private fallbackLocal(mensaje: string): void {
    this.productos.set(this.data.productos());
    this.error.set(mensaje);
    this.cargando.set(false);
    // Se permite reintentar en la proxima navegacion
    this.cargado = false;
  }

  private sembrarRemoto(): void {
    const catalogo: Record<string, Producto> = {};
    for (const p of CATALOGO_INICIAL) {
      catalogo[p.id] = p;
    }
    this.http.put(this.url('productos'), catalogo).subscribe({
      next: () => this.cargar(true),
      error: () => this.fallbackLocal('No se pudo sembrar el catalogo en Firebase.'),
    });
  }

  
  crear(producto: Producto): Observable<unknown> {
    if (this.modoLocal) {
      const lista = [...this.data.productos(), producto];
      this.data.guardarProductos(lista);
      this.productos.set(lista);
      return of(null);
    }
    return this.http.post<{ name: string }>(this.url('productos'), producto);
  }

  
  actualizar(producto: Producto): Observable<unknown> {
    if (this.modoLocal) {
      const lista = this.data.productos().map((p) => (p.id === producto.id ? { ...producto } : p));
      this.data.guardarProductos(lista);
      this.productos.set(lista);
      return of(null);
    }
    if (!producto.fbKey) {
      return throwError(() => new Error('Producto sin clave de Firebase. Recarga el catalogo.'));
    }
    const { fbKey, ...datos } = producto;
    return this.http.put(this.url(`productos/${fbKey}`), datos);
  }

  
  eliminar(producto: Producto): Observable<unknown> {
    if (this.modoLocal) {
      const lista = this.data.productos().filter((p) => p.id !== producto.id);
      this.data.guardarProductos(lista);
      this.productos.set(lista);
      return of(null);
    }
    if (!producto.fbKey) {
      return throwError(() => new Error('Producto sin clave de Firebase. Recarga el catalogo.'));
    }
    return this.http.delete(this.url(`productos/${producto.fbKey}`));
  }


  sincronizarStock(items: CartItem[]): void {
    const locales = this.data.productos();
    this.productos.set(locales);
    if (this.modoLocal) return;

    const puts: Observable<unknown>[] = [];
    for (const item of items) {
      const local = locales.find((p) => p.id === item.id);
      if (local?.fbKey) {
        const { fbKey, ...datos } = local;
        puts.push(this.http.put(this.url(`productos/${fbKey}`), datos));
      }
    }
    if (puts.length === 0) return;

    forkJoin(puts).subscribe({
      next: () => this.cargar(true),
      error: () => this.error.set('No se pudo actualizar el stock en Firebase.'),
    });
  }
}
