import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Ejercicio 4.3 — host del mini-sitio con rutas parametrizadas.
 *
 * Solo aporta el `<router-outlet>` anidado donde se renderizan la lista y el
 * detalle. La navegación entre ellos (y el paso del id por la URL) ocurre dentro
 * de las propias vistas hijas.
 */
@Component({
  selector: 'app-params-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  template: `
    <div class="mini">
      <span class="mini__label">mini-sitio · catálogo</span>
      <div class="mini__outlet">
        <router-outlet />
      </div>
    </div>
  `,
  styles: [
    `
      .mini {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .mini__label {
        font-family: var(--font-mono);
        font-size: 0.68rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--text-dim);
      }
      .mini__outlet {
        min-height: 140px;
      }
    `,
  ],
})
export class ParamsExercise {}
