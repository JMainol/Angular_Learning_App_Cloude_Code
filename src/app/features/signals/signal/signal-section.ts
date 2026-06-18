import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { SignalExercise } from './signal-exercise/signal-exercise';

/**
 * Sección 2.1 — `Signal`.
 *
 * Mismo patrón que las secciones del Bloque 1. El ejercicio en vivo
 * (`SignalExercise`) se proyecta en la mitad derecha y su código (esta vez
 * TypeScript) se muestra a la izquierda.
 */
@Component({
  selector: 'app-signal-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, SignalExercise, TranslatePipe],
  templateUrl: './signal-section.html',
})
export class SignalSection {
  protected readonly docUrl = 'https://angular.dev/guide/signals';

  /** Código del ejercicio (con TODOs). Esta vez es TypeScript. */
  protected readonly exerciseCode = `// Crear el signal
protected readonly aforo = signal(0);

// Ejemplo resuelto: el nuevo valor depende del actual → .update()
protected entrar(): void {
  this.aforo.update((n) => Math.min(n + 1, this.AFORO_MAX));
}

// TODO 1: restar 1 sin bajar de 0 (usa .update() y Math.max).
protected salir(): void {
  // ...
}

// TODO 2: vaciar la sala. El valor no depende del actual → usa .set(0).
protected reiniciar(): void {
  // ...
}`;
}
