import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NovedadesService } from '../../services/novedades';
import { Novedad } from '../../models/models';

/** Detalle de una novedad. Lee el :id de la ruta y busca la noticia en el JSON. */
@Component({
  selector: 'app-novedad-detalle',
  imports: [CommonModule, RouterLink],
  templateUrl: './novedad-detalle.html',
})
export class NovedadDetalle implements OnInit {
  private route = inject(ActivatedRoute);
  private servicio = inject(NovedadesService);

  novedad?: Novedad;
  cargando = true;

  ngOnInit(): void {
    this.route.paramMap.subscribe((pm) => {
      const id = pm.get('id') ?? '';
      this.cargando = true;
      this.servicio.getNovedades().subscribe({
        next: (lista) => {
          this.novedad = lista.find((n) => n.id === id);
          this.cargando = false;
        },
        error: () => (this.cargando = false),
      });
    });
  }
}
