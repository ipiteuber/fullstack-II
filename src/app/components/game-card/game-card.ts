import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Producto } from '../../models/models';
import { ClpPipe } from '../../pipes/clp-pipe';

/**
 * Ficha de un juego dentro del catalogo. Recibe el producto desde el
 * componente padre (Categoria) por @Input y avisa al padre por @Output
 * cuando el usuario quiere agregarlo al carrito.
 */
@Component({
  selector: 'app-game-card',
  imports: [CommonModule, RouterLink, ClpPipe],
  templateUrl: './game-card.html',
})
export class GameCard {
  /** Producto que se muestra en la ficha. */
  @Input({ required: true }) producto!: Producto;

  /** Mensaje de feedback de esta ficha; lo controla el componente padre. */
  @Input() feedback: { texto: string; tipo: 'ok' | 'err' } | null = null;

  /** Se emite cuando el usuario presiona "Agregar al carrito". */
  @Output() agregar = new EventEmitter<Producto>();
}
