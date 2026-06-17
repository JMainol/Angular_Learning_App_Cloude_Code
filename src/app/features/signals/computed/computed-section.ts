import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CodeBlock } from '../../../shared/ui/code-block/code-block';
import { ComputedExercise } from './computed-exercise/computed-exercise';

/**
 * Sección 2.4 — `Computed`.
 *
 * Valores derivados de otros signals. El ejercicio en vivo es un carrito donde
 * subtotal, IVA y total se calculan a partir de precio y cantidad.
 */
@Component({
  selector: 'app-computed-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell, CodeBlock, ComputedExercise],
  templateUrl: './computed-section.html',
})
export class ComputedSection {
  protected readonly docUrl = 'https://angular.dev/guide/signals#computed-signals';

  protected readonly theory =
    'Un Computed es un Signal de solo lectura cuyo valor se deriva de otros signals. Se crea con `computed(() => ...)`.\n' +
    'Angular detecta automáticamente qué signals lees dentro de la función y los registra como dependencias: el computed se recalcula solo cuando alguna de ellas cambia.\n' +
    'Además memoiza: si las dependencias no han cambiado, devuelve el último valor calculado sin reejecutar la función. Por eso es el sitio ideal para lógica derivada, en lugar de duplicar cálculos en la plantilla.';

  protected readonly simile =
    'Un Computed es como la celda de una hoja de cálculo con una fórmula (=A1*B1): no escribes su resultado a mano, escribes de qué depende. Cuando cambias A1 o B1, la celda se actualiza sola; si no tocas nada, conserva su valor sin recalcular.';

  protected readonly examples = [
    'Calcular el total de un carrito a partir de precio y cantidad.',
    'Derivar el número de tareas pendientes de una lista de tareas.',
    'Componer un nombre completo a partir de nombre y apellidos.',
  ];

  /** Código del ejercicio (con TODOs). */
  protected readonly exerciseCode = `// Signals de origen
protected readonly precioUnitario = signal(12);
protected readonly cantidad = signal(1);

// Ejemplo resuelto: se deriva de precio y cantidad.
protected readonly subtotal = computed(
  () => this.precioUnitario() * this.cantidad()
);

// TODO 1: el IVA depende del subtotal (un computed puede usar otro computed).
protected readonly iva = computed(() => this.subtotal() * this.IVA);

// TODO 2: el total suma subtotal + iva.
protected readonly total = computed(() => this.subtotal() + this.iva());`;
}
