import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

/**
 * EJERCICIO 15.2 — Limitar un número (`Math.min` / `Math.max`)
 * ----------------------------------------------------------------------------
 * Objetivo: usar `Math.min` y `Math.max` con DOS argumentos como tope y suelo:
 *   - `Math.min(x, MAX)` → techo: devuelve x, pero nunca más de MAX.
 *   - `Math.max(x, MIN)` → suelo: devuelve x, pero nunca menos de MIN.
 *
 * Leídos así, los nombres despistan: `min` pone el LÍMITE SUPERIOR y `max` el
 * INFERIOR. La clave es pensar "quédate con el menor/mayor de los dos".
 * Combinados forman un "clamp": encajar un valor dentro de un rango.
 *
 * La base ya implementa `acercar()` con techo. Completa los TODO de `alejar()`
 * y de la función `clamp()` que usa el input libre.
 */
@Component({
  selector: 'app-clamp-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './clamp-exercise.html',
  styleUrl: './clamp-exercise.scss',
})
export class ClampExercise {
  /** Rango permitido del zoom (constantes del ejercicio). */
  protected readonly ZOOM_MIN = 50;
  protected readonly ZOOM_MAX = 200;
  protected readonly PASO = 25;

  /** Nivel de zoom actual, en % (signal: estado reactivo). */
  protected readonly zoom = signal(100);

  /**
   * Ejemplo resuelto: acercar con techo.
   * `Math.min(x, MAX)` devuelve el menor de los dos: mientras x no llegue al
   * máximo gana x; en cuanto lo supera, gana el máximo. Por eso actúa de tope.
   */
  protected acercar(): void {
    this.zoom.update((z) => Math.min(z + this.PASO, this.ZOOM_MAX));
  }

  /**
   * TODO 1: alejar con suelo.
   * Resta PASO sin bajar de ZOOM_MIN. Es el espejo del ejemplo: aquí el
   * "mayor de los dos" es quien frena la caída (pista: Math.max).
   */
  protected alejar(): void {
    // TODO: implementar con this.zoom.update(...)
  }

  /**
   * TODO 2: clamp = techo + suelo a la vez.
   * Encadena ambos para encajar CUALQUIER valor en [min, max]:
   *   Math.min(Math.max(valor, min), max)
   * (El orden inverso también vale; lo importante es aplicar los dos.)
   */
  protected clamp(valor: number, min: number, max: number): number {
    // TODO: sustituir por la combinación de Math.min y Math.max
    return valor;
  }

  /** Aplica un valor escrito a mano pasándolo por clamp() (TODO 2). */
  protected aplicar(input: HTMLInputElement): void {
    const valor = Number(input.value);
    if (!Number.isFinite(valor)) return;
    this.zoom.set(this.clamp(valor, this.ZOOM_MIN, this.ZOOM_MAX));
    input.value = '';
  }
}
