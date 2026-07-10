import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

/**
 * Contenedor del ejercicio 12.2 — ResolveFn.
 *
 * Muestra un badge "Resolviendo..." mientras el router ejecuta perfilResolver
 * (visible gracias al delay de 700 ms del servicio simulado). Es la prueba
 * visual de que el componente NO se activa hasta que el Observable completa.
 */
@Component({
  selector: 'app-resolve-exercise',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './resolve-exercise.html',
  styleUrl: './resolve-exercise.scss',
})
export class ResolveExercise {
  // toSignal convierte el Observable de eventos del router en un Signal reactivo.
  // Se pone a true con NavigationStart y a false cuando la navegación termina/falla.
  protected readonly resolviendo = toSignal(
    inject(Router).events.pipe(
      filter(
        (e) =>
          e instanceof NavigationStart ||
          e instanceof NavigationEnd ||
          e instanceof NavigationCancel ||
          e instanceof NavigationError,
      ),
      map((e) => e instanceof NavigationStart),
    ),
    { initialValue: false },
  );
}
