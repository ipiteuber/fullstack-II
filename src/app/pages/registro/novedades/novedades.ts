import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NovedadesService } from '../../services/novedades';
import { Novedad, Evento } from '../../models/models';

/** Pagina de novedades. Consume data/novedades.json y data/eventos.json y los muestra. */
@Component({
  selector: 'app-novedades',
  imports: [CommonModule, RouterLink],
  templateUrl: './novedades.html',
})
export class Novedades implements OnInit {
  private servicio = inject(NovedadesService);

  novedades: Novedad[] = [];
  eventos: Evento[] = [];
  cargando = true;
  error = '';

  ngOnInit(): void {
    this.servicio.getNovedades().subscribe({
      next: (lista) => {
        this.novedades = lista;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar las novedades.';
        this.cargando = false;
      },
    });

    this.servicio.getEventos().subscribe({
      next: (lista) => (this.eventos = lista),
    });
  }
}
