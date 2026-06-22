import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart';
import { ClpPipe } from '../../pipes/clp-pipe';

@Component({
  selector: 'app-carrito',
  imports: [CommonModule, RouterLink, ClpPipe],
  templateUrl: './carrito.html',
})
export class Carrito {
  protected cart = inject(CartService);

  cambiar(id: string, ev: Event): void {
    const valor = Number((ev.target as HTMLInputElement).value);
    this.cart.cambiarCantidad(id, valor);
  }

  quitar(id: string): void {
    this.cart.quitar(id);
  }

  vaciar(): void {
    this.cart.vaciar();
  }
}
