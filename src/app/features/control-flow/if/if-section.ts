import { Component, ChangeDetectionStrategy } from '@angular/core';
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
  imports: [SectionShell, CodeBlock, IfExercise],
  templateUrl: './if-section.html',
})
export class IfSection {
  protected readonly docUrl = 'https://angular.dev/guide/templates/control-flow#if-block-conditionals';

  protected readonly theory =
    '`@if` es el bloque de control de flujo de Angular para renderizar contenido de forma condicional directamente en la plantilla, sustituyendo a la antigua directiva `*ngIf`.\n' +
    'Admite `@else if` y `@else` para encadenar condiciones, y la sintaxis `@if (expr; as variable)` para capturar el valor evaluado en un alias tipado y no nulo.\n' +
    'Al ser sintaxis nativa del compilador (no una directiva), es más rápido, no necesita importarse y el contenido oculto ni siquiera se crea en el DOM.';

  protected readonly simile =
    'Piensa en `@if` como el portero de un local: comprueba una condición en la puerta y solo deja pasar el contenido que la cumple. `@else if` son sus normas adicionales ("si no cumples esto, mira si cumples aquello") y `@else` es la puerta de salida por defecto para todo lo que no encaja en ninguna norma.';

  protected readonly examples = [
    'Mostrar un spinner mientras cargan los datos y el contenido cuando llegan.',
    'Renderizar un bloque solo si el usuario tiene cierto rol o permiso.',
    'Enseñar un mensaje de "lista vacía" cuando no hay elementos que mostrar.',
  ];

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
