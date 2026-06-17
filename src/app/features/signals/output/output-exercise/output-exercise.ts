import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { StarRating } from '../star-rating/star-rating';

/**
 * Host (PADRE) del ejercicio 2.3.
 *
 * El estado (la valoración) vive AQUÍ, en un `signal`. El hijo `StarRating` solo
 * emite eventos; el padre los escucha con la sintaxis `(evento)="manejador($event)"`
 * y decide cómo actualizar su estado. Es el flujo unidireccional de datos:
 * el dato baja por input, el aviso sube por output.
 *
 * Completa el TODO para escuchar también el evento `limpiar` del hijo.
 */
@Component({
  selector: 'app-output-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StarRating],
  templateUrl: './output-exercise.html',
  styleUrl: './output-exercise.scss',
})
export class OutputExercise {
  /** Valoración actual (estado del padre). */
  protected readonly valoracion = signal(0);

  /** Maneja el output `valorar`: guarda la estrella recibida. */
  protected setValoracion(estrellas: number): void {
    this.valoracion.set(estrellas);
  }

  /** Maneja el output `limpiar` (lo usarás al resolver los TODO del hijo). */
  protected reset(): void {
    this.valoracion.set(0);
  }
}
