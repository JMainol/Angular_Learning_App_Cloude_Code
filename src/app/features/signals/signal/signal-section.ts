import { Component, ChangeDetectionStrategy } from '@angular/core';
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
  imports: [SectionShell, CodeBlock, SignalExercise],
  templateUrl: './signal-section.html',
})
export class SignalSection {
  protected readonly docUrl = 'https://angular.dev/guide/signals';

  protected readonly theory =
    'Un Signal es un contenedor de un valor que avisa a quien lo usa cuando ese valor cambia. Se crea con `signal(valorInicial)`.\n' +
    'Se LEE llamándolo como una función (`contador()`) y se ESCRIBE con `.set(valor)` (reemplazar) o `.update(fn)` (calcular a partir del valor actual).\n' +
    'Angular registra automáticamente qué partes de la plantilla leen cada Signal, así que solo se reevalúa lo que depende de él: detección de cambios fina y sin `Zone.js` ni `ngOnChanges`.';

  protected readonly simile =
    'Un Signal es como el marcador de un partido: guarda un número que todos en el estadio miran. Cuando el árbitro lo cambia (`.set()` pone un resultado nuevo; `.update()` es "+1 al actual"), todas las miradas se actualizan a la vez sin que nadie tenga que preguntar "¿cuánto vamos?".';

  protected readonly examples = [
    'Llevar el estado de un contador o del aforo de una sala.',
    'Guardar el valor actual de un campo de formulario.',
    'Controlar un flag de visibilidad (abierto/cerrado, mostrado/oculto).',
  ];

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
