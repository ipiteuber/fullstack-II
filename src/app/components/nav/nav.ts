import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';

/**
 * Barra de navegacion superior. Arma el menu segun la sesion y el rol del
 * usuario y muestra el contador de productos del carrito.
 */
@Component({
  selector: 'app-nav',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
})
export class Nav {
  protected auth = inject(AuthService);
  protected cart = inject(CartService);
  private router = inject(Router);

  salir(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
