import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Perfil } from '../perfil.data';

/**
 * Vista de detalle — muestra el perfil resuelto por perfilResolver.
 *
 * El componente NO gestiona ningún estado de carga: cuando Angular lo crea,
 * el router ya ha ejecutado el resolver y guardado el dato en snapshot.data.
 * Solo hay que leerlo: no hay loading, no hay null-check, no hay subscribe.
 */
@Component({
  selector: 'app-detalle-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="detalle">
      <a class="detalle__back" [routerLink]="['../lista']">← Volver a la lista</a>

      <div class="detalle__header">
        <span class="detalle__avatar" [attr.data-color]="perfil.colorIdx">
          {{ perfil.iniciales }}
        </span>
        <div class="detalle__meta">
          <h3 class="detalle__nombre">{{ perfil.nombre }}</h3>
          <span class="detalle__rol">{{ perfil.rol }}</span>
          <a class="detalle__email" [href]="'mailto:' + perfil.email">
            {{ perfil.email }}
          </a>
        </div>
      </div>

      <p class="detalle__bio">{{ perfil.bio }}</p>

      <ul class="detalle__skills">
        @for (skill of perfil.skills; track skill) {
          <li class="skill-tag">{{ skill }}</li>
        }
      </ul>

      <p class="detalle__hint">
        Estos datos los resolvió <code>perfilResolver</code> antes de que
        este componente se creara. <code>route.snapshot.data['perfil']</code>
        ya tenía valor en el constructor.
      </p>
    </div>
  `,
  styleUrl: './views.scss',
})
export class DetalleView {
  private readonly route = inject(ActivatedRoute);

  // El router ejecutó perfilResolver y guardó el resultado en snapshot.data
  // antes de activar esta ruta. No hace falta ningún estado de carga.
  protected readonly perfil = this.route.snapshot.data['perfil'] as Perfil;
}
