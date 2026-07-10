import { Component, ChangeDetectionStrategy, signal, OnInit, DestroyRef, inject } from '@angular/core';
import { Subject, EMPTY, Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * EJERCICIO 9.5 — concatMap: cola secuencial
 * ----------------------------------------------------------------------------
 * Demuestra cómo concatMap procesa los Observables internos de uno en uno,
 * en el mismo orden en que se emitieron. A diferencia de mergeMap (paralelo),
 * concatMap no empieza el siguiente hasta que el anterior completa.
 *
 * Completa los tres TODOs. Para ver el orden garantizado:
 *   1. Resuelve TODO 1 y TODO 2: añade varios userIds a la cola y observa
 *      que los resultados aparecen en el mismo orden de inserción.
 *   2. Resuelve TODO 3: añade delay(1500) y verás la espera entre peticiones,
 *      confirmando que concatMap nunca lanza dos peticiones a la vez.
 */

export interface ResultadoProcesado {
  userId: number;
  posts: Post[];
}

interface Post {
  userId: number;
  id: number;
  title: string;
}

export const USER_IDS_DISPONIBLES = [1, 2, 3, 4, 5];

@Component({
  selector: 'app-concat-map-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './concat-map-exercise.html',
  styleUrl: './concat-map-exercise.scss',
})
export class ConcatMapExercise implements OnInit {
  // TODO 1: inyecta HttpClient con inject(). Necesario para la llamada HTTP.
  // Importa: import { HttpClient } from '@angular/common/http'
  // private readonly http = inject(HttpClient);

  private readonly destroyRef = inject(DestroyRef);

  // Subject: cada botón "Añadir" emite el userId correspondiente.
  private readonly colaSubject = new Subject<number>();

  protected readonly userIdsDisponibles = USER_IDS_DISPONIBLES;

  // Cola visual: userIds pendientes de ser procesados.
  protected readonly cola = signal<number[]>([]);

  // userId que concatMap está procesando en este momento.
  protected readonly procesando = signal<number | null>(null);

  // Resultados: llegan SIEMPRE en el orden de inserción en la cola.
  protected readonly procesados = signal<ResultadoProcesado[]>([]);

  ngOnInit(): void {
    this.colaSubject
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        // concatMap: solo tiene un Observable interno activo a la vez.
        // Si la fuente emite mientras el anterior aún no ha completado,
        // el nuevo valor se encola internamente y espera su turno.
        // Garantiza orden FIFO estricto.
        //
        // TODO 2: sustituye el bloque de abajo por la llamada HTTP real.
        // concatMap(userId => {
        //   this.procesando.set(userId);       // marca qué userId se está cargando
        //   return this.http
        //     .get<Post[]>(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
        //     .pipe(
        //       // TODO 3: delay(1500) hace visible la espera entre peticiones.
        //       // Sin él todas completan casi al instante y el efecto de cola
        //       // secuencial no se puede apreciar visualmente.
        //       // Importa: import { delay } from 'rxjs/operators'
        //       // delay(1500),
        //       map(posts => ({ userId, posts: posts.slice(0, 2) })),
        //     );
        // }),
        //
        // Sin TODO 2, concatMap encola los valores pero EMPTY no emite nada:
        // el subscribe no recibe resultados y la cola visual permanece.
        concatMap(() => EMPTY as Observable<ResultadoProcesado>),
      )
      .subscribe(resultado => {
        // Resultado disponible: siempre en el mismo orden de inserción.
        this.procesados.update(r => [...r, resultado]);
        this.procesando.set(null);
        this.cola.update(q => q.slice(1));
      });
  }

  protected onAnadirACola(userId: number): void {
    this.cola.update(q => [...q, userId]);
    // Emite en el Subject: concatMap lo encola internamente si ya hay uno activo.
    this.colaSubject.next(userId);
  }

  protected onReset(): void {
    this.procesados.set([]);
    this.cola.set([]);
    this.procesando.set(null);
  }
}
