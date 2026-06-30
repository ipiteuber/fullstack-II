import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe que formatea un numero como precio chileno.
 * Ejemplo: 34990 se muestra como "$34.990".
 */
@Pipe({ name: 'clp' })
export class ClpPipe implements PipeTransform {
  transform(valor: number | null | undefined): string {
    const n = Number(valor ?? 0);
    return '$' + n.toLocaleString('es-CL');
  }
}
