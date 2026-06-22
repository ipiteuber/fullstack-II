import { Pipe, PipeTransform } from '@angular/core';

// Formatea un numero como precio chileno: 34990 -> "$34.990"
@Pipe({ name: 'clp' })
export class ClpPipe implements PipeTransform {
  transform(valor: number | null | undefined): string {
    const n = Number(valor ?? 0);
    return '$' + n.toLocaleString('es-CL');
  }
}
