import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { IfExercise } from './if-exercise/if-exercise';

/**
 * Sección 1.1 — `@if`.
 *
 * Solo aporta el *contenido* (teoría, símil, ejemplos y el código del ejercicio):
 * la disposición de las dos mitades la pone `SectionShell`. El ejercicio en vivo
 * (`IfExercise`) se proyecta en la mitad derecha, y su código con TODOs se muestra
 * en la izquierda mediante `CodeBlock`.
 */
@Component({
  selector: 'app-if-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, IfExercise, TranslatePipe],
  templateUrl: './if-section.html',
})
export class IfSection {
  protected readonly docUrl = 'https://angular.dev/guide/templates/control-flow#if-block-conditionals';

  // Teoría, símil y ejemplos se leen por clave desde los JSON de idioma
  // (sections.if.*) con el pipe `translate` en la plantilla. El código del
  // ejercicio (sandbox que el alumno edita) se mantiene aquí, en español.

  /** Código del ejercicio (con TODOs) que se muestra en el bloque copiable. */
  protected readonly exerciseCode = `@if (estado() === 'cargando') {
  <p class="state state--loading">Cargando sesión…</p>
}

<!-- TODO 1: rama @else if para 'error' (mensaje con clase .state--error). -->

<!-- TODO 2: rama @else if para 'autenticado' usando el alias 'as':
     @if (usuario(); as u) { ...muestra u.nombre y u.rol... } -->

@else {
  <!-- TODO 3: deja aquí solo el caso 'anonimo' (invitar a iniciar sesión). -->
  <p class="state">Estado pendiente: {{ estado() }}</p>
}`;
}
