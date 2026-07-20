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
    const input = this.campo()?.nativeElement;
    if (input) {
      input.value = '';
      input.focus();
    }
    this.eco.set('')
  }

  /**
   * TODO 2: lee el valor actual del input y guárdalo en el signal `eco`.
   *   this.eco.set(this.campo()?.nativeElement.value ?? '');
   */
  protected leer(): void {
    const input = this.campo()?.nativeElement;
    if (input) {
      const value = input.value;
      this.eco.set(value ?? '')
    }
  }

  // ==========================================================================
  // PARTE 2 — `viewChild()` opcional  vs  `viewChild.required()`
  // --------------------------------------------------------------------------
  // La diferencia solo se aprecia cuando el elemento consultado NO existe en el
  // DOM. Por eso envolvemos el <input #objetivo> en un @if(presente()): con el
  // toggle apagado el elemento desaparece y cada query reacciona distinto.
  //
  //   · viewChild<T>('objetivo')          -> Signal<T | undefined>
  //     Si no está, vale `undefined`. Con `?.` es seguro: TÚ decides qué hacer
  //     ante la ausencia. Nunca lanza error.
  //
  //   · viewChild.required<T>('objetivo') -> Signal<T>   (sin `undefined`)
  //     El tipo garantiza presencia, así que no necesitas `?.`. Pero si al LEER
  //     el Signal el elemento no existe, Angular lanza NG0951. La garantía la
  //     paga con una excepción en tiempo de ejecución.
  // ==========================================================================

  /** Controla si el <input #objetivo> está renderizado (@if en la plantilla). */
  protected readonly presente = signal(true);

  /** Misma variable de plantilla #objetivo, consultada de las dos formas. */
  protected readonly objetivoOpcional = viewChild<ElementRef<HTMLInputElement>>('objetivo');
  protected readonly objetivoRequerido = viewChild.required<ElementRef<HTMLInputElement>>('objetivo');

  /** Resultado del último intento de lectura (texto + si fue error, para el estilo). */
  protected readonly resultado = signal<{ texto: string; error: boolean } | null>(null);

  /** Muestra/oculta el elemento objetivo y limpia el resultado anterior. */
  protected alternarPresencia(): void {
    this.presente.update((v) => !v);
    this.resultado.set(null);
  }

  /**
   * Lectura con la query OPCIONAL.
   * `objetivoOpcional()` puede ser `undefined`, por eso usamos `?.`. Nunca lanza:
   * cuando el elemento no está, simplemente obtenemos `undefined` y lo reportamos.
   */
  protected leerOpcional(): void {
    const ref = this.objetivoOpcional();
    if (ref) {
      this.resultado.set({ texto: `Opcional -> devolvió la referencia (valor: "${ref.nativeElement.value}")`, error: false });
    } else {
      this.resultado.set({ texto: 'Opcional -> el Signal vale undefined. Sin error, la ausencia se gestiona en tu código.', error: false });
    }
  }

  /**
   * Lectura con la query REQUIRED.
   * `objetivoRequerido()` está tipado como `Signal<ElementRef>` (sin `undefined`),
   * así que accedemos directo, SIN `?.`. Si el elemento no existe, la propia
   * lectura del Signal lanza NG0951; lo capturamos para mostrarlo en la UI.
   *
   * TODO 3: completa el cuerpo del try/catch.
   *   try {
   *     const ref = this.objetivoRequerido();        // sin ?.  (el tipo lo garantiza)
   *     this.resultado.set({ texto: `Required -> referencia garantizada (valor: "${ref.nativeElement.value}")`, error: false });
   *   } catch (e) {
   *     this.resultado.set({ texto: `Required -> lanzó error: ${(e as Error).message}`, error: true });
   *   }
   */
  protected leerRequerido(): void {
    // TODO 3
  }
}
