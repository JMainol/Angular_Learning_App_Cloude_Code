import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PERFILES } from '../perfil.data';

/**
 * Vista de listado — directorio de desarrolladores.
 * Cada card navega a `detalle/:id`, donde perfilResolver se ejecuta
 * antes de renderizar el componente destino.
 */
@Component({
  selector: 'app-lista-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <ul class="lista">
      @for (p of perfiles; track p.id) {
        <li>
          <a class="card" [routerLink]="['../detalle', p.id]">
            <span class="card__avatar" [attr.data-color]="p.colorIdx">
              {{ p.iniciales }}
            </span>
            <div class="card__body">
              <strong class="card__nombre">{{ p.nombre }}</strong>
              <span class="card__rol">{{ p.rol }}</span>
            </div>
            <span class="card__arrow">→</span>
          </a>
        </li>
      }
    </ul>
  `,
  styleUrl: './views.scss',
})
export class ListaView {
  protected readonly perfiles = PERFILES;
}
