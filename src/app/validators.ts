import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Valida la robustez de la contraseña. Exige al menos un numero, una letra
 * mayuscula, una letra minuscula y un caracter especial. Junto con los
 * validadores de longitud (minLength 6 y maxLength 18) completa las cuatro
 * validaciones de seguridad pedidas.
 */
export function complejidadPassword(control: AbstractControl): ValidationErrors | null {
  const v = control.value as string;
  if (!v) return null; // El validador required se encarga del campo vacio
  const tieneNumero = /[0-9]/.test(v);
  const tieneMayuscula = /[A-Z]/.test(v);
  const tieneMinuscula = /[a-z]/.test(v);
  const tieneEspecial = /[^A-Za-z0-9]/.test(v);
  if (tieneNumero && tieneMayuscula && tieneMinuscula && tieneEspecial) {
    return null;
  }
  return { complejidad: { tieneNumero, tieneMayuscula, tieneMinuscula, tieneEspecial } };
}

/**
 * Verifica que la persona tenga la edad minima indicada a partir de su fecha
 * de nacimiento (formato YYYY-MM-DD).
 * @param minimo Edad minima permitida en anios.
 */
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

/**
 * Validador a nivel de grupo: compara dos campos de contraseña y marca error
 * si no coinciden.
 * @param campo Nombre del control de la contraseña.
 * @param repetir Nombre del control que la repite.
 */
export function passwordsIguales(campo = 'password', repetir = 'password2'): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const pass = group.get(campo)?.value;
    const pass2 = group.get(repetir)?.value;
    if (!pass2) return null;
    return pass === pass2 ? null : { noCoinciden: true };
  };
}
