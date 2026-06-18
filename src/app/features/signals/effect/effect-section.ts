import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { EffectExercise } from './effect-exercise/effect-exercise';

/**
 * Sección 2.5 — `Effect`.
 *
 * Efectos secundarios que reaccionan a cambios de signals. El ejercicio en vivo
 * es un contador cuyo effect registra cada cambio en una "consola" y lo persiste.
 */
@Component({
  selector: 'app-effect-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, EffectExercise, TranslatePipe],
  templateUrl: './effect-section.html',
})
export class EffectSection {
  protected readonly docUrl = 'https://angular.dev/guide/signals#effects';

  /** Código del ejercicio (con TODOs). */
  protected readonly exerciseCode = `protected readonly contador = signal(0);
protected readonly registro = signal<string[]>([]);

constructor() {
  effect(() => {
    const valor = this.contador(); // dependencia: se reejecuta cuando cambie

    // Ejemplo resuelto:
    console.log('[effect] contador =', valor);

    // TODO 1: registrar en pantalla
    this.registro.update((l) => [\`contador → \${valor}\`, ...l]);

    // TODO 2: persistir
    localStorage.setItem('contador', String(valor));
  });
}`;
}
