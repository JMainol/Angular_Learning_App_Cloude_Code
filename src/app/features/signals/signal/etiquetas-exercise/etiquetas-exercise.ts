import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

/**
 * EJERCICIO 2.1 (3) — `Signal` de una COLECCIÓN (array, inmutable)
 * ----------------------------------------------------------------------------
 * Objetivo: mantener una lista de etiquetas en UN `signal<string[]>` y añadir
 * o quitar elementos SIN mutar el array anterior.
 *
 * Igual que con los objetos, un Signal compara por referencia: `push()` o
 * `splice()` mutan el MISMO array y el Signal no lo detectaría. Por eso se
 * crea siempre un array NUEVO:
 *   - añadir  → `[...actual, nuevo]`
 *   - quitar  → `actual.filter(x => x !== objetivo)`
 *   - vaciar  → `[]`
 *
 * Fíjate además en que la plantilla DERIVA datos leyendo el mismo signal
 * (`etiquetas().length`, lista vacía) sin guardar estado extra.
 *
 * La base resuelve `anadir()` como ejemplo. Completa los TODO.
 */
@Component({
  selector: 'app-etiquetas-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './etiquetas-exercise.html',
  styleUrl: './etiquetas-exercise.scss',
})
export class EtiquetasExercise {
  /** La colección completa vive en un único signal de array. */
  protected readonly etiquetas = signal<string[]>(['angular', 'signals']);

  /**
   * Ejemplo resuelto: añadir una etiqueta.
   * Normalizamos el texto y evitamos duplicados/vacíos. `.update()` devuelve un
   * array NUEVO con spread; el anterior queda intacto (inmutabilidad).
   */
  protected anadir(texto: string): void {
    const etiqueta = texto.trim().toLowerCase();
    if (!etiqueta) return;
    this.etiquetas.update((actual) =>
      actual.includes(etiqueta) ? actual : [...actual, etiqueta],
    );
  }

  /**
   * TODO 1: quitar una etiqueta concreta.
   * Devuelve un array nuevo SIN esa etiqueta.
   * Pista: `actual.filter((e) => e !== etiqueta)`.
   */
  protected quitar(etiqueta: string): void {
    // TODO: implementar con this.etiquetas.update(...)
  }

  /**
   * TODO 2: vaciar la lista entera.
   * El nuevo valor no depende del actual → usa `.set([])`.
   */
  protected limpiar(): void {
    // TODO: implementar con this.etiquetas.set(...)
  }
}
