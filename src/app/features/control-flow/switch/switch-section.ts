import { Component, ChangeDetectionStrategy } from '@angular/core';
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
  imports: [SectionShell, CodeBlock, SwitchExercise],
  templateUrl: './switch-section.html',
})
export class SwitchSection {
  protected readonly docUrl = 'https://angular.dev/guide/templates/control-flow#conditionally-display-content-with-switch';

  protected readonly theory =
    '`@switch` elige qué bloque renderizar comparando un valor con varios `@case`, sustituyendo al antiguo `[ngSwitch]`.\n' +
    'La comparación es por igualdad estricta (`===`) y solo se muestra el primer `@case` que coincide; no hay "fallthrough", así que no necesitas `break`.\n' +
    'El bloque `@default` (opcional) se renderiza cuando ningún `@case` encaja. Es ideal cuando una sola variable decide entre varias vistas mutuamente excluyentes.';

  protected readonly simile =
    'Piensa en `@switch` como el selector de canales de una tele antigua: giras el dial (el valor) y solo se ve el canal que coincide con la posición; los demás permanecen apagados. `@default` es la pantalla de "sin señal" que aparece cuando el dial no apunta a ningún canal conocido.';

  protected readonly examples = [
    'Mostrar una vista distinta según el rol del usuario (admin, editor, invitado).',
    'Pintar un icono y color según el estado de una operación (éxito, aviso, error).',
    'Cambiar el contenido del panel según la pestaña seleccionada.',
  ];

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
