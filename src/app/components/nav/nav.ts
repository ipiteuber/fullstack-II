import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';

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
