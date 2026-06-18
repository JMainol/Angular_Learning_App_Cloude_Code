import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { SwitchExercise } from './switch-exercise/switch-exercise';

/**
 * Sección 1.3 — `@switch`.
 *
 * Mismo patrón que 1.1 y 1.2: el componente aporta el contenido y `SectionShell`
 * dispone las dos mitades. El ejercicio en vivo (`SwitchExercise`) se proyecta en
 * la mitad derecha.
 */
@Component({
  selector: 'app-switch-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, SwitchExercise, TranslatePipe],
  templateUrl: './switch-section.html',
})
export class SwitchSection {
  protected readonly docUrl = 'https://angular.dev/guide/templates/control-flow#conditionally-display-content-with-switch';

  // Teoría, símil y ejemplos se leen por clave desde los JSON de idioma
  // (sections.switch.*) con el pipe `translate` en la plantilla. El código del
  // ejercicio (sandbox que el alumno edita) se mantiene aquí, en español.

  /** Código del ejercicio (con TODOs) que se muestra en el bloque copiable. */
  protected readonly exerciseCode = `@switch (estado()) {
  @case ('pendiente') {
    <div class="status status--pendiente">
      <span class="status__icon">⏳</span>
      <p class="status__text">Tu pedido está pendiente de preparación.</p>
    </div>
  }

  <!-- TODO 1: @case ('enviado')   → pedido en camino (🚚). -->
  <!-- TODO 2: @case ('entregado') → mensaje de éxito (✅). -->
  <!-- TODO 3: @default            → cualquier otro caso (p. ej. 'cancelado'). -->
}`;
}
