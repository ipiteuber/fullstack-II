import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// La contraseña debe tener al menos un numero y una letra mayuscula.
export function complejidadPassword(control: AbstractControl): ValidationErrors | null {
  const v = control.value as string;
  if (!v) return null; // El validador required se encarga del campo vacio
  const tieneNumero = /[0-9]/.test(v);
  const tieneMayuscula = /[A-Z]/.test(v);
  if (tieneNumero && tieneMayuscula) return null;
  return { complejidad: { tieneNumero, tieneMayuscula } };
}

// Edad minima a partir de la fecha de nacimiento (formato YYYY-MM-DD).
export function edadMinima(minimo: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = control.value as string;
    if (!v) return null;
    const nacimiento = new Date(v);
    if (isNaN(nacimiento.getTime())) return { fechaInvalida: true };
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad >= minimo ? null : { edadMinima: { requerida: minimo, actual: edad } };
  };
}

// Compara los dos campos de contraseña para que sean iguales.
export function passwordsIguales(campo = 'password', repetir = 'password2'): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const pass = group.get(campo)?.value;
    const pass2 = group.get(repetir)?.value;
    if (!pass2) return null;
    return pass === pass2 ? null : { noCoinciden: true };
  };
}
