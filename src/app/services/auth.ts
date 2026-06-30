import { Injectable, inject, signal } from '@angular/core';
import { DataService } from './data';
import { Usuario } from '../models/models';

export interface DatosRegistro {
  nombre: string;
  usuario: string;
  correo: string;
  password: string;
  fechaNac: string;
  direccion: string;
}

/**
 * Servicio de autenticacion. Maneja el registro, el inicio y cierre de sesion,
 * los roles (cliente y admin) y la edicion del perfil. La sesion activa se
 * expone como signal para que el menu reaccione al ingresar o salir.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private data = inject(DataService);

  // Sesion reactiva para que el menu se actualice al ingresar o salir
  readonly sesionActual = signal<Usuario | null>(this.data.leerSesion());

  sesion(): Usuario | null {
    return this.sesionActual();
  }

  estaLogueado(): boolean {
    return this.sesionActual() !== null;
  }

  esAdmin(): boolean {
    return this.sesionActual()?.rol === 'admin';
  }

  buscarPorUsuario(usuario: string): Usuario | undefined {
    const u = usuario.trim().toLowerCase();
    return this.data.usuarios().find((x) => x.usuario.toLowerCase() === u);
  }

  buscarPorCorreo(correo: string): Usuario | undefined {
    const c = correo.trim().toLowerCase();
    return this.data.usuarios().find((x) => x.correo.toLowerCase() === c);
  }

  /**
   * Registra un nuevo usuario con rol cliente. Rechaza el registro si el
   * usuario o el correo ya estan tomados.
   */
  registrar(datos: DatosRegistro): { ok: boolean; usuario?: Usuario; error?: string } {
    if (this.buscarPorUsuario(datos.usuario)) {
      return { ok: false, error: 'Ese nombre de usuario ya está registrado.' };
    }
    if (this.buscarPorCorreo(datos.correo)) {
      return { ok: false, error: 'Ese correo ya está registrado.' };
    }
    const nuevo: Usuario = {
      nombre: datos.nombre.trim(),
      usuario: datos.usuario.trim(),
      correo: datos.correo.trim(),
      password: datos.password,
      fechaNac: datos.fechaNac,
      direccion: (datos.direccion || '').trim(),
      rol: 'cliente',
    };
    const lista = this.data.usuarios();
    lista.push(nuevo);
    this.data.guardarUsuarios(lista);
    return { ok: true, usuario: nuevo };
  }

  /** Inicia sesion aceptando nombre de usuario o correo, y guarda la sesion. */
  login(usuarioOcorreo: string, password: string): { ok: boolean; usuario?: Usuario; error?: string } {
    const ident = usuarioOcorreo.trim().toLowerCase();
    const user = this.data
      .usuarios()
      .find((u) => u.usuario.toLowerCase() === ident || u.correo.toLowerCase() === ident);
    if (!user || user.password !== password) {
      return { ok: false, error: 'Usuario o contraseña incorrectos.' };
    }
    this.data.guardarSesion(user);
    this.sesionActual.set(user);
    return { ok: true, usuario: user };
  }

  logout(): void {
    this.data.borrarSesion();
    this.sesionActual.set(null);
  }

  actualizarPerfil(
    usuario: string,
    cambios: Partial<Usuario>,
  ): { ok: boolean; usuario?: Usuario; error?: string } {
    const lista = this.data.usuarios();
    const i = lista.findIndex((u) => u.usuario.toLowerCase() === usuario.toLowerCase());
    if (i === -1) {
      return { ok: false, error: 'Usuario no encontrado.' };
    }
    lista[i] = { ...lista[i], ...cambios };
    this.data.guardarUsuarios(lista);
    if (this.sesionActual()?.usuario.toLowerCase() === usuario.toLowerCase()) {
      this.data.guardarSesion(lista[i]);
      this.sesionActual.set(lista[i]);
    }
    return { ok: true, usuario: lista[i] };
  }

  cambiarPassword(correo: string, nuevaPass: string): { ok: boolean; usuario?: Usuario; error?: string } {
    const user = this.buscarPorCorreo(correo);
    if (!user) {
      return { ok: false, error: 'No existe una cuenta con ese correo.' };
    }
    return this.actualizarPerfil(user.usuario, { password: nuevaPass });
  }
}
