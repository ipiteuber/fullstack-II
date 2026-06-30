import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface TarjetaCategoria {
  slug: string;
  nombre: string;
  desc: string;
  img: string;
}

/** Pagina de inicio. Lista las cuatro categorias de juegos con *ngFor. */
@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
})
export class Home {
  categorias: TarjetaCategoria[] = [
    { slug: 'estrategia', nombre: 'Estrategia', desc: 'Construye, planifica y conquista.', img: 'img/categorias/estrategia.jpg' },
    { slug: 'cooperativos', nombre: 'Cooperativos', desc: 'Trabajen en equipo para ganar.', img: 'img/categorias/cooperativos.jpg' },
    { slug: 'cartas', nombre: 'Cartas', desc: 'Astucia y estrategia en cada mano.', img: 'img/categorias/cartas.jpg' },
    { slug: 'party', nombre: 'Party Games', desc: 'Diversión asegurada para grupos.', img: 'img/categorias/party.jpg' },
  ];
}
