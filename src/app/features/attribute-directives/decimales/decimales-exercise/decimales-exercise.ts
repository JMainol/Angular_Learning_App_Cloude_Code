import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { DecimalesDirective } from '../decimales.directive';

/**
 * Ejercicio 6.1 — campo numérico con decimales limitados.
 *
 * El número de decimales permitido se elige con los botones y se pasa a la
 * directiva mediante `[appDecimales]="decimales()"`. Al cambiarlo, el SETTER de
 * la directiva se ejecuta de nuevo. Escribe en el campo para ver el límite.
 */
@Component({
  selector: 'app-decimales-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalesDirective],
  templateUrl: './decimales-exercise.html',
  styleUrl: './decimales-exercise.scss',
})
export class DecimalesExercise {
  /** Decimales permitidos (se enlaza a la directiva). */
  protected readonly decimales = signal(2);

  /** Opciones del selector. */
  protected readonly opciones = [0, 1, 2, 3];

  protected setDecimales(n: number): void {
    this.decimales.set(n);
  }
}
