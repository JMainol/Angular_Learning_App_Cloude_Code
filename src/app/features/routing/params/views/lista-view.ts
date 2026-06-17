import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PRODUCTOS } from '../productos';

/**
 * Vista LISTA del ejercicio 4.3.
 *
 * Cada producto enlaza a la ruta de detalle pasando su id en la URL:
 * `routerLink="../producto/1"`. Ese segmento dinámico es lo que la ruta
 * `producto/:id` captura como parámetro.
 */
@Component({
  selector: 'app-lista-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <ul class="lista">
      @for (p of productos; track p.id) {
        <li>
          <a class="lista__item" [routerLink]="['../producto', p.id]">
            <span>{{ p.nombre }}</span>
            <span class="lista__id">id: {{ p.id }}</span>
          </a>
        </li>
      }
    </ul>
  `,
  styleUrl: './views.scss',
})
export class ListaView {
  protected readonly productos = PRODUCTOS;
}
