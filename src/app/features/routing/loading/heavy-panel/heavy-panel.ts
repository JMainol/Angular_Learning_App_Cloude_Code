import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Componente "pesado" del ejercicio 4.2.
 *
 * Representa un trozo de UI que no queremos cargar de entrada. Al usarse solo
 * dentro de un bloque `@defer`, Angular lo separa en su PROPIO chunk y lo
 * descarga bajo demanda (cuando se cumple el trigger). Compruébalo en la pestaña
 * Network del navegador: su .js no se pide hasta que activas el defer.
 */
@Component({
  selector: 'app-heavy-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="heavy">
      <span class="heavy__badge">cargado bajo demanda</span>
      <h4 class="heavy__title">Panel pesado</h4>
      <p class="heavy__text">
        Este componente vive en su propio chunk. No se descargó al abrir la sección,
        sino al cumplirse el trigger del <code>&#64;defer</code>.
      </p>
    </div>
  `,
  styles: [
    `
      .heavy {
        padding: 1.5rem;
        background: var(--surface-raised);
        border: 1px solid var(--border);
        border-left: 2px solid #34d399;
        border-radius: var(--radius);
      }
      .heavy__badge {
        display: inline-block;
        font-family: var(--font-mono);
        font-size: 0.65rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #34d399;
        margin-bottom: 0.6rem;
      }
      .heavy__title {
        font-size: 1.1rem;
        margin-bottom: 0.4rem;
      }
      .heavy__text {
        margin: 0;
        font-size: 0.88rem;
        color: var(--text);
      }
      .heavy__text code {
        font-family: var(--font-mono);
        color: var(--accent);
      }
    `,
  ],
})
export class HeavyPanel {}
