import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { ToSignalExercise } from './to-signal-exercise/to-signal-exercise';

/**
 * Sección 3.7 — `toSignal`.
 *
 * Puente entre RxJS y la API de Signals. El ejercicio muestra en paralelo
 * el enfoque clásico (Observable + async pipe) y el moderno (toSignal),
 * incluyendo la gestión del estado de carga con initialValue.
 */
@Component({
  selector: 'app-to-signal-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, ToSignalExercise, TranslatePipe],
  templateUrl: './to-signal-section.html',
})
export class ToSignalSection {
  protected readonly docUrl = 'https://angular.dev/guide/rxjs-interop#tosignal';

  /** Código del ejercicio (con TODOs). */
  protected readonly exerciseCode = `import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

// Observable original del servicio (o de HttpClient).
protected readonly repos$ = this.service.getRepos();

// TODO 1: convierte el Observable en Signal.
// toSignal() se suscribe solo y destruye la suscripción
// al destruir el componente: sin takeUntilDestroyed ni unsubscribe().
protected readonly repos = toSignal(this.repos$, {
  initialValue: [] as Repositorio[],
});

// TODO 2: Signal de estado de carga desde el mismo Observable.
// initialValue: true → arranca "cargando".
// map(() => false) → pasa a false cuando el Observable emite.
protected readonly cargando = toSignal(
  this.repos$.pipe(map(() => false)),
  { initialValue: true },
);

// En el template, sin async pipe:
// @if (cargando()) { ... spinner ... }
// @for (repo of repos(); track repo.nombre) { ... }`;
}
