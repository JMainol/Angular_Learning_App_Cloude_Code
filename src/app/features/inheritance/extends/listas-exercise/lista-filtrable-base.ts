import { Directive, Signal, computed, input, signal } from '@angular/core';

/**
 * Ejercicio 18.1 — Clase BASE de listados filtrables.
 *
 * Toda la lógica común (término de búsqueda, filtrado derivado, limpiar)
 * vive aquí UNA sola vez. Los componentes hijos (`ListaFrutas`,
 * `ListaTecnologias`) la heredan con `extends` y solo aportan lo que les
 * hace únicos: sus datos, su template y sus estilos.
 *
 * ¿Por qué `@Directive()` SIN selector? La clase no se usa en ningún
 * template, pero declara un `input()`: Angular solo procesa inputs/outputs
 * de clases marcadas con un decorador. Un `@Directive()` vacío es la forma
 * oficial de decir "esta clase es una base heredable con metadata Angular".
 */
@Directive()
export abstract class ListaFiltrableBase {
  /**
   * input() declarado en la BASE: todos los hijos lo heredan y cualquier
   * padre puede enlazarlo ([placeholder]="…") sin que el hijo lo redeclare.
   */
  readonly placeholder = input('Filtrar…');

  /** Término de búsqueda. `protected` para que el template del hijo lo lea. */
  protected readonly termino = signal('');

  /**
   * Contrato: `abstract` OBLIGA a cada hijo a aportar sus datos.
   * Si un hijo olvida definir `elementos`, TypeScript no compila.
   */
  protected abstract readonly elementos: Signal<string[]>;

  /**
   * TODO 2 — Completa el computed heredado: debe devolver los `elementos`
   * cuyo texto contenga `termino` (ignorando mayúsculas/minúsculas).
   * Este derivado se hereda tal cual: ningún hijo lo reescribe.
   */
  protected readonly filtrados = computed(() =>
    this.elementos().filter((elemento) =>
      elemento.toLowerCase().includes(this.termino().toLowerCase())
    )
  );

  /** Método heredado. Un hijo puede sobrescribirlo con `override` (TODO 3). */
  limpiar(): void {
    this.termino.set('');
  }

  /** Handler compartido: los inputs de TODOS los hijos escriben aquí. */
  protected alEscribir(evento: Event): void {
    this.termino.set((evento.target as HTMLInputElement).value);
  }
}
