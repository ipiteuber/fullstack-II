import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService } from '../../services/data';
import { CartService } from '../../services/cart';
import { Producto } from '../../models/models';
import { ClpPipe } from '../../pipes/clp-pipe';

const MAPA_CATEGORIAS: Record<string, string> = {
  estrategia: 'Estrategia',
  cooperativos: 'Cooperativos',
  cartas: 'Cartas',
  party: 'Party Games',
};

@Component({
  selector: 'app-categoria',
  imports: [CommonModule, FormsModule, RouterLink, ClpPipe],
  templateUrl: './categoria.html',
})
export class Categoria implements OnInit {
  private route = inject(ActivatedRoute);
  private data = inject(DataService);
  private cart = inject(CartService);

  categoriaNombre = '';
  productos: Producto[] = [];
  filtro = '';
  feedback: { id: string; texto: string; tipo: 'ok' | 'err' } | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe((pm) => {
      const slug = pm.get('cat') ?? '';
      this.categoriaNombre = MAPA_CATEGORIAS[slug] ?? slug;
      this.productos = this.data.productos().filter((p) => p.categoria === this.categoriaNombre);
      this.filtro = '';
      this.feedback = null;
    });
  }

  get productosFiltrados(): Producto[] {
    const q = this.filtro.trim().toLowerCase();
    if (!q) return this.productos;
    return this.productos.filter((p) => p.nombre.toLowerCase().includes(q));
  }

  agregar(prod: Producto): void {
    const r = this.cart.agregar(prod.id, 1);
    this.feedback = r.ok
      ? { id: prod.id, texto: 'Agregado ✓', tipo: 'ok' }
      : { id: prod.id, texto: r.error ?? 'Error', tipo: 'err' };
    setTimeout(() => (this.feedback = null), 1500);
  }
}
