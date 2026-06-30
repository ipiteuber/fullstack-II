import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth';

describe('AuthService (autenticacion y perfil)', () => {
  let auth: AuthService;

  beforeEach(() => {
    // Cada prueba parte limpia, con solo la cuenta admin precargada por el seed
    localStorage.clear();
    sessionStorage.clear();
    TestBed.configureTestingModule({});
    auth = TestBed.inject(AuthService);
  });

  it('permite el login correcto del administrador', () => {
    const r = auth.login('admin', 'Admin#2026');
    expect(r.ok).toBeTrue();
    expect(auth.estaLogueado()).toBeTrue();
    expect(auth.esAdmin()).toBeTrue();
  });

  it('rechaza el login con contraseña incorrecta', () => {
    const r = auth.login('admin', 'claveMala');
    expect(r.ok).toBeFalse();
    expect(auth.estaLogueado()).toBeFalse();
  });

  it('recupera la contraseña y permite iniciar sesion con la nueva', () => {
    auth.registrar({
      nombre: 'Pia T',
      usuario: 'piat',
      correo: 'piat@test.cl',
      password: 'Vieja12$',
      fechaNac: '2000-01-01',
      direccion: '',
    });
    const cambio = auth.cambiarPassword('piat@test.cl', 'Nueva34$');
    expect(cambio.ok).toBeTrue();
    expect(auth.login('piat', 'Nueva34$').ok).toBeTrue();
  });

  it('actualiza el perfil y refleja el cambio en la sesion', () => {
    auth.login('admin', 'Admin#2026');
    const r = auth.actualizarPerfil('admin', { nombre: 'Admin Editado' });
    expect(r.ok).toBeTrue();
    expect(auth.sesion()?.nombre).toBe('Admin Editado');
  });
});
