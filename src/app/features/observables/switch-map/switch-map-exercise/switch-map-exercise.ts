import { Component, ChangeDetectionStrategy, signal, OnInit, DestroyRef, inject } from '@angular/core';
import { Subject, EMPTY, Observable } from 'rxjs';
import { filter, debounceTime, tap, switchMap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * EJERCICIO 9.2 — switchMap: buscador en tiempo real
 * ----------------------------------------------------------------------------
 * Demuestra cómo switchMap cancela la petición HTTP anterior cada vez que el
 * usuario introduce un nuevo userId, evitando respuestas desordenadas.
 *
 * El ejercicio usa JSONPlaceholder (API pública real, sin auth) más un delay
 * artificial para que la cancelación sea visible aunque la red sea rápida.
 *
 * Completa los tres TODOs. Para ver el efecto de cancelación:
 *   1. Resuelve TODO 1 y TODO 2: verás los posts cargarse al escribir un userId.
 *   2. Resuelve TODO 3: escribe "2", "5", "8" seguido y rápido; solo el último
 *      mostrará posts porque switchMap canceló los anteriores.
 */

interface Post {
  userId: number;
  id: number;
  title: string;
}

@Component({
  selector: 'app-switch-map-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './switch-map-exercise.html',
  styleUrl: './switch-map-exercise.scss',
})
export class SwitchMapExercise implements OnInit {
  // TODO 1: inyecta HttpClient con inject(). Es necesario para llamar a la API.
  // Importa: import { HttpClient } from '@angular/common/http'
  // private readonly http = inject(HttpClient);

  // DestroyRef cancela la suscripción automáticamente al destruirse el componente.
  private readonly destroyRef = inject(DestroyRef);

  // Subject: puente entre el evento DOM (input) y el pipeline RxJS.
  // Cada llamada a .next() introduce un nuevo valor en el stream.
  private readonly busquedaSubject = new Subject<string>();

  protected readonly userId = signal('');
  protected readonly posts = signal<Post[]>([]);
  protected readonly estado = signal<'idle' | 'buscando' | 'resultado'>('idle');

  ngOnInit(): void {
    this.busquedaSubject
      .pipe(
        // Cancela automáticamente al destruirse el componente.
        takeUntilDestroyed(this.destroyRef),

        // Solo procesa valores numéricos válidos (1–10).
        filter(v => v.length > 0 && +v >= 1 && +v <= 10),

        // Espera 400 ms tras la última pulsación antes de emitir.
        // Reduce peticiones innecesarias mientras el usuario escribe.
        debounceTime(400),

        // Actualiza el estado visual antes de lanzar la petición.
        tap(() => {
          this.estado.set('buscando');
          this.posts.set([]);
        }),

        // TODO 2: sustituye la línea de abajo por el switchMap real.
        //
        // switchMap recibe el userId y devuelve un Observable (la petición HTTP).
        // Cuando llega un nuevo userId, switchMap CANCELA el Observable anterior
        // y se suscribe al nuevo: solo la última petición puede emitir al subscribe.
        //
        // switchMap(userId =>
        //   this.http
        //     .get<Post[]>(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
        //     .pipe(
        //       // TODO 3: añade delay(1500) para ralentizar artificialmente la
        //       // respuesta y hacer visible la cancelación. Sin él la red es tan
        //       // rápida que parece que no hay cancelación. Con él puedes escribir
        //       // "2", "5", "8" rápido y solo aparecerán los posts del "8".
        //       // Importa: import { delay } from 'rxjs/operators'
        //       // delay(1500),
        //     )
        // ),
        //
        // EMPTY es un Observable que completa sin emitir nada.
        // Mientras no resuelvas el TODO 2, el subscribe nunca recibirá posts.
        switchMap(() => EMPTY as Observable<Post[]>),
      )
      .subscribe(posts => {
        this.posts.set(posts.slice(0, 5));
        this.estado.set('resultado');
      });
  }

  protected onInput(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.userId.set(valor);
    this.busquedaSubject.next(valor);
  }
}
