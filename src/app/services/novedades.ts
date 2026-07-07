import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Novedad, Evento } from '../models/models';

/**
 * Servicio que consume los archivos JSON de la aplicacion (novedades y eventos)
 * usando HttpClient. Los archivos viven en public/data y se sirven desde la raiz.
 */
@Injectable({ providedIn: 'root' })
export class NovedadesService {
  private http = inject(HttpClient);

  /** Lista de novedades leidas desde data/novedades.json. */
  getNovedades(): Observable<Novedad[]> {
    return this.http.get<Novedad[]>('data/novedades.json');
  }

  /** Lista de eventos leidos desde data/eventos.json. */
  getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>('data/eventos.json');
  }
}
