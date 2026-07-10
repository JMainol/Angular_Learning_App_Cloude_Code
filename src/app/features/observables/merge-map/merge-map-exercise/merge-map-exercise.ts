import { Component, ChangeDetectionStrategy, signal, OnInit, DestroyRef, inject } from '@angular/core';
import { Subject, EMPTY, Observable } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * EJERCICIO 9.4 — mergeMap: carga paralela
 * ----------------------------------------------------------------------------
 * Demuestra cómo mergeMap lanza todos los Observables internos en paralelo sin
 * cancelar ni ignorar ninguno. Al marcar un checkbox se dispara una petición
 * HTTP; todas las peticiones activas corren a la vez y los resultados llegan
 * en el orden en que la API responde (no en el orden de los checkboxes).
 *
 * Completa los tres TODOs. Para ver la concurrencia:
 *   1. Resuelve TODO 1 y TODO 2: marca varios checkboxes seguidos y observa
 *      que los resultados aparecen a medida que llegan, no en orden fijo.
 *   2. Resuelve TODO 3: añade delay(Math.random() * 2000) y verás que el
 *      orden de llegada de las respuestas es impredecible.
 */

export interface ResultadoUsuario {
  userId: number;
  posts: Post[];
}

interface Post {
  userId: number;
  id: number;
  title: string;
}

// userIds disponibles para seleccionar con checkboxes
export const USER_IDS = [1, 2, 3, 4, 5];

@Component({
  selector: 'app-merge-map-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './merge-map-exercise.html',
  styleUrl: './merge-map-exercise.scss',
})
export class MergeMapExercise implements OnInit {
  // TODO 1: inyecta HttpClient con inject(). Necesario para la llamada HTTP.
  // Importa: import { HttpClient } from '@angular/common/http'
  // private readonly http = inject(HttpClient);

  private readonly destroyRef = inject(DestroyRef);

  // Subject: emite el userId de cada checkbox que se marca.
  private readonly checkSubject = new Subject<number>();

  protected readonly userIds = USER_IDS;
  protected readonly seleccionados = signal<number[]>([]);
  protected readonly resultados = signal<ResultadoUsuario[]>([]);

  ngOnInit(): void {
    this.checkSubject
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        // mergeMap suscribe un Observable interno por cada emisión del fuente
        // y los mantiene TODOS activos en paralelo. A diferencia de switchMap
        // (cancela el anterior) y exhaustMap (ignora los nuevos), mergeMap
        // deja que todos corran concurrentemente.
        //
        // TODO 2: sustituye EMPTY por la llamada HTTP real.
        // mergeMap(userId =>
        //   this.http
        //     .get<Post[]>(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
        //     .pipe(
        //       // TODO 3: delay con valor aleatorio para simular latencias distintas
        //       // y que las respuestas lleguen fuera de orden. Sin él todas llegan
        //       // casi a la vez y el efecto de concurrencia es menos visible.
        //       // Importa: import { delay } from 'rxjs/operators'
        //       // delay(Math.random() * 2000),
        //       map(posts => ({ userId, posts: posts.slice(0, 3) })),
        //     )
        // ),
        mergeMap(() => EMPTY as Observable<ResultadoUsuario>),
      )
      .subscribe(resultado => {
        // Cada respuesta llega de forma independiente y se acumula.
        // El orden de aparición depende de cuándo responde la API, no del checkbox.
        this.resultados.update(r => [...r, resultado]);
      });
  }

  protected onToggle(userId: number, event: Event): void {
    const marcado = (event.target as HTMLInputElement).checked;
    if (marcado) {
      this.seleccionados.update(ids => [...ids, userId]);
      // Emite el userId en el Subject: mergeMap lanzará su petición en paralelo
      this.checkSubject.next(userId);
    } else {
      this.seleccionados.update(ids => ids.filter(id => id !== userId));
      this.resultados.update(r => r.filter(res => res.userId !== userId));
    }
  }

  protected estaSeleccionado(userId: number): boolean {
    return this.seleccionados().includes(userId);
  }
}
