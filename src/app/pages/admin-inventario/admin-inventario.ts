import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ProductosApiService } from '../../services/productos-api';
import { Producto } from '../../models/models';

/** Control de inventario (solo admin). Actualiza el stock via PUT en la API. */
@Component({
  selector: 'app-admin-inventario',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-inventario.html',
})
export class AdminInventario implements OnInit {
  protected auth = inject(AuthService);
  protected api = inject(ProductosApiService);

  mensaje = '';
  esError = false;

  get productos(): Producto[] {
    return this.api.productos();
  }

  ngOnInit(): void {
    this.api.cargar();
  }

  actualizar(p: Producto, valor: string): void {
    const n = parseInt(valor, 10);
    if (isNaN(n) || n < 0) {
      this.esError = true;
      this.mensaje = 'Ingresa un número de stock válido (≥ 0).';
      return;
    }
    this.api.actualizar({ ...p, stock: n }).subscribe({
      next: () => {
        this.esError = false;
        this.mensaje = 'Stock de ' + p.nombre + ' actualizado a ' + n + '.';
        this.api.cargar(true);
      },
      error: () => {
        this.esError = true;
        this.mensaje = 'No se pudo actualizar el stock en la API.';
      },
    });
  }
}
