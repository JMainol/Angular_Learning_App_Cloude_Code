import { Component, ChangeDetectionStrategy } from '@angular/core';
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
  imports: [SectionShell, CodeBlock, EffectExercise],
  templateUrl: './effect-section.html',
})
export class EffectSection {
  protected readonly docUrl = 'https://angular.dev/guide/signals#effects';

  protected readonly theory =
    'Un Effect ejecuta una función cada vez que cambia alguno de los signals que lee dentro. Se crea con `effect(() => ...)`, normalmente en el constructor (necesita un injection context).\n' +
    'A diferencia de `computed()`, no devuelve un valor: su propósito son los EFECTOS SECUNDARIOS (logging, sincronizar con localStorage o el DOM, analítica…).\n' +
    'Angular lo limpia automáticamente al destruir el componente. Regla: para DERIVAR datos usa `computed`; reserva `effect` para provocar cosas fuera del mundo reactivo.';

  protected readonly simile =
    'Un Effect es como el sensor de luz de una farola: no calcula ni guarda nada para ti, simplemente observa una condición (anochece) y dispara una acción en el mundo real (encender la luz) cada vez que esa condición cambia.';

  protected readonly examples = [
    'Guardar una preferencia del usuario en localStorage cuando cambia.',
    'Registrar (log/analítica) cada vez que cambia un estado importante.',
    'Sincronizar un signal con algo externo: título del documento, foco, una librería no reactiva.',
  ];

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
