import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Enlace a la documentación oficial de Angular.
 *
 * Componente pequeño y reutilizable para mantener un estilo consistente en todas
 * las secciones. Usa `input()` (Signals) y `OnPush` por coherencia con el resto.
 * El texto del enlace se traduce (clave `common.docLink`) como el resto del chrome.
 */
@Component({
  selector: 'app-doc-link',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  template: `
    <a class="doc" [href]="href()" target="_blank" rel="noopener">
      <span>{{ 'common.docLink' | translate }}</span>
      <svg width="13" height="13" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true">
        <path
          d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"
        />
      </svg>
    </a>
  `,
  styles: [
    `
      .doc {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.82rem;
        font-weight: 500;
        color: var(--accent);
        border-bottom: 1px solid transparent;
        transition: border-color 0.15s ease, opacity 0.15s ease;
      }
      .doc:hover {
        border-color: var(--accent);
      }
      svg {
        opacity: 0.8;
      }
    `,
  ],
})
export class DocLink {
  /** URL de la página de documentación. */
  readonly href = input.required<string>();
}
