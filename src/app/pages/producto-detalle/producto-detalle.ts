import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductosApiService } from '../../services/productos-api';
import { CartService } from '../../services/cart';
import { Producto } from '../../models/models';
import { ClpPipe } from '../../pipes/clp-pipe';

/** Ficha de detalle de un producto. Lee el :id de la ruta y busca el producto en la API. */
@Component({
  selector: 'app-producto-detalle',
  imports: [CommonModule, RouterLink, ClpPipe],
  templateUrl: './producto-detalle.html',
})
export class ProductoDetalle implements OnInit {
  private route = inject(ActivatedRoute);
  protected api = inject(ProductosApiService);
  private cart = inject(CartService);

  private idActual = '';
  feedback: { texto: string; tipo: 'ok' | 'err' } | null = null;

  ngOnInit(): void {
    this.api.cargar();
    this.route.paramMap.subscribe((pm) => {
      this.idActual = pm.get('id') ?? '';
      this.feedback = null;
    });
  }

  get producto(): Producto | undefined {
    return this.api.productos().find((p) => p.id === this.idActual);
  }

  slugCategoria(categoria: string): string {
    const mapa: Record<string, string> = {
      Estrategia: 'estrategia',
      Cooperativos: 'cooperativos',
      Cartas: 'cartas',
      'Party Games': 'party',
    };
    return mapa[categoria] ?? '';
  }

  agregar(): void {
    if (!this.producto) return;
    const r = this.cart.agregar(this.producto.id, 1);
    this.feedback = r.ok
      ? { texto: 'Agregado al carrito ✓', tipo: 'ok' }
      : { texto: r.error ?? 'Error', tipo: 'err' };
    setTimeout(() => (this.feedback = null), 1800);
  }
}
