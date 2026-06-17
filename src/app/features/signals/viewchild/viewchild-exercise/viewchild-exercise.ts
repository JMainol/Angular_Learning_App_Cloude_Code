import { Component, ChangeDetectionStrategy, signal, viewChild, ElementRef } from '@angular/core';

/**
 * EJERCICIO 2.6 — `ViewChild`
 * ----------------------------------------------------------------------------
 * Objetivo: acceder a un elemento del template (un <input>) desde la clase para
 * enfocarlo, leer su valor o limpiarlo.
 *
 * `viewChild()` es la query basada en Signals: busca en la vista un elemento o
 * componente (por variable de plantilla `#campo` o por tipo) y devuelve un Signal
 * con la referencia. Se lee como función: `campo()`. Mientras la vista no se ha
 * renderizado, el Signal vale `undefined` (por eso usamos `?.` o `viewChild.required`).
 *
 * Usarlo para tocar el DOM directamente es el último recurso: primero intenta
 * resolverlo con bindings/signals. Aquí es legítimo porque `.focus()` es una
 * acción imperativa del DOM que no tiene equivalente declarativo.
 *
 * La base ya implementa `enfocar()`. Completa los TODO de `limpiar()` y `leer()`.
 */
@Component({
  selector: 'app-viewchild-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './viewchild-exercise.html',
  styleUrl: './viewchild-exercise.scss',
})
export class ViewChildExercise {
  /**
   * Referencia al <input #campo> de la plantilla.
   * `ElementRef<HTMLInputElement>` tipa `nativeElement` como el input nativo.
   */
  protected readonly campo = viewChild<ElementRef<HTMLInputElement>>('campo');

  /** Último valor leído del input (para mostrarlo). */
  protected readonly eco = signal('');

  /** Ejemplo resuelto: poner el foco en el input usando la referencia. */
  protected enfocar(): void {
    this.campo()?.nativeElement.focus();
  }

  /**
   * TODO 1: limpia el input y vuelve a enfocarlo.
   *   const input = this.campo()?.nativeElement;
   *   if (input) { input.value = ''; input.focus(); }
   *   this.eco.set('');
   */
  protected limpiar(): void {
    // TODO
  }

  /**
   * TODO 2: lee el valor actual del input y guárdalo en el signal `eco`.
   *   this.eco.set(this.campo()?.nativeElement.value ?? '');
   */
  protected leer(): void {
    // TODO
  }
}
