import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

/**
 * EJERCICIO 2.1 — `Signal`
 * ----------------------------------------------------------------------------
 * Objetivo: gestionar el aforo de una sala con un único `signal`, practicando
 * las dos formas de escribir en él:
 *   - `.set(valor)`    → reemplaza el valor por completo.
 *   - `.update(fn)`    → calcula el nuevo valor a partir del actual.
 *
 * Un Signal es un contenedor reactivo: se LEE como una función (`aforo()`) y,
 * cuando su valor cambia, Angular vuelve a evaluar solo las partes de la
 * plantilla que lo leen. No hace falta `ngOnChanges` ni detección manual.
 *
 * La base ya implementa `entrar()` como ejemplo. Completa los TODO de `salir()`
 * y `reiniciar()`.
 */
@Component({
  selector: 'app-signal-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './signal-exercise.html',
  styleUrl: './signal-exercise.scss',
})
export class SignalExercise {
  /** Aforo máximo de la sala (constante del ejercicio). */
  protected readonly AFORO_MAX = 10;

  /** Personas dentro de la sala (signal: estado reactivo). */
  protected readonly aforo = signal(0);

  /**
   * Ejemplo resuelto: una persona entra.
   * Usamos `.update()` porque el nuevo valor depende del actual. La función
   * recibe el valor previo (`n`) y devuelve el nuevo, sin pasar de AFORO_MAX.
   */
  protected entrar(): void {
    this.aforo.update((n) => Math.min(n + 1, this.AFORO_MAX));
  }

  /**
   * TODO 1: una persona sale.
   * Usa `.update()` para restar 1, pero sin bajar de 0 (pista: Math.max).
   */
  protected salir(): void {
    // TODO: implementar con this.aforo.update(...)
  }

  /**
   * TODO 2: vaciar la sala de golpe.
   * Aquí el nuevo valor NO depende del actual, así que usa `.set(0)`.
   */
  protected reiniciar(): void {
    // TODO: implementar con this.aforo.set(...)
  }
}
