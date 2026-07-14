import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';
import { ProductosApiService } from '../../services/productos-api';
import { Orden } from '../../models/models';
import { ClpPipe } from '../../pipes/clp-pipe';

/** Pago simulado. Requiere sesion y carrito con productos; genera la orden. */
@Component({
  selector: 'app-pago',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ClpPipe],
  templateUrl: './pago.html',
})
export class Pago {
  private fb = inject(FormBuilder);
  protected auth = inject(AuthService);
  protected cart = inject(CartService);
  private api = inject(ProductosApiService);

  mensaje = '';
  ordenExito: Orden | null = null;

  form = this.fb.group({
    tarjeta: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
    vence: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
    cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
  });

  get f() {
    return this.form.controls;
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const u = this.auth.sesion();
    if (!u) return;
    const r = this.cart.confirmarCompra(u.usuario);
    if (!r.ok) {
      this.mensaje = r.error ?? 'No se pudo procesar el pago.';
      return;
    }
    this.ordenExito = r.orden!;
    // Refleja en Firebase (PUT) el stock descontado por la compra
    this.api.sincronizarStock(this.ordenExito.items);
  }
}
