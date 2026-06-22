import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  mensaje = '';
  esError = false;

  form = this.fb.group({
    usuario: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { usuario, password } = this.form.value;
    const r = this.auth.login(usuario!, password!);
    if (!r.ok) {
      this.esError = true;
      this.mensaje = r.error ?? 'Error al ingresar.';
      return;
    }
    this.esError = false;
    this.mensaje = 'Bienvenido, ' + r.usuario!.nombre + '. Redirigiendo...';
    const destino = r.usuario!.rol === 'admin' ? '/admin/productos' : '/';
    setTimeout(() => this.router.navigate([destino]), 1200);
  }

  limpiar(): void {
    this.form.reset();
    this.mensaje = '';
    this.esError = false;
  }
}
