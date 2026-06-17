import { Component, ChangeDetectionStrategy } from '@angular/core';
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
  imports: [SectionShell, CodeBlock, ForExercise],
  templateUrl: './for-section.html',
})
export class ForSection {
  protected readonly docUrl = 'https://angular.dev/guide/templates/control-flow#repeat-content-with-the-for-block';

  protected readonly theory =
    '`@for` repite un trozo de plantilla por cada elemento de una colección, sustituyendo a la antigua directiva `*ngFor`.\n' +
    'Es obligatorio declarar `track`: la expresión que identifica de forma única a cada elemento para que Angular sepa cuáles reutilizar, mover o destruir cuando la lista cambia (clave para el rendimiento).\n' +
    'Ofrece variables contextuales (`$index`, `$count`, `$first`, `$last`, `$even`, `$odd`) y un bloque `@empty` que se muestra cuando la colección está vacía.';

  protected readonly simile =
    'Imagina una imprenta de sellos: `@for` estampa la misma plantilla una vez por cada elemento de la lista. El `track` es el número de serie de cada copia: gracias a él, cuando la lista cambia, la imprenta sabe qué sellos conservar y cuáles rehacer en lugar de reimprimirlo todo desde cero.';

  protected readonly examples = [
    'Pintar una rejilla de productos o tarjetas a partir de un array.',
    'Generar las filas de una tabla desde los datos de una API.',
    'Combinarlo con `@empty` para mostrar un estado de "no hay resultados".',
  ];

  /** Código del ejercicio (con TODOs) que se muestra en el bloque copiable. */
  protected readonly exerciseCode = `<ul class="list">
  @for (tarea of tareas(); track $index) {
    <li class="row">
      <!-- TODO 2: muestra la posición con $index (empieza en 0). -->
      <span class="row__num">·</span>

      <span class="row__text">{{ tarea.texto }}</span>
      <span class="row__tag">{{ tarea.prioridad }}</span>
    </li>
  }

  <!-- TODO 3: añade un bloque @empty con un mensaje para la lista vacía. -->
</ul>

<!-- TODO 1: cambia 'track $index' por 'track tarea.id' (identidad estable). -->`;
}
