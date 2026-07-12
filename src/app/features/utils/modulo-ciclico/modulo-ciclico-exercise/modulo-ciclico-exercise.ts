import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';

/**
 * EJERCICIO 15.1 — Iteración cíclica con módulo (`%`)
 * ----------------------------------------------------------------------------
 * Objetivo: interiorizar el patrón `indice % lista.length` para recorrer un
 * array en bucle: el índice crece sin parar, pero el módulo lo "pliega" siempre
 * dentro del rango [0, length - 1], así nunca te sales del array.
 *
 * Es el mismo patrón que usa `anadir()` en el ejercicio 2.2 (@for) para sacar
 * plantillas del catálogo en rotación infinita.
 *
 * La base compila y `siguiente()` ya funciona, pero `personaActual` está
 * "roto" a propósito: pulsa "Siguiente" hasta pasar del final de la lista y
 * verás el fallo en pantalla. Arréglalo con los TODO.
 */
@Component({
  selector: 'app-modulo-ciclico-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modulo-ciclico-exercise.html',
  styleUrl: './modulo-ciclico-exercise.scss',
})
export class ModuloCiclicoExercise {
  /** Rotación de guardias del equipo. La lista es fija; el índice, no. */
  protected readonly equipo = ['Ana', 'Bruno', 'Carla', 'David', 'Elena'];

  /**
   * Índice "bruto": solo crece (0, 1, 2, 3… 12, 13…). No lo reseteamos nunca;
   * el trabajo de mantenerlo dentro del array es del módulo, no del índice.
   */
  protected readonly indice = signal(0);

  /** Ejemplo resuelto: avanzar es solo sumar 1. El índice puede crecer libre. */
  protected siguiente(): void {
    this.indice.update((i) => i + 1);
  }

  /**
   * TODO 1: la persona de guardia.
   * Ahora mismo, cuando `indice` pasa del final, devuelve el texto de fuera de
   * rango. Aplica el módulo para que dé la vuelta y vuelva a empezar:
   *   this.equipo[this.indice() % this.equipo.length]
   */
  protected readonly personaActual = computed(
    () => this.equipo[this.indice()] ?? '¡fuera de rango!'
  );

  /**
   * TODO 2: retroceder SIN dejar el índice en negativo.
   * Restar 1 a secas rompe el patrón cuando indice es 0 (en JS, -1 % 5 = -1).
   * El truco clásico: sumar la longitud antes del módulo:
   *   (i - 1 + this.equipo.length) % this.equipo.length
   */
  protected anterior(): void {
    // TODO: implementar con this.indice.update(...)
  }

  /**
   * TODO 3 (derivado): ¿cuántas vueltas completas lleva la rotación?
   * Si el módulo da el "resto", la división entera da las "vueltas":
   *   Math.floor(this.indice() / this.equipo.length)
   */
  protected readonly vueltas = computed(() => 0);
}
