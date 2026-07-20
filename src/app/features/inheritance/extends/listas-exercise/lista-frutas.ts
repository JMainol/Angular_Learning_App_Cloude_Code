import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ListaFiltrableBase } from './lista-filtrable-base';

/**
 * Hijo 1 — hereda TODA la lógica de `ListaFiltrableBase` y además
 * sobrescribe `limpiar()` para añadir comportamiento propio (TODO 3).
 *
 * Fíjate en lo que este componente NO tiene: ni `termino`, ni `filtrados`,
 * ni `placeholder`, ni `alEscribir()`. Todo eso llega por herencia.
 * Lo que SÍ tiene: su template y su selector, porque la metadata del
 * decorador nunca se hereda.
 */
@Component({
  selector: 'app-lista-frutas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  // Template PROPIO: la vista no se hereda de la base (la base ni tiene).
  template: `
    <div class="lista lista--frutas">
      <header class="lista__head">
        <span class="lista__icon" aria-hidden="true">🍎</span>
        <span class="lista__title">{{ 'sections.extends.exercise.fruitsTitle' | translate }}</span>
      </header>

      <!-- termino, alEscribir y placeholder vienen HEREDADOS de la base. -->
      <input
        class="lista__field"
        type="text"
        [value]="termino()"
        (input)="alEscribir($event)"
        [placeholder]="placeholder()"
      />

      @if (filtrados().length > 0) {
        <ul class="lista__items">
          @for (fruta of filtrados(); track fruta) {
            <li class="lista__item">{{ fruta }}</li>
          }
        </ul>
      } @else {
        <p class="lista__empty">{{ 'sections.extends.exercise.empty' | translate }}</p>
      }

      <footer class="lista__foot">
        <button class="lista__btn" type="button" (click)="limpiar()" [disabled]="!termino()">
          {{ 'sections.extends.exercise.clearBtn' | translate }}
        </button>
        <span class="lista__count">
          {{ filtrados().length }} / {{ elementos().length }} ·
          {{ limpiezas() }} {{ 'sections.extends.exercise.cleanCount' | translate }}
        </span>
      </footer>
    </div>
  `,
  // Ambos hijos apuntan al MISMO fichero de estilos: es reutilización por
  // referencia, no herencia — los estilos del decorador tampoco se heredan.
  styleUrl: './lista.scss',
})
export class ListaFrutas extends ListaFiltrableBase {
  // Cumple el contrato `abstract` de la base: este hijo aporta sus datos.
  protected readonly elementos = signal([
    'Manzana',
    'Pera',
    'Kiwi',
    'Plátano',
    'Mango',
    'Cereza',
  ]);

  /** Estado EXTRA que solo tiene este hijo. */
  protected readonly limpiezas = signal(0);

  /**
   * TODO 3 — Sobrescribe `limpiar()`:
   *   · `override` es OBLIGATORIO: el tsconfig activa "noImplicitOverride",
   *     así, si la base renombra el método, TypeScript avisa en lugar de
   *     dejar aquí un método huérfano que ya no sobrescribe nada.
   *   · `super.limpiar()` reutiliza la lógica de la base…
   *   · …y después el hijo añade la suya (contar las limpiezas).
   */
  override limpiar(): void {
    super.limpiar();
    this.limpiezas.update((n) => n + 1);
  }
}
