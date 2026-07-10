import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { DesubscribirseExercise } from './desubscribirse-exercise/desubscribirse-exercise';

@Component({
  selector: 'app-desubscribirse-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, DesubscribirseExercise, TranslatePipe],
  templateUrl: './desubscribirse-section.html',
})
export class DesubscribirseSection {
  protected readonly docUrl =
    'https://angular.dev/ecosystem/rxjs-interop#takeuntildestroyed';

  // Código del ejercicio que se muestra en la columna izquierda (con los TODOs).
  // Mostramos solo los fragmentos relevantes, no el componente completo.
  protected readonly exerciseCode = `import { DestroyRef, inject } from '@angular/core';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// TODO 1: inyecta DestroyRef con inject(). Angular lo proporciona como token
// para saber cuándo el componente se destruye, sin implementar OnDestroy.
// private readonly destroyRef = inject(DestroyRef);

protected readonly precio = signal(100.00);
protected readonly historial = signal<string[]>(['100.00 €']);
protected readonly suscripcionActiva = signal(true);

ngOnInit(): void {
  interval(1000)
    .pipe(
      // TODO 2: encadena takeUntilDestroyed(this.destroyRef) aquí.
      // RxJS completará el Observable automáticamente al destruirse el
      // componente: no queda ningún intervalo corriendo en segundo plano.
      map(() => {
        const delta = +(Math.random() * 10 - 5).toFixed(2);
        return Math.max(1, +(this.precio() + delta).toFixed(2));
      }),
    )
    .subscribe((nuevoPrecio) => {
      this.precio.set(nuevoPrecio);
      this.historial.update(
        (h) => [\`\${nuevoPrecio.toFixed(2)} €\`, ...h.slice(0, 4)]
      );
    });

  // TODO 3: registra un callback con destroyRef.onDestroy().
  // Es el equivalente funcional de ngOnDestroy, sin implementar la interfaz.
  // this.destroyRef.onDestroy(() => this.suscripcionActiva.set(false));
}`;
}
