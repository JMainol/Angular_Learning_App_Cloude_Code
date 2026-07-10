import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
// toSignal: el puente oficial entre RxJS y Signals (disponible desde Angular 16).
// Importa desde rxjs-interop, no desde @angular/core directamente.
import { toSignal } from '@angular/core/rxjs-interop';

interface Repositorio {
  nombre: string;
  estrellas: number;
  lenguaje: string;
}

// Clase simple (no @Injectable) que simula una llamada HTTP con delay.
// En una app real sería un servicio inyectado vía inject().
class RepositorioService {
  getRepos(): Observable<Repositorio[]> {
    return of([
      { nombre: 'angular', estrellas: 95_432, lenguaje: 'TypeScript' },
      { nombre: 'rxjs',    estrellas: 30_218, lenguaje: 'TypeScript' },
      { nombre: 'ngrx',    estrellas:  8_104, lenguaje: 'TypeScript' },
    ]).pipe(delay(1800));
  }
}

/**
 * EJERCICIO 3.7 — `toSignal`
 * -----------------------------------------------------------------------
 * El panel "Clásico" ya funciona con Observable + async pipe.
 * Completa los TODO para hacer funcionar el panel "Signal" y ver el contraste.
 */
@Component({
  selector: 'app-to-signal-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe],
  templateUrl: './to-signal-exercise.html',
  styleUrl: './to-signal-exercise.scss',
})
export class ToSignalExercise {
  private readonly service = new RepositorioService();

  // Observable de origen: lo usa el panel "Clásico" con async pipe.
  protected readonly repos$ = this.service.getRepos();

  /**
   * TODO 1: Convierte el Observable en Signal.
   *
   * `toSignal()` se suscribe internamente y destruye la suscripción
   * al destruirse el componente: sin takeUntilDestroyed ni unsubscribe().
   * `initialValue` evita que el valor sea `undefined` antes de la primera
   * emisión, lo que permite usar repos() en @for directamente.
   *
   *   protected readonly repos = toSignal(this.repos$, {
   *     initialValue: [] as Repositorio[],
   *   });
   */

  /**
   * TODO 2: Signal de estado de carga desde el mismo Observable.
   *
   * Truco: map(() => false) transforma cada emisión en `false` ("ya hay datos").
   * initialValue: true hace que arranque en `true` (cargando) y pase a `false`
   * automáticamente en cuanto el Observable emite, sin lógica extra.
   *
   *   protected readonly cargando = toSignal(
   *     this.repos$.pipe(map(() => false)),
   *     { initialValue: true },
   *   );
   */
}
