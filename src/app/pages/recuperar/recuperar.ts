import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { complejidadPassword, passwordsIguales } from '../../validators';

/** Formulario reactivo para cambiar la contraseña a partir del correo. */
@Component({
  selector: 'app-recuperar',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './recuperar.html',
})
export class Recuperar {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  mensaje = '';
  esError = false;

  form = this.fb.group(
    {
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(18), complejidadPassword]],
      password2: ['', [Validators.required]],
    },
    { validators: passwordsIguales() },
  );

  get f() {
    return this.form.controls;
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const r = this.auth.cambiarPassword(v.correo!, v.password!);
    if (!r.ok) {
      this.esError = true;
      this.mensaje = r.error ?? 'No se pudo actualizar.';
      return;
    }
    this.esError = false;
    this.mensaje = 'Contraseña actualizada. Redirigiendo al inicio de sesión...';
    setTimeout(() => this.router.navigate(['/login']), 1600);
  }

  limpiar(): void {
    this.form.reset();
    this.mensaje = '';
    this.esError = false;
  }
}
