import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { ForExercise } from './for-exercise/for-exercise';

/**
 * Sección 1.2 — `@for`.
 *
 * Mismo patrón que 1.1: aporta el contenido (teoría, símil, ejemplos y el código
 * del ejercicio) y deja que `SectionShell` disponga las dos mitades. El ejercicio
 * en vivo (`ForExercise`) se proyecta en la mitad derecha.
 */
@Component({
  selector: 'app-for-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, ForExercise, TranslatePipe],
  templateUrl: './for-section.html',
})
export class ForSection {
  protected readonly docUrl = 'https://angular.dev/guide/templates/control-flow#repeat-content-with-the-for-block';

  // Teoría, símil y ejemplos se leen por clave desde los JSON de idioma
  // (sections.for.*) con el pipe `translate` en la plantilla. El código del
  // ejercicio (sandbox que el alumno edita) se mantiene aquí, en español.

  /** Código del ejercicio (con TODOs) que se muestra en el bloque copiable. */
  protected readonly exerciseCode = `<ul class="list">
  @for (tarea of tareas(); track $index) {
    <!-- TODO 5b: marca la última fila con [class.row--ultima]="$last".
         TODO 6: alterna el fondo con [class.row--par]="$even". -->
    <li class="row">
      <!-- TODO 2: muestra la posición con $index (empieza en 0).
           TODO 4: añade el total con $count para leer "1/5", "2/5"… -->
      <span class="row__num">·</span>

      <span class="row__text">{{ tarea.texto }}</span>

      <!-- TODO 5a: envuelve este badge en @if ($first) { … }. -->
      <span class="row__badge">siguiente</span>

      <span class="row__tag">{{ tarea.prioridad }}</span>
    </li>
  }

  <!-- TODO 3: añade un bloque @empty con un mensaje para la lista vacía. -->
</ul>

<!-- TODO 1: cambia 'track $index' por 'track tarea.id' (identidad estable). -->`;
}
