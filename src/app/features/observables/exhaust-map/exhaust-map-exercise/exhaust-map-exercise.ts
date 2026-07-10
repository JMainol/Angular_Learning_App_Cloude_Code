import { Component, ChangeDetectionStrategy, signal, OnInit, DestroyRef, inject } from '@angular/core';
import { Subject, EMPTY, Observable } from 'rxjs';
import { tap, exhaustMap, finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * EJERCICIO 9.3 — exhaustMap: botón anti-doble-clic
 * ----------------------------------------------------------------------------
 * Demuestra cómo exhaustMap descarta las emisiones que llegan mientras el
 * Observable interno (la petición HTTP) aún no ha completado. A diferencia de
 * switchMap, NO cancela la petición en curso: la deja terminar y simplemente
 * ignora todo lo que llegue mientras está activa.
 *
 * Completa los tres TODOs. Para ver el efecto de ignorar:
 *   1. Resuelve TODO 1 y TODO 2: el botón cargará el perfil de usuario.
 *   2. Resuelve TODO 3: añade delay(2000) y pulsa el botón varias veces seguido.
 *      El contador "clics ignorados" subirá: exhaustMap los está descartando.
 */

interface Usuario {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: { name: string };
}

@Component({
  selector: 'app-exhaust-map-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './exhaust-map-exercise.html',
  styleUrl: './exhaust-map-exercise.scss',
})
export class ExhaustMapExercise implements OnInit {
  // TODO 1: inyecta HttpClient con inject(). Es necesario para llamar a la API.
  // Importa: import { HttpClient } from '@angular/common/http'
  // private readonly http = inject(HttpClient);

  private readonly destroyRef = inject(DestroyRef);

  // Subject: cada clic del botón emite el userId que se quiere cargar.
  private readonly clickSubject = new Subject<number>();

  // proximoUserId: userId que cargará el próximo clic (se muestra en el botón).
  protected readonly proximoUserId = signal(1);

  protected readonly usuario = signal<Usuario | null>(null);
  protected readonly estado = signal<'idle' | 'cargando' | 'resultado'>('idle');

  // enVuelo: true mientras hay una petición HTTP activa. exhaustMap ignorará
  // cualquier emisión del clickSubject mientras este flag sea verdadero.
  protected readonly enVuelo = signal(false);

  // clicksIgnorados: contador de clics que llegaron mientras enVuelo era true.
  protected readonly clicksIgnorados = signal(0);

  ngOnInit(): void {
    this.clickSubject
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.estado.set('cargando');
          this.enVuelo.set(true);
          this.usuario.set(null);
        }),
        // exhaustMap: mientras el Observable interno (HTTP) esté activo,
        // las nuevas emisiones del clickSubject se descartan en silencio.
        // Solo cuando la petición actual termina (completa o error) vuelve
        // a aceptar la siguiente emisión.
        //
        // TODO 2: sustituye el bloque de abajo por la llamada HTTP real.
        // exhaustMap(userId =>
        //   this.http
        //     .get<Usuario>(`https://jsonplaceholder.typicode.com/users/${userId}`)
        //     .pipe(
        //       // TODO 3: añade delay(2000) para abrir una ventana de tiempo en la
        //       // que los clics sean descartados y el contador suba. Sin él la
        //       // respuesta llega tan rápido que exhaustMap nunca necesita ignorar.
        //       // Importa: import { delay } from 'rxjs/operators'
        //       // delay(2000),
        //       //
        //       // finalize se ejecuta siempre al terminar (éxito o error).
        //       // Es el momento más seguro para marcar enVuelo como false.
        //       finalize(() => this.enVuelo.set(false)),
        //     )
        // ),
        //
        // EMPTY completa sin emitir: enVuelo vuelve a false inmediatamente.
        // El subscribe nunca recibe datos hasta que resuelvas el TODO 2.
        exhaustMap(() => (EMPTY as Observable<Usuario>).pipe(
          finalize(() => this.enVuelo.set(false)),
        )),
      )
      .subscribe(usuario => {
        this.usuario.set(usuario);
        this.estado.set('resultado');
      });
  }

  protected onClickCargar(): void {
    // Si hay una petición activa, exhaustMap ignorará la emisión del Subject.
    // Aquí llevamos la cuenta de esos clics para hacerlo visible en pantalla.
    if (this.enVuelo()) {
      this.clicksIgnorados.update(n => n + 1);
    }
    this.clickSubject.next(this.proximoUserId());
    this.proximoUserId.update(id => (id >= 10 ? 1 : id + 1));
  }
}
