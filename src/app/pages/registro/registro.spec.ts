import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Registro } from './registro';

describe('Registro (formulario reactivo)', () => {
  let componente: Registro;

  beforeEach(async () => {
    localStorage.clear();
    sessionStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Registro],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(Registro);
    componente = fixture.componentInstance;
  });

  // Datos de prueba que cumplen todas las reglas del formulario
  const datosValidos = {
    nombre: 'Pia T',
    usuario: 'piam',
    correo: 'pia@test.cl',
    password: 'Abc123$',
    password2: 'Abc123$',
    fechaNac: '2000-01-01',
    direccion: '',
  };

  it('el formulario parte inválido cuando está vacío', () => {
    expect(componente.form.valid).toBeFalse();
  });

  it('el formulario es válido con datos correctos', () => {
    componente.form.setValue(datosValidos);
    expect(componente.form.valid).toBeTrue();
  });

  it('rechaza un correo con formato inválido', () => {
    componente.form.patchValue({ ...datosValidos, correo: 'correo-malo' });
    expect(componente.form.controls.correo.errors?.['email']).toBeTruthy();
  });

  it('marca error cuando las contraseñas no coinciden', () => {
    componente.form.setValue({ ...datosValidos, password2: 'Otra123$' });
    expect(componente.form.errors?.['noCoinciden']).toBeTrue();
  });

  it('exige contraseña con mayuscula, minuscula, numero y caracter especial', () => {
    componente.form.patchValue({ ...datosValidos, password: 'abcdef', password2: 'abcdef' });
    expect(componente.form.controls.password.errors?.['complejidad']).toBeTruthy();
  });

  it('rechaza a una persona menor de 13 años', () => {
    componente.form.patchValue({ ...datosValidos, fechaNac: '2020-01-01' });
    expect(componente.form.controls.fechaNac.errors?.['edadMinima']).toBeTruthy();
  });

  it('la dirección de despacho es opcional', () => {
    componente.form.setValue({ ...datosValidos, direccion: '' });
    expect(componente.form.valid).toBeTrue();
  });
});
