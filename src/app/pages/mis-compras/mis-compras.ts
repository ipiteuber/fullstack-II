import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';
import { Orden } from '../../models/models';
import { ClpPipe } from '../../pipes/clp-pipe';

/** Historial de ordenes del usuario que inicio sesion. */
@Component({
  selector: 'app-mis-compras',
  imports: [CommonModule, RouterLink, ClpPipe],
  templateUrl: './mis-compras.html',
})
export class MisCompras implements OnInit {
  protected auth = inject(AuthService);
  private cart = inject(CartService);

  ordenes: Orden[] = [];

  ngOnInit(): void {
    const u = this.auth.sesion();
    if (u) {
      this.ordenes = this.cart.ordenesDe(u.usuario).slice().reverse();
    }
  }
}
