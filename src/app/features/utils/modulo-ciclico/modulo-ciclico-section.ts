import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { ModuloCiclicoExercise } from './modulo-ciclico-exercise/modulo-ciclico-exercise';

/**
 * Sección 15.1 — Iteración cíclica con módulo (`%`).
 *
 * Primera sección del bloque "Funciones útiles": patrones de JavaScript puro
 * que aparecen una y otra vez en componentes Angular. Por eso el enlace de
 * documentación apunta a MDN y no a angular.dev.
 */
@Component({
  selector: 'app-modulo-ciclico-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, ModuloCiclicoExercise, TranslatePipe],
  templateUrl: './modulo-ciclico-section.html',
})
export class ModuloCiclicoSection {
  protected readonly docUrl =
    'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Remainder';

  /** Código del ejercicio (con TODOs). */
  protected readonly exerciseCode = `// La lista es fija; el índice solo crece (0, 1, 2… 12, 13…).
protected readonly equipo = ['Ana', 'Bruno', 'Carla', 'David', 'Elena'];
protected readonly indice = signal(0);

// Ejemplo resuelto: avanzar es solo sumar 1, sin resetear nunca.
protected siguiente(): void {
  this.indice.update((i) => i + 1);
}

// TODO 1: aplica el módulo para que el índice "dé la vuelta":
//   this.equipo[this.indice() % this.equipo.length]
protected readonly personaActual = computed(
  () => this.equipo[this.indice()] ?? '¡fuera de rango!'
);

// TODO 2: retroceder sin caer en negativos (en JS, -1 % 5 = -1).
// Truco: (i - 1 + this.equipo.length) % this.equipo.length
protected anterior(): void {
  // ...
}

// TODO 3: vueltas completas. El módulo da el resto;
// la división entera (Math.floor) da las vueltas.
protected readonly vueltas = computed(() => 0);`;
}
