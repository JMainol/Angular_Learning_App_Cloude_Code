import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ListaFiltrableBase } from './lista-filtrable-base';

/**
 * Hijo 2 — la versión mínima de la herencia: `extends` + los datos.
 *
 * Comparado con `ListaFrutas`, este hijo demuestra que con heredar basta:
 * no sobrescribe nada y aun así filtra, limpia y acepta [placeholder]
 * desde el padre, porque todo eso vive en la clase base.
 * Su template usa otro layout (chips en fila): la vista es SUYA.
 */
@Component({
  // TODO 1 — Declara la herencia en la clase: `extends ListaFiltrableBase`.
  selector: 'app-lista-tecnologias',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  template: `
    <div class="lista lista--tech">
      <header class="lista__head">
        <span class="lista__icon" aria-hidden="true">⚙️</span>
        <span class="lista__title">{{ 'sections.extends.exercise.techTitle' | translate }}</span>
      </header>

      <input
        class="lista__field"
        type="text"
        [value]="termino()"
        (input)="alEscribir($event)"
        [placeholder]="placeholder()"
      />

      @if (filtrados().length > 0) {
        <!-- Mismo dato heredado (filtrados), presentación distinta: chips. -->
        <ul class="lista__items lista__items--chips">
          @for (tec of filtrados(); track tec) {
            <li class="lista__item lista__item--chip">{{ tec }}</li>
          }
        </ul>
      } @else {
        <p class="lista__empty">{{ 'sections.extends.exercise.empty' | translate }}</p>
      }

      <footer class="lista__foot">
        <button class="lista__btn" type="button" (click)="limpiar()" [disabled]="!termino()">
          {{ 'sections.extends.exercise.clearBtn' | translate }}
        </button>
        <span class="lista__count">{{ filtrados().length }} / {{ elementos().length }}</span>
      </footer>
    </div>
  `,
  styleUrl: './lista.scss',
})
export class ListaTecnologias extends ListaFiltrableBase {
  // Único requisito del contrato abstract: aportar los datos.
  protected readonly elementos = signal([
    'Angular',
    'Signals',
    'RxJS',
    'TypeScript',
    'Vite',
    'Zoneless',
  ]);
}
