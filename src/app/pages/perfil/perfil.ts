import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { complejidadPassword, edadMinima, passwordsIguales } from '../../validators';

/** Formulario reactivo de edicion de perfil. Requiere sesion iniciada. */
@Component({
  selector: 'app-perfil',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './perfil.html',
})
export class Perfil implements OnInit {
  private fb = inject(FormBuilder);
  protected auth = inject(AuthService);
  private router = inject(Router);

  mensaje = '';
  esError = false;

  form = this.fb.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      usuario: [{ value: '', disabled: true }],
      correo: ['', [Validators.required, Validators.email]],
      fechaNac: ['', [Validators.required, edadMinima(13)]],
      direccion: [''],
      password: ['', [Validators.minLength(6), Validators.maxLength(18), complejidadPassword]],
      password2: [''],
    },
    { validators: passwordsIguales() },
  );

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    const u = this.auth.sesion();
    if (u) {
      this.form.patchValue({
        nombre: u.nombre,
        usuario: u.usuario,
        correo: u.correo,
        fechaNac: u.fechaNac,
        direccion: u.direccion,
      });
    }
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const u = this.auth.sesion();
    if (!u) return;
    const v = this.form.getRawValue();
    const cambios: Record<string, string> = {
      nombre: v.nombre!,
      correo: v.correo!,
      fechaNac: v.fechaNac!,
      direccion: v.direccion ?? '',
    };
    if (v.password) {
      cambios['password'] = v.password;
    }
    const r = this.auth.actualizarPerfil(u.usuario, cambios);
    if (!r.ok) {
      this.esError = true;
      this.mensaje = r.error ?? 'No se pudo guardar.';
      return;
    }
    this.esError = false;
    this.mensaje = 'Datos actualizados correctamente.';
    this.form.patchValue({ password: '', password2: '' });
  }

  cerrarSesion(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
