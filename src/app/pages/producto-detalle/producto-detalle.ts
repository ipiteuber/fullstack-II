import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService } from '../../services/data';
import { CartService } from '../../services/cart';
import { Producto } from '../../models/models';
import { ClpPipe } from '../../pipes/clp-pipe';

@Component({
  selector: 'app-producto-detalle',
  imports: [CommonModule, RouterLink, ClpPipe],
  templateUrl: './producto-detalle.html',
})
export class ProductoDetalle implements OnInit {
  private route = inject(ActivatedRoute);
  private data = inject(DataService);
  private cart = inject(CartService);

  producto?: Producto;
  feedback: { texto: string; tipo: 'ok' | 'err' } | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe((pm) => {
      const id = pm.get('id') ?? '';
      this.producto = this.data.productos().find((p) => p.id === id);
      this.feedback = null;
    });
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
