import { Component, ChangeDetectionStrategy, signal, effect } from '@angular/core';

/**
 * EJERCICIO 2.5 — `Effect`
 * ----------------------------------------------------------------------------
 * Objetivo: reaccionar a los cambios de un signal ejecutando un efecto
 * secundario (registrar en una "consola" y persistir el valor).
 *
 * Un `effect()` ejecuta una función cada vez que cambia alguno de los signals
 * que lee dentro. A diferencia de `computed()`, NO devuelve un valor: sirve para
 * EFECTOS SECUNDARIOS (logging, sincronizar con localStorage, el DOM, analítica…).
 * Regla práctica: si quieres DERIVAR un valor usa `computed`; si quieres PROVOCAR
 * algo fuera del mundo reactivo usa `effect`.
 *
 * El effect se crea en el constructor porque necesita un "injection context".
 * La base ya hace `console.log`; completa los TODO para registrar en pantalla y
 * persistir en localStorage.
 */
@Component({
  selector: 'app-effect-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './effect-exercise.html',
  styleUrl: './effect-exercise.scss',
})
export class EffectExercise {
  /** Signal de origen: el efecto reaccionará a sus cambios. */
  protected readonly contador = signal(0);

  /** Registro visible (la "consola" del ejercicio). */
  protected readonly registro = signal<string[]>([]);

  constructor() {
    // El effect se ejecuta una vez al crearse y luego en cada cambio de `contador`.
    effect(() => {
      const valor = this.contador(); // leer aquí registra `contador` como dependencia

      // Ejemplo resuelto: efecto secundario hacia la consola del navegador.
      console.log('[effect] contador =', valor);

      // TODO 1: añade una línea al registro visible. Pista:
      //   this.registro.update((lineas) => [`contador → ${valor}`, ...lineas]);

      // TODO 2: persiste el valor en localStorage. Pista:
      //   localStorage.setItem('contador', String(valor));
    });
  }

  protected incrementar(): void {
    this.contador.update((n) => n + 1);
  }

  protected reiniciar(): void {
    this.contador.set(0);
  }
}
