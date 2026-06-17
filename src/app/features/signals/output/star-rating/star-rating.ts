import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

/**
 * Componente HIJO del ejercicio 2.3.
 *
 * Emite eventos hacia su padre con `output()`. Un output devuelve un emisor con
 * el método `.emit(valor)`: el hijo NO modifica el estado del padre, solo le
 * "avisa" de que ha pasado algo; el padre decide qué hacer.
 *
 * Recibe la valoración actual por `input()` (solo para pintar las estrellas
 * llenas) y emite la estrella pulsada por `output()`. Así el estado vive en el
 * padre ("one-way data flow"): baja por input, sube por output.
 *
 * La base ya emite `valorar`. Completa los TODO para añadir el output `limpiar`.
 */
@Component({
  selector: 'app-star-rating',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.scss',
})
export class StarRating {
  /** Valoración actual (la decide el padre). Solo lectura. */
  readonly valor = input(0);

  /** Estrellas fijas a pintar (1..5). */
  protected readonly estrellas = [1, 2, 3, 4, 5];

  /**
   * Ejemplo resuelto: output que emite la estrella seleccionada.
   * El padre lo escucha con `(valorar)="..."` y recibe el número en `$event`.
   */
  readonly valorar = output<number>();

  /**
   * TODO 1: declara un output `limpiar` sin payload para avisar al padre de que
   * quiere borrar la valoración:
   *   readonly limpiar = output<void>();
   * Luego emítelo desde el botón "Quitar" (ver TODO 2 en star-rating.html) y
   * escúchalo en el padre (TODO 3 en output-exercise.html).
   */
}
