import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductosApiService } from '../../services/productos-api';
import { CartService } from '../../services/cart';
import { Producto } from '../../models/models';
import { GameCard } from '../../components/game-card/game-card';

const MAPA_CATEGORIAS: Record<string, string> = {
  estrategia: 'Estrategia',
  cooperativos: 'Cooperativos',
  cartas: 'Cartas',
  party: 'Party Games',
};

/**
 * Pagina de catalogo por categoria. Lee el parametro de la ruta (categoria/:cat),
 * obtiene los productos desde la API REST (GET) y los muestra con un buscador
 * en vivo. Cada producto se renderiza con el componente hijo GameCard.
 */
@Component({
  selector: 'app-categoria',
  imports: [CommonModule, FormsModule, GameCard],
  templateUrl: './categoria.html',
})
export class Categoria implements OnInit {
  private route = inject(ActivatedRoute);
  protected api = inject(ProductosApiService);
  private cart = inject(CartService);

  categoriaNombre = '';
  filtro = '';
  feedback: { id: string; texto: string; tipo: 'ok' | 'err' } | null = null;

  ngOnInit(): void {
    this.api.cargar();
    this.route.paramMap.subscribe((pm) => {
      const slug = pm.get('cat') ?? '';
      this.categoriaNombre = MAPA_CATEGORIAS[slug] ?? slug;
      this.filtro = '';
      this.feedback = null;
    });
  }

  /** Productos de la categoria actual, leidos del catalogo remoto. */
  get productosCategoria(): Producto[] {
    return this.api.productos().filter((p) => p.categoria === this.categoriaNombre);
  }

  /** Productos visibles segun el texto escrito en el buscador. */
  get productosFiltrados(): Producto[] {
    const q = this.filtro.trim().toLowerCase();
    if (!q) return this.productosCategoria;
    return this.productosCategoria.filter((p) => p.nombre.toLowerCase().includes(q));
  }

  /** Agrega el producto al carrito y muestra el feedback en su ficha. */
  agregar(prod: Producto): void {
    const r = this.cart.agregar(prod.id, 1);
    this.feedback = r.ok
      ? { id: prod.id, texto: 'Agregado ✓', tipo: 'ok' }
      : { id: prod.id, texto: r.error ?? 'Error', tipo: 'err' };
    setTimeout(() => (this.feedback = null), 1500);
  }
}
