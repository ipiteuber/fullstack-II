import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { complejidadPassword, edadMinima, passwordsIguales } from '../../validators';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
})
export class Registro {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly hoy = new Date().toISOString().slice(0, 10);
  mensaje = '';
  esError = false;

  form = this.fb.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      usuario: ['', [Validators.required, Validators.minLength(4)]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(18), complejidadPassword]],
      password2: ['', [Validators.required]],
      fechaNac: ['', [Validators.required, edadMinima(13)]],
      direccion: [''],
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
    const r = this.auth.registrar({
      nombre: v.nombre!,
      usuario: v.usuario!,
      correo: v.correo!,
      password: v.password!,
      fechaNac: v.fechaNac!,
      direccion: v.direccion ?? '',
    });
    if (!r.ok) {
      this.esError = true;
      this.mensaje = r.error ?? 'No se pudo registrar.';
      return;
    }
    this.esError = false;
    this.mensaje = 'Cuenta creada con éxito. Redirigiendo al inicio de sesión...';
    setTimeout(() => this.router.navigate(['/login']), 1600);
  }

  limpiar(): void {
    this.form.reset();
    this.mensaje = '';
    this.esError = false;
  }
}
