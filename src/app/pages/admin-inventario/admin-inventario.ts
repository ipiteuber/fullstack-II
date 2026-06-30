import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { DataService } from '../../services/data';
import { Producto } from '../../models/models';

/** Control de inventario (solo admin): ajustar el stock de cada producto. */
@Component({
  selector: 'app-admin-inventario',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-inventario.html',
})
export class AdminInventario implements OnInit {
  protected auth = inject(AuthService);
  private data = inject(DataService);

  productos: Producto[] = [];
  mensaje = '';
  esError = false;

  ngOnInit(): void {
    this.refrescar();
  }

  private refrescar(): void {
    this.productos = this.data.productos();
  }

  actualizar(id: string, valor: string): void {
    const n = parseInt(valor, 10);
    if (isNaN(n) || n < 0) {
      this.esError = true;
      this.mensaje = 'Ingresa un número de stock válido (≥ 0).';
      return;
    }
    const lista = this.data.productos();
    const prod = lista.find((p) => p.id === id);
    if (prod) {
      prod.stock = n;
      this.data.guardarProductos(lista);
      this.refrescar();
      this.esError = false;
      this.mensaje = 'Stock de ' + prod.nombre + ' actualizado a ' + n + '.';
    }
  }
}
